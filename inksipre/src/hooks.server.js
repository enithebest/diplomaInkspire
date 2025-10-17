// src/hooks.server.js
import { createConnection } from '$lib/db/mysql.js';

export const handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');

  if (session) {
    const db = await createConnection();
    const [rows] = await db.query(
      'SELECT id, email, role FROM users WHERE session_token = ? AND session_expiration > NOW()',
      [session]
    );

    if (rows.length > 0) {
      event.locals.user = rows[0]; // store logged-in user in locals
    }

    db.release();
  }

  // continue with normal request handling
  return await resolve(event);
};
