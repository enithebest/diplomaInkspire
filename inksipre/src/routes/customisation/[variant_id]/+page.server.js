import { query, createConnection } from '$lib/db/mysql.js';
import { fail, redirect } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

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
    const user = locals?.user;
    if (!user) throw redirect(302, '/login');

    const { variant_id } = params;

    const form = await request.formData();
    const file = form.get('design');

    if (!file || typeof file === 'string') {
      return fail(400, { error: 'No file provided' });
    }

    // Validate file type and size
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return fail(400, { error: 'Invalid file type. Allowed: PNG, JPG, WEBP.' });
    }
    if (file.size > 5_000_000) {
      return fail(400, { error: 'File too large (max 5MB).' });
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
    const user = locals?.user;
    if (!user) throw redirect(302, '/login');

    const { variant_id } = params;
    const variantRows = await query('SELECT * FROM product_variants WHERE id = ?', [variant_id]);
    const variant = variantRows?.[0] || null;
    if (!variant) {
      return fail(404, { orderError: 'Variant not found' });
    }

    const productRows = await query('SELECT * FROM products WHERE id = ?', [variant.product_id]);
    const product = productRows?.[0] || null;
    if (!product) {
      return fail(404, { orderError: 'Product not found' });
    }

    const form = await request.formData();
    const designData = (form.get('design_data') || '').toString();
    let designUrl = (form.get('design_url') || '').toString().trim();

    if (!designData && !designUrl) {
      return fail(400, { orderError: 'Please add a design before ordering.' });
    }

    // If we received a canvas data URL, store it as a blob and keep the public URL
    try {
      if (designData.startsWith('data:image/')) {
        const base64 = designData.split(',')[1];
        if (!base64) {
          return fail(400, { orderError: 'Design image is invalid.' });
        }

        const mimeMatch = designData.match(/^data:(.*?);base64,/);
        const contentType = mimeMatch?.[1] || 'image/png';
        const buffer = Buffer.from(base64, 'base64');

        if (buffer.length > 8_000_000) {
          return fail(400, { orderError: 'Design image is too large.' });
        }

        const filename = `${user.id}-${variant_id}-${Date.now()}-design.png`;
        const blob = await put(filename, buffer, {
          access: 'public',
          contentType,
          token: BLOB_READ_WRITE_TOKEN
        });
        designUrl = blob.url;
      }
    } catch (err) {
      console.error('Failed to store design', err);
      return fail(500, { orderError: 'Could not save your design. Please try again.' });
    }

    const conn = await createConnection();
    const price = Number(variant.price ?? product.base_price ?? 0);

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
        'INSERT INTO customisation (product_id, variant_id, order_item_id) VALUES (?, ?, ?)',
        [variant.product_id, variant.id, orderItemId]
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

      throw redirect(303, `/cart?orderId=${orderId}`);
    } catch (err) {
      if (err?.status && err.status >= 300 && err.status < 400) {
        // Allow redirects to bubble up without showing a failure state
        throw err;
      }
      await conn.rollback();
      console.error('Failed to create order', err);
      return fail(500, { orderError: 'Unable to place the order at the moment.' });
    } finally {
      conn.release();
    }
  }
};

