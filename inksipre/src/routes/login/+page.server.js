import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { message: 'Bitte E-Mail und Passwort eingeben.' });
		}

		cookies.set('session', email, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: false,      
			maxAge: 60 * 60 * 24 
		});

		throw redirect(302, '/');
	}
};
