import { fail } from '@sveltejs/kit';
import { query } from '$lib/db/mysql.js';

export const load = async ({ params, locals }) => {
	const { id } = params;
	const user = locals?.user ?? null;

  // Get the base product
	const productRows = await query('SELECT * FROM products WHERE id = ?', [id]);
	const product = productRows?.[0] || null;

	if (!product) {
		return { product: null, variants: [], comments: [], isAuthenticated: Boolean(user), user };
	}

	// Get all variants linked to this product
	const variantRows = await query(
		'SELECT id, price, image_url, option_values FROM product_variants WHERE product_id = ?',
		[id]
	);

	const variants = (variantRows || []).map((v) => {
		let color = null;
		let size = null;
		if (v.option_values) {
			try {
				const opts =
					typeof v.option_values === 'string' ? JSON.parse(v.option_values) : v.option_values;
				color = opts?.color ?? null;
				size = opts?.size ?? null;
			} catch {
				// ignore JSON parse errors and keep nulls
			}
		}
		return { id: v.id, price: v.price, image_url: v.image_url, color, size };
	});

	const comments = await query(
		`SELECT pc.id, pc.comment, pc.author_name, pc.created_at, u.full_name AS registered_name
     FROM product_comments pc
     LEFT JOIN users u ON u.id = pc.user_id
     WHERE pc.product_id = ?
     ORDER BY pc.created_at DESC`,
		[id]
	);

	return { product, variants, comments, isAuthenticated: Boolean(user), user };
};

export const actions = {
	comment: async ({ request, locals, params }) => {
		const data = await request.formData();
		const body = data.get('comment');
		let authorName = data.get('author_name');

		const trimmedBody = typeof body === 'string' ? body.trim() : '';
		if (!trimmedBody || trimmedBody.length < 5) {
			return fail(400, {
				error: 'Please share at least a short sentence so that others can benefit from your feedback.'
			});
		}

		const isLoggedIn = Boolean(locals?.user);
		if (isLoggedIn) {
			authorName = locals.user.full_name || 'Inkspire user';
		} else if (!authorName || !authorName.trim()) {
			return fail(400, { error: 'Please add a name so people know who left the comment.' });
		} else {
			authorName = authorName.trim();
		}

		await query(
			'INSERT INTO product_comments (product_id, user_id, author_name, comment) VALUES (?, ?, ?, ?)',
			[params.id, isLoggedIn ? locals.user.id : null, authorName, trimmedBody]
		);

		return { success: 'Thanks for sharing your thoughts!' };
	}
};
