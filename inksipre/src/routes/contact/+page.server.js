import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import {
	SMTP_HOST,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASS,
	CONTACT_RECEIVER
} from '$env/static/private';

export const actions = {
	send: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const message = formData.get('message');

		if (!name || !email || !message) {
			return fail(400, { error: 'Bitte alle Felder ausfüllen.' });
		}

		const transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: Number(SMTP_PORT),
			secure: true, 
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASS
			}
		});

		try {
			await transporter.sendMail({
				from: `"Inkspire Kontakt" <${SMTP_USER}>`,
				to: CONTACT_RECEIVER,
				subject: `Neue Nachricht von ${name}`,
				text: `Von: ${name} <${email}>\n\n${message}`,
				html: `
					<h2>Neue Nachricht von Inkspire</h2>
					<p><b>Name:</b> ${name}</p>
					<p><b>Email:</b> ${email}</p>
					<p><b>Nachricht:</b></p>
					<p>${message}</p>
				`
			});

			return { success: '✅ Ihre Nachricht wurde erfolgreich gesendet.' };
		} catch (error) {
			console.error('E-Mail-Versand fehlgeschlagen:', error);
			return fail(500, { error: 'E-Mail-Versand fehlgeschlagen. Bitte später erneut versuchen.' });
		}
	}
};
