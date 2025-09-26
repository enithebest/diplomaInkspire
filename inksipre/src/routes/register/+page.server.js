import { fail, redirect } from '@sveltejs/kit';
import { getConnection } from '$lib/server/db.js';
import bcrypt from 'bcrypt';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.trim();
		const password = data.get('password');

		// Eingaben prüfen
		if (!email || !password) {
			return fail(400, { message: 'Bitte alle Felder ausfüllen.' });
		}

		// Verbindung zur DB
		const db = await getConnection();

		// Prüfen, ob E-Mail schon existiert
		const [rows] = await db.execute(
			'SELECT id FROM users WHERE email = ?',
			[email]
		);
		if (rows.length > 0) {
			return fail(409, { message: 'E-Mail ist bereits registriert.' });
		}

		// Passwort hashen
		const hashed = await bcrypt.hash(password, 10);

		// User anlegen
		await db.execute(
			'INSERT INTO users (email, password) VALUES (?, ?)',
			[email, hashed]
		);

		// Nach erfolgreicher Registrierung weiterleiten
		throw redirect(302, '/login');
	}
};
