import { createConnection } from '$lib/db/mysql.js';

export const handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  console.log('🧩 Session cookie:', session);

  if (session) {
    const db = await createConnection();
    const [rows] = await db.query(
      'SELECT id, email, full_name, role FROM users WHERE session_token = ? AND session_expiration > NOW()',
      [session]
    );

    console.log('🧠 Found user rows:', rows);

    if (rows.length > 0) {
      event.locals.user = rows[0];
    } else {
      event.locals.user = null;
    }

    db.release();
  } else {
    event.locals.user = null;
  }

  return await resolve(event);
};
