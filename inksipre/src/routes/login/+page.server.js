import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		// 1) Basisprüfung
		if (!email || !password) {
			return fail(400, { message: 'Bitte E-Mail und Passwort eingeben.' });
		}

		// 2) Hier kannst du später deine echte Prüfung einbauen (Datenbank / API)
		//    Im Moment akzeptiert der Code alles, was ausgefüllt ist.

		// 3) Session-Cookie setzen
		cookies.set('session', email, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: false,       // für Entwicklung ohne HTTPS
			maxAge: 60 * 60 * 24 // 1 Tag
		});

		// 4) Nach erfolgreichem Login weiterleiten
		throw redirect(302, '/');
	}
};
