import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER } from '$env/static/private';
import * as m from '$lib/paraglide/messages/_index.js';
import { getPhoneCountries } from '$lib/data/phoneCountries.js';

const allowedAttachmentTypes = ['image/png', 'image/jpeg', 'image/webp'];
const maxAttachmentSize = 5 * 1024 * 1024;

const sanitize = (value) => {
	if (typeof value === 'string') return value.trim();
	if (value === null || value === undefined) return '';
	return String(value).trim();
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^[0-9()+\s-]{6,20}$/.test(phone);
const isValidPrefix = (prefix) => /^\+\d{1,4}$/.test(prefix);

export const load = async ({ fetch }) => {
	const { countries, fallback } = await getPhoneCountries(fetch);
	return { phoneCountries: countries, phoneCountriesFallback: fallback };
};

export const actions = {
	send: async ({ request, locals }) => {
		const locale = locals?.locale ?? 'en';
		const formData = await request.formData();
		const name = sanitize(formData.get('name'));
		const email = sanitize(formData.get('email')).toLowerCase();
		const prefix = sanitize(formData.get('prefix'));
		const phone = sanitize(formData.get('phone'));
		const message = sanitize(formData.get('message'));
		const attachment = formData.get('attachment');

		const values = { name, email, prefix, phone, message };

		if (!name || name.length < 2) {
			return fail(400, { error: m.contact_form_error_name({}, { locale }), values });
		}

		if (!email || !isValidEmail(email)) {
			return fail(400, { error: m.contact_form_error_email({}, { locale }), values });
		}

		if (!prefix || !isValidPrefix(prefix)) {
			return fail(400, { error: m.contact_form_error_prefix({}, { locale }), values });
		}

		if (!phone || !isValidPhone(phone)) {
			return fail(400, { error: m.contact_form_error_phone({}, { locale }), values });
		}

		if (!message || message.length < 10) {
			return fail(400, { error: m.contact_form_error_message({}, { locale }), values });
		}

		if (attachment instanceof File && attachment.size > 0) {
			if (!allowedAttachmentTypes.includes(attachment.type)) {
				return fail(400, { error: m.contact_form_error_attachment_type({}, { locale }), values });
			}

			if (attachment.size > maxAttachmentSize) {
				return fail(400, { error: m.contact_form_error_attachment_size({}, { locale }), values });
			}
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
			const attachments =
				attachment instanceof File && attachment.size > 0
					? [
							{
								filename: attachment.name || 'contact-upload',
								content: Buffer.from(await attachment.arrayBuffer()),
								contentType: attachment.type
							}
						]
					: [];

			await transporter.sendMail({
				from: `"Inkspire Contact" <${SMTP_USER}>`,
				to: CONTACT_RECEIVER,
				subject: `New message from ${name}`,
				text: `From: ${name} <${email}>
Phone: ${prefix} ${phone}
Attachment: ${attachments.length ? attachments[0].filename : 'None'}

${message}`,
				html: `
					<h2>New message from Inkspire</h2>
					<p><b>Name:</b> ${name}</p>
					<p><b>Email:</b> ${email}</p>
					<p><b>Phone:</b> ${prefix} ${phone}</p>
					<p><b>Attachment:</b> ${attachments.length ? attachments[0].filename : 'None'}</p>
					<p><b>Message:</b></p>
					<p>${message}</p>
				`,
				attachments
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
