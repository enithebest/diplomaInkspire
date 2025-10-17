import { redirect, fail } from '@sveltejs/kit';
import { createConnection } from '$lib/db/mysql.js';  // ✅ fixed

export async function load({ locals }) {
  if (!locals.user || locals.user.role !== 'admin') {
    throw redirect(302, '/');
  }

  const db = await createConnection();  // ✅ fixed
  const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');

  for (const product of products) {
    const [variants] = await db.execute(
      'SELECT id, option_values, price FROM product_variants WHERE product_id = ?',
      [product.id]
    );
    product.variants = variants.map((v) => ({
      ...v,
      option_values: JSON.parse(v.option_values)
    }));
  }

  db.release();

  return { products };
}


export const actions = {
	create: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');

		const data = await request.formData();
		const name = data.get('name');
		const description = data.get('description');
		const base_price = parseFloat(data.get('base_price')) || 0;

		if (!name) return fail(400, { message: 'Produktname fehlt.' });

		const db = await getConnection();
		await db.execute(
			'INSERT INTO products (name, description, base_price) VALUES (?, ?, ?)',
			[name, description, base_price]
		);
		return { success: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');
		const data = await request.formData();
		const id = data.get('id');
		const db = await getConnection();
		await db.execute('DELETE FROM products WHERE id = ?', [id]);
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
		const db = await getConnection();
		await db.execute(
			'INSERT INTO product_variants (product_id, option_values, price) VALUES (?, ?, ?)',
			[product_id, option_values, price]
		);

		return { success: true };
	},

	deleteVariant: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');
		const data = await request.formData();
		const id = data.get('id');
		const db = await getConnection();
		await db.execute('DELETE FROM product_variants WHERE id = ?', [id]);
		return { success: true };
	}
};
