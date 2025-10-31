import { createConnection } from '$lib/db/mysql';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const load = async ({ cookies }) => {
  const token = cookies.get('session');
  if (!token) throw redirect(302, '/login');

  const db = await createConnection();
  const [rows] = await db.query('SELECT id, email, full_name, created_at FROM users WHERE session_token = ?', [token]);
  db.release();

  if (rows.length === 0) throw redirect(302, '/login');
  return { user: rows[0] };
};

export const actions = {
  update: async ({ request, cookies }) => {
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
    return { success: true, message: 'Profile updated successfully' };
  }
};
