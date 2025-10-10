import { getConnection } from '$lib/db/mysql.js';

export async function handle({ event, resolve }) {
	const session = event.cookies.get('session');
	if (session) {
		const db = await getConnection();
		const [rows] = await db.execute('SELECT id, email, role FROM users WHERE id = ?', [session]);
		if (rows.length > 0) {
			event.locals.user = rows[0];
		}
	}
	return resolve(event);
}
