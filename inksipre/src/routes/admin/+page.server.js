﻿import { redirect, fail } from '@sveltejs/kit';
import { createConnection } from '$lib/db/mysql.js';
import fs from 'fs';
import path from 'path';

export async function load({ locals }) {
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(302, '/');
	}

	const db = await createConnection();
	const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');

	// Attach variants for each product so the UI reflects real data
	for (const p of products) {
		const [variants] = await db.execute(
			'SELECT id, option_values, price FROM product_variants WHERE product_id = ? ORDER BY id DESC',
			[p.id]
		);
		p.variants = variants;
	}

	db.release();

	return { products };
}

export const actions = {
	create: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');

		const formData = await request.formData();
		const name = formData.get('name');
		const description = formData.get('description');
		const base_price = parseFloat(formData.get('base_price')) || 0;
		const category = formData.get('category');
		const image = formData.get('image');

		if (!name || !category || !image) {
			return fail(400, { message: 'Bitte alle Pflichtfelder ausfÃ¼llen.' });
		}

		// ðŸ“ Speicherort fÃ¼r Bilder
		const uploadDir = 'static/uploads';
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });

		// Validate image type and size
		const allowed = ['image/png', 'image/jpeg', 'image/webp'];
		if (typeof image === 'string' || !allowed.includes(image.type)) {
			return fail(400, { message: 'Ungültiger Bildtyp. Erlaubt: PNG, JPG, WEBP.' });
		}
		if (image.size > 5000000) {
			return fail(400, { message: 'Datei zu groß (max. 5MB).' });
		}
		}

		const fileName = `${Date.now()}-${image.name}`;
		const filePath = path.join(uploadDir, fileName);

		// ðŸ”½ Datei speichern
		const arrayBuffer = await image.arrayBuffer();
		fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

		const imageUrl = `/uploads/${fileName}`;

		// ðŸ—„ï¸ In Datenbank einfÃ¼gen
		const db = await createConnection();
		await db.execute(
			'INSERT INTO products (name, description, base_price, category, image_url) VALUES (?, ?, ?, ?, ?)',
			[name, description, base_price, category, imageUrl]
		);
		db.release();

		return { success: true, message: 'Produkt erfolgreich erstellt!' };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');
		const data = await request.formData();
		const id = data.get('id');
		const db = await createConnection();
		await db.execute('DELETE FROM products WHERE id = ?', [id]);
		db.release();
		return { success: true };
	},

	addVariant: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');
		const data = await request.formData();
		const product_id = data.get('product_id');
		const size = data.get('size');
		const color = data.get('color');
		const price = parseFloat(data.get('price')) || 0.0;

		const option_values = JSON.stringify({ size, color });
		const db = await createConnection();
		await db.execute(
			'INSERT INTO product_variants (product_id, option_values, price) VALUES (?, ?, ?)',
			[product_id, option_values, price]
		);
		db.release();

		return { success: true };
	},

	deleteVariant: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');
		const data = await request.formData();
		const id = data.get('id');
		const db = await createConnection();
		await db.execute('DELETE FROM product_variants WHERE id = ?', [id]);
		db.release();

		return { success: true };
	}
};


