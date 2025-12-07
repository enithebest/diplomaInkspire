import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { createConnection } from '$lib/db/mysql.js';

const SUPPORTED_LOCALES = ['en', 'de', 'it'];

const originalHandle = async ({ event, resolve }) => {
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

const handleParaglide = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		event.locals.locale = locale;
		event.locals.locales = SUPPORTED_LOCALES;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle = sequence(originalHandle, handleParaglide);
