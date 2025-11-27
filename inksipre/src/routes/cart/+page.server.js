import { fail, redirect } from '@sveltejs/kit';
import { query } from '$lib/db/mysql.js';

export const load = async ({ locals }) => {
  const user = locals?.user;
  if (!user) {
    return { items: [], total: 0, requireLogin: true };
  }

  const rows = await query(
    `
    SELECT
      oi.id,
      oi.quantity,
      oi.unit_price,
      oi.order_id,
      p.name AS product_name,
      pv.sku AS variant_sku,
      pv.option_values,
      up.image_url
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN product_variants pv ON oi.variant_id = pv.id
    LEFT JOIN uploads up ON oi.upload_id = up.id
    WHERE o.user_id = ? AND o.status = 'pending'
    ORDER BY oi.id DESC
    `,
    [user.id]
  );

  const items = rows.map((row) => {
    let size = '';
    let color = '';
    try {
      if (row.option_values) {
        const opts = JSON.parse(row.option_values);
        size = opts?.size || '';
        color = color || opts?.color || '';
      }
    } catch {
      // ignore parse errors
    }

    return {
      id: row.id,
      name: row.product_name || 'Item',
      sku: row.variant_sku || '',
      size,
      color,
      quantity: row.quantity || 1,
      price: Number(row.unit_price || 0),
      image_url: row.image_url || '/placeholder.png'
    };
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { items, total, requireLogin: false };
};

export const actions = {
  updateQuantity: async ({ request, locals }) => {
    const user = locals?.user;
    if (!user) {
      throw redirect(302, '/login?next=/cart');
    }

    const form = await request.formData();
    const itemId = Number(form.get('item_id'));
    const quantity = Number(form.get('quantity'));

    if (!Number.isFinite(itemId) || itemId <= 0) {
      return fail(400, { error: 'Invalid item.' });
    }
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return fail(400, { error: 'Quantity must be between 1 and 99.' });
    }

    const rows = await query(
      `
      SELECT oi.order_id, oi.unit_price
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.id = ? AND o.user_id = ? AND o.status = 'pending'
      `,
      [itemId, user.id]
    );

    if (!rows.length) {
      return fail(404, { error: 'Item not found.' });
    }

    const orderId = rows[0].order_id;

    await query('UPDATE order_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
    await query(
      'UPDATE orders SET total_price = (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM order_items WHERE order_id = ?) WHERE id = ?',
      [orderId, orderId]
    );

    throw redirect(303, '/cart');
  },

  deleteItem: async ({ request, locals }) => {
    const user = locals?.user;
    if (!user) {
      throw redirect(302, '/login?next=/cart');
    }

    const form = await request.formData();
    const itemId = Number(form.get('item_id'));

    if (!Number.isFinite(itemId) || itemId <= 0) {
      return fail(400, { error: 'Invalid item.' });
    }

    const rows = await query(
      `
      SELECT oi.order_id
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.id = ? AND o.user_id = ? AND o.status = 'pending'
      `,
      [itemId, user.id]
    );

    if (!rows.length) {
      return fail(404, { error: 'Item not found.' });
    }

    const orderId = rows[0].order_id;

    await query('DELETE FROM order_items WHERE id = ?', [itemId]);
    await query(
      'UPDATE orders SET total_price = (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM order_items WHERE order_id = ?) WHERE id = ?',
      [orderId, orderId]
    );

    throw redirect(303, '/cart');
  }
};
