import { createConnection } from '$lib/db/mysql';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import * as m from '$lib/paraglide/messages/_index.js';

export const load = async ({ cookies }) => {
  const token = cookies.get('session');
  if (!token) throw redirect(302, '/login');

  const db = await createConnection();
  const [rows] = await db.query(
    'SELECT id, email, full_name, created_at FROM users WHERE session_token = ?',
    [token]
  );
  if (rows.length === 0) {
    db.release();
    throw redirect(302, '/login');
  }

  const user = rows[0];

  // Load recent orders for this user
  const [orders] = await db.query(
    'SELECT id, total_price, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
    [user.id]
  );

  // Load items for these orders (simple per-order fetch to keep SQL portable)
  const itemsByOrder = {};
  for (const o of orders) {
    const [items] = await db.query(
      `SELECT
         oi.order_id,
         oi.product_id,
         oi.variant_id,
         oi.quantity,
         oi.unit_price,
         p.name,
         COALESCE(u.image_url, pv.image_url, p.image_url) AS image_url
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       LEFT JOIN product_variants pv ON pv.id = oi.variant_id
       LEFT JOIN uploads u ON u.id = oi.upload_id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [o.id]
    );
    itemsByOrder[o.id] = items;
  }

  // Load recent uploads for this user
  const [uploads] = await db.query(
    'SELECT id, image_url, created_at FROM uploads WHERE user_id = ? AND customisation_id IS NULL ORDER BY id DESC LIMIT 50',
    [user.id]
  );

  db.release();

  return { user, orders, itemsByOrder, uploads };
};

export const actions = {
  update: async ({ request, cookies, locals }) => {
    const locale = locals?.locale ?? 'en';
    const token = cookies.get('session');
    if (!token) throw redirect(302, '/login');

    const form = await request.formData();
    const full_name = form.get('full_name');
    const password = form.get('password');

    const db = await createConnection();

    if (password) {
      const hashed = await bcrypt.hash(password, 12);
      await db.execute('UPDATE users SET full_name = ?, password_hash = ? WHERE session_token = ?', [full_name, hashed, token]);
    } else {
      await db.execute('UPDATE users SET full_name = ? WHERE session_token = ?', [full_name, token]);
    }

    db.release();
    return { success: true, message: m.profile_update_success({}, { locale }) };
  },

  delete_upload: async ({ request, cookies, locals }) => {
    const locale = locals?.locale ?? 'en';
    const token = cookies.get('session');
    if (!token) throw redirect(302, '/login');

    const form = await request.formData();
    const uploadId = Number(form.get('upload_id')) || 0;
    if (!uploadId) return fail(400, { message: m.profile_error_invalid_upload({}, { locale }) });

    const db = await createConnection();
    const [users] = await db.query('SELECT id FROM users WHERE session_token = ?', [token]);
    if (users.length === 0) {
      db.release();
      throw redirect(302, '/login');
    }
    const userId = users[0].id;
    await db.execute('DELETE FROM uploads WHERE id = ? AND user_id = ?', [uploadId, userId]);
    db.release();
    return { success: true };
  }
};
