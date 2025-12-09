import { query, createConnection } from '$lib/db/mysql.js';
import { fail, redirect } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import * as m from '$lib/paraglide/messages/_index.js';
import { sendPrinterEmail } from '$lib/email/mailer.js';

export const load = async ({ params, locals }) => {
  const { variant_id } = params;

  // Load the selected variant and its parent product
  const variantRows = await query('SELECT * FROM product_variants WHERE id = ?', [variant_id]);
  const variantRaw = variantRows?.[0] || null;
  const variant = (() => {
    if (!variantRaw) return null;
    if (!variantRaw.option_values) return variantRaw;
    try {
      const opts =
        typeof variantRaw.option_values === 'string'
          ? JSON.parse(variantRaw.option_values)
          : variantRaw.option_values;
      return { ...variantRaw, color: opts?.color ?? null, size: opts?.size ?? null };
    } catch {
      return variantRaw;
    }
  })();
  if (!variant) {
    return { product: null, variant: null };
  }

  const productRows = await query('SELECT * FROM products WHERE id = ?', [variant.product_id]);
  const product = productRows?.[0] || null;

  // If user is logged in, load their previous uploads (most recent first)
  let uploads = [];
  if (locals?.user?.id) {
    uploads = await query(
      'SELECT id, image_url FROM uploads WHERE user_id = ? AND customisation_id IS NULL ORDER BY id DESC LIMIT 100',
      [locals.user.id]
    );
  }

  return { product, variant, uploads };
};

export const actions = {
  upload: async ({ request, locals, params }) => {
    const locale = locals?.locale ?? 'en';
    const user = locals?.user;
    if (!user) throw redirect(302, '/login');

    const { variant_id } = params;

    const form = await request.formData();
    const file = form.get('design');

    if (!file || typeof file === 'string') {
      return fail(400, { error: m.custom_upload_error_no_file({}, { locale }) });
    }

    // Validate file type and size
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return fail(400, { error: m.custom_upload_error_type({}, { locale }) });
    }
    if (file.size > 5_000_000) {
      return fail(400, { error: m.custom_upload_error_size({}, { locale }) });
    }

    // Create a unique, sanitized name for the blob using the variant id
    const originalName = String(file.name || 'upload');
    const safeName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
    const filename = `${user.id}-${variant_id}-${Date.now()}-${safeName || 'image'}`;

    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN // optional in production (auto handled by Vercel)
    });

    // Store the uploaded file URL in the DB and link to variant
    await query('INSERT INTO uploads (user_id, customisation_id, image_url) VALUES (?, NULL, ?)', [
      user.id,
      blob.url
    ]);

    return { success: true, imageUrl: blob.url };
  },

  order: async ({ request, locals, params }) => {
    const locale = locals?.locale ?? 'en';
    const user = locals?.user;
    if (!user) throw redirect(302, '/login');

    const { variant_id } = params;
    const variantRows = await query('SELECT * FROM product_variants WHERE id = ?', [variant_id]);
    const variantRaw = variantRows?.[0] || null;
    const variant = (() => {
      if (!variantRaw) return null;
      if (!variantRaw.option_values) return variantRaw;
      try {
        const opts =
          typeof variantRaw.option_values === 'string'
            ? JSON.parse(variantRaw.option_values)
            : variantRaw.option_values;
        return { ...variantRaw, color: opts?.color ?? null, size: opts?.size ?? null };
      } catch {
        return variantRaw;
      }
    })();
    if (!variant) {
      return fail(404, { orderError: m.custom_order_error_variant({}, { locale }) });
    }

    const productRows = await query('SELECT * FROM products WHERE id = ?', [variant.product_id]);
    const product = productRows?.[0] || null;
    if (!product) {
      return fail(404, { orderError: m.custom_order_error_product({}, { locale }) });
    }

    const form = await request.formData();
    const designData = (form.get('design_data') || '').toString();
    let designUrl = (form.get('design_url') || '').toString().trim();
    const rotation = Number(form.get('rotation') || 0);
    const scale = Number(form.get('scale') || 1);
    const position_x = Number(form.get('position_x') || 0);
    const position_y = Number(form.get('position_y') || 0);
    let renderBuffer = null;
    let renderContentType = 'image/png';

    if (!designData && !designUrl) {
      return fail(400, { orderError: m.custom_order_error_design_required({}, { locale }) });
    }

    // If we received a canvas data URL, store it as a blob and keep the public URL
    try {
      if (designData.startsWith('data:image/')) {
        const base64 = designData.split(',')[1];
        if (!base64) {
          return fail(400, { orderError: m.custom_order_error_design_invalid({}, { locale }) });
        }

        const mimeMatch = designData.match(/^data:(.*?);base64,/);
        renderContentType = mimeMatch?.[1] || 'image/png';
        renderBuffer = Buffer.from(base64, 'base64');

        if (renderBuffer.length > 8_000_000) {
          return fail(400, { orderError: m.custom_order_error_design_too_large({}, { locale }) });
        }

        const filename = `${user.id}-${variant_id}-${Date.now()}-design.png`;
        const blob = await put(filename, renderBuffer, {
          access: 'public',
          contentType: renderContentType,
          token: BLOB_READ_WRITE_TOKEN
        });
        designUrl = blob.url;
      }
    } catch (err) {
      console.error('Failed to store design', err);
      return fail(500, { orderError: m.custom_order_error_save_failed({}, { locale }) });
    }

    const conn = await createConnection();
    const price = Number(variant.price ?? product.base_price ?? 0);
    if (!Number.isFinite(price) || price <= 0) {
      return fail(400, { orderError: 'This variant is missing a price. Please contact support.' });
    }

    try {
      await conn.beginTransaction();

      const [orderResult] = await conn.query(
        'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
        [user.id, price, 'pending']
      );
      const orderId = orderResult.insertId;

      const [orderItemResult] = await conn.query(
        'INSERT INTO order_items (order_id, product_id, variant_id, upload_id, quantity, unit_price) VALUES (?, ?, ?, NULL, ?, ?)',
        [orderId, variant.product_id, variant.id, 1, price]
      );
      const orderItemId = orderItemResult.insertId;

      const [customisationResult] = await conn.query(
        'INSERT INTO customisation (product_id, variant_id, order_item_id, rotation, scale, position_x, position_y) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          variant.product_id,
          variant.id,
          orderItemId,
          Number.isFinite(rotation) ? rotation : 0,
          Number.isFinite(scale) ? scale : 1,
          Number.isFinite(position_x) ? position_x : 0,
          Number.isFinite(position_y) ? position_y : 0
        ]
      );
      const customisationId = customisationResult.insertId ?? null;

      let uploadId = null;
      if (designUrl) {
        const [uploadResult] = await conn.query(
          'INSERT INTO uploads (user_id, customisation_id, image_url) VALUES (?, ?, ?)',
          [user.id, customisationId, designUrl]
        );
        uploadId = uploadResult.insertId ?? null;
        await conn.query('UPDATE order_items SET upload_id = ? WHERE id = ?', [uploadId, orderItemId]);
      }

      await conn.commit();

      try {
        await sendPrinterEmail({
          order: { id: orderId, total_price: price, status: 'pending' },
          orderItem: { id: orderItemId, quantity: 1, unit_price: price },
          product,
          variant,
          user,
          designUrl,
          renderUrl: designUrl,
          renderBuffer,
          customisation: {
            rotation: Number.isFinite(rotation) ? rotation : 0,
            scale: Number.isFinite(scale) ? scale : 1,
            position_x: Number.isFinite(position_x) ? position_x : 0,
            position_y: Number.isFinite(position_y) ? position_y : 0
          },
          shippingAddress: null
        });
      } catch (emailErr) {
        console.error('Printer email failed', emailErr);
      }

      return { orderSuccess: true, orderId };
    } catch (err) {
      if (err?.status && err.status >= 300 && err.status < 400) {
        // Allow redirects to bubble up without showing a failure state
        throw err;
      }
      await conn.rollback();
      console.error('Failed to create order', err);
      return fail(500, { orderError: m.custom_order_error_unavailable({}, { locale }) });
    } finally {
      conn.release();
    }
  }
};

