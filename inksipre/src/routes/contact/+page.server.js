import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import {
	SMTP_HOST,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASS,
	CONTACT_RECEIVER
} from '$env/static/private';
import * as m from '$lib/paraglide/messages/_index.js';

const allowedPrefixes = ['+43', '+49', '+41', '+355', '+39', '+44'];

const sanitize = (value) => {
	if (typeof value === 'string') return value.trim();
	if (value === null || value === undefined) return '';
	return String(value).trim();
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[0-9()+\s-]{6,20}$/.test(phone);

export const actions = {
	send: async ({ request, locals }) => {
		const locale = locals?.locale ?? 'en';
		const formData = await request.formData();
		const name = sanitize(formData.get('name'));
		const email = sanitize(formData.get('email')).toLowerCase();
		const prefix = sanitize(formData.get('prefix'));
		const phone = sanitize(formData.get('phone'));
		const message = sanitize(formData.get('message'));

		const values = { name, email, prefix, phone, message };

		if (!name || name.length < 2) {
			return fail(400, { error: m.contact_form_error_name({}, { locale }), values });
		}

		if (!email || !isValidEmail(email)) {
			return fail(400, { error: m.contact_form_error_email({}, { locale }), values });
		}

		if (!prefix || !allowedPrefixes.includes(prefix)) {
			return fail(400, { error: m.contact_form_error_prefix({}, { locale }), values });
		}

		if (!phone || !isValidPhone(phone)) {
			return fail(400, { error: m.contact_form_error_phone({}, { locale }), values });
		}

		if (!message || message.length < 10) {
			return fail(400, { error: m.contact_form_error_message({}, { locale }), values });
		}

		const transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: Number(SMTP_PORT),
			secure: Number(SMTP_PORT) === 465,
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASS
			}
		});

		try {
			await transporter.sendMail({
				from: `"Inkspire Contact" <${SMTP_USER}>`,
				to: CONTACT_RECEIVER,
				subject: `New message from ${name}`,
				text: `From: ${name} <${email}>
Phone: ${prefix} ${phone}

${message}`,
				html: `
					<h2>New message from Inkspire</h2>
					<p><b>Name:</b> ${name}</p>
					<p><b>Email:</b> ${email}</p>
					<p><b>Phone:</b> ${prefix} ${phone}</p>
					<p><b>Message:</b></p>
					<p>${message}</p>
				`
			});

			return { success: m.contact_form_success({}, { locale }) };
		} catch (error) {
			console.error('Email sending failed:', error);
			return fail(500, {
				error: m.contact_form_error_send({}, { locale }),
				values
			});
		}
	}
};
