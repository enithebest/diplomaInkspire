import { fail, redirect } from '@sveltejs/kit';
import { getConnection } from '$lib/db/mysql.js';
import bcrypt from 'bcrypt';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { message: 'Bitte alle Felder ausfüllen.' });
		}

		const db = await getConnection();
		const [rows] = await db.execute('SELECT id, password FROM users WHERE email = ?', [email]);

		if (rows.length === 0) {
			return fail(401, { message: 'E-Mail nicht gefunden.' });
		}

		const user = rows[0];
		const ok = await bcrypt.compare(password, user.password);
		if (!ok) {
			return fail(401, { message: 'Passwort falsch.' });
		}

		// Session-Cookie setzen
		cookies.set('session', String(user.id), {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24
		});

		throw redirect(302, '/');
	}
};
