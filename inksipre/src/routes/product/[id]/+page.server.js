import { query, createConnection } from '$lib/db/mysql.js';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
  const { id } = params;

  // Get the base product
  const productRows = await query('SELECT * FROM products WHERE id = ?', [id]);
  const product = productRows?.[0] || null;

  if (!product) {
    return { product: null, variants: [] };
  }

  // Get all variants linked to this product
  const variantRows = await query(
    'SELECT id, price, option_values FROM product_variants WHERE product_id = ?',
    [id]
  );

  const variants = (variantRows || []).map((v) => {
    let color = null;
    let size = null;
    if (v.option_values) {
      try {
        const opts = typeof v.option_values === 'string' ? JSON.parse(v.option_values) : v.option_values;
        color = opts?.color ?? null;
        size = opts?.size ?? null;
      } catch {
        // ignore JSON parse errors and keep nulls
      }
    }
    return { id: v.id, price: v.price, color, size };
  });

  return { product, variants, isAuthenticated: Boolean(locals?.user) };
};

export const actions = {
  order: async ({ request, locals, params }) => {
    const user = locals?.user;
    if (!user) {
      throw redirect(302, `/login?next=/product/${params.id}`);
    }

    const form = await request.formData();
    const variantId = Number(form.get('variant_id'));

    if (!Number.isFinite(variantId)) {
      return fail(400, { orderError: 'Please select a variant.' });
    }

    const variantRows = await query(
      'SELECT * FROM product_variants WHERE id = ? AND product_id = ?',
      [variantId, params.id]
    );
    const variant = variantRows?.[0];
    if (!variant) {
      return fail(404, { orderError: 'Variant not found.' });
    }

    const productRows = await query('SELECT * FROM products WHERE id = ?', [params.id]);
    const product = productRows?.[0];
    if (!product) {
      return fail(404, { orderError: 'Product not found.' });
    }

    const price = Number(variant.price ?? product.base_price ?? 0);
    const conn = await createConnection();

    try {
      await conn.beginTransaction();

      const [orderResult] = await conn.query(
        'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
        [user.id, price, 'pending']
      );
      const orderId = orderResult.insertId;

      await conn.query(
        'INSERT INTO order_items (order_id, product_id, variant_id, upload_id, quantity, unit_price) VALUES (?, ?, ?, NULL, ?, ?)',
        [orderId, params.id, variantId, 1, price]
      );

      await conn.commit();
      throw redirect(303, '/cart');
    } catch (err) {
      if (err?.status && err.status >= 300 && err.status < 400) {
        throw err;
      }
      await conn.rollback();
      console.error('Failed to create order from product page', err);
      return fail(500, { orderError: 'Unable to place the order right now.' });
    } finally {
      conn.release();
    }
  }
};
