import { query, createConnection } from '$lib/db/mysql.js';
import { fail, redirect } from '@sveltejs/kit';
import * as m from '$lib/paraglide/messages/_index.js';

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
		const locale = locals?.locale ?? 'en';
		const data = await request.formData();
		const body = data.get('comment');
		let authorName = data.get('author_name');

		const trimmedBody = typeof body === 'string' ? body.trim() : '';
		if (!trimmedBody || trimmedBody.length < 5) {
			return fail(400, {
				error: m.product_comment_error_short({}, { locale })
			});
		}

		const isLoggedIn = Boolean(locals?.user);
		if (isLoggedIn) {
			authorName = locals.user.full_name || m.product_comment_user_fallback({}, { locale });
		} else if (!authorName || !authorName.trim()) {
			return fail(400, { error: m.product_comment_error_name({}, { locale }) });
		} else {
			authorName = authorName.trim();
		}

		await query(
			'INSERT INTO product_comments (product_id, user_id, author_name, comment) VALUES (?, ?, ?, ?)',
			[params.id, isLoggedIn ? locals.user.id : null, authorName, trimmedBody]
		);

		return { success: m.product_comment_success({}, { locale }) };
	},
	order: async ({ request, locals, params }) => {
		const locale = locals?.locale ?? 'en';
		const user = locals?.user;
		if (!user) {
			throw redirect(302, `/login?next=/product/${params.id}`);
		}

		const form = await request.formData();
		const variantId = Number(form.get('variant_id'));

		if (!Number.isFinite(variantId)) {
			return fail(400, { orderError: m.product_order_error_select_variant({}, { locale }) });
		}

		const variantRows = await query(
			'SELECT * FROM product_variants WHERE id = ? AND product_id = ?',
			[variantId, params.id]
		);
		const variant = variantRows?.[0];
		if (!variant) {
			return fail(404, { orderError: m.product_order_error_variant_missing({}, { locale }) });
		}

		const productRows = await query('SELECT * FROM products WHERE id = ?', [params.id]);
		const product = productRows?.[0];
		if (!product) {
			return fail(404, { orderError: m.product_order_error_product_missing({}, { locale }) });
		}

		const price = Number(variant.price ?? product.base_price ?? 0);
		const conn = await createConnection();

		try {
			await conn.beginTransaction();

			const [orderResult] = await conn.query(
				'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
				[user.id, price, 'pending']
			);
			const orderId = orderResult.insertId;

			await conn.query(
				'INSERT INTO order_items (order_id, product_id, variant_id, upload_id, quantity, unit_price) VALUES (?, ?, ?, NULL, ?, ?)',
				[orderId, params.id, variantId, 1, price]
			);

			await conn.commit();
			throw redirect(303, '/cart');
		} catch (err) {
			if (err?.status && err.status >= 300 && err.status < 400) {
				throw err;
			}
			await conn.rollback();
			console.error('Failed to create order from product page', err);
			return fail(500, { orderError: m.product_order_error_unavailable({}, { locale }) });
		} finally {
			conn.release();
		}
	}
};
