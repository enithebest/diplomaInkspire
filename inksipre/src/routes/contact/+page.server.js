import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

export const actions = {
	send: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const message = formData.get('message');

		if (!name || !email || !message) {
			return fail(400, { error: 'Please fill out all fields.' });
		}

		// Example: using Gmail (you can change this to your SMTP server)
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'your_email@gmail.com',
				pass: 'your_app_password' // use App Password, not your normal password
			}
		});

		try {
			await transporter.sendMail({
				from: email,
				to: 'ajssii.sala@gmail.com',
				subject: `New contact form message from ${name}`,
				text: message
			});

			return { success: 'Message sent successfully!' };
		} catch (error) {
			console.error(error);
			return fail(500, { error: 'Failed to send message. Please try again later.' });
		}
	}
};
