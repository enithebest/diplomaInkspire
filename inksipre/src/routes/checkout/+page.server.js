import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import { calculateShippingFee } from '$lib/shipping.js';

export const load = ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(
			302,
			`/login?reason=order_required&next=${encodeURIComponent(url.pathname)}`
		);
	}

	return {
		user: locals.user,
		publishableKey: STRIPE_PUBLIC_KEY || null,
		stripeReady: Boolean(STRIPE_SECRET_KEY)
	};
};

export const actions = {
	intent: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(
				302,
				`/login?reason=order_required&next=${encodeURIComponent('/checkout')}`
			);
		}

		const form = await request.formData();

		const rawCart = form.get('cart');
		const full_name = (form.get('full_name') || '').toString().trim();
		const line1 = (form.get('line1') || '').toString().trim();
		const city = (form.get('city') || '').toString().trim();
		const postal_code = (form.get('postal_code') || '').toString().trim();
		const country = (form.get('country') || '').toString().trim().toUpperCase();

		if (!rawCart) {
			return fail(400, { message: 'Missing cart data' });
		}

		if (!STRIPE_SECRET_KEY) {
			return fail(500, { message: 'Payment is not configured. Please contact support.' });
		}

		let cart;
		try {
			cart = JSON.parse(rawCart.toString());
		} catch (err) {
			return fail(400, { message: 'Invalid cart payload' });
		}

		if (!Array.isArray(cart) || cart.length === 0) {
			return fail(400, { message: 'Your cart is empty' });
		}

		if (!full_name || !line1 || !city || !postal_code || country.length < 2) {
			return fail(400, { message: 'Please fill all required shipping fields' });
		}

		const line_items = [];
		let subtotal = 0;

		for (const item of cart) {
			const qty = Number(item.qty) || 1;
			const price = Number(item.price);
			const name = (item.name || 'Item').toString().slice(0, 100);

			if (!Number.isFinite(price) || price <= 0 || qty <= 0) {
				continue;
			}

			subtotal += price * qty;

			line_items.push({
				name,
				qty: Math.round(qty),
				price: Math.round(price * 100)
			});
		}

		if (!line_items.length || subtotal <= 0) {
			return fail(400, { message: 'No valid items to purchase' });
		}

		const shipping = calculateShippingFee({ subtotal, country });
		const grandTotal = subtotal + shipping.amount;

		try {
			// Use Stripe default API version from SDK; no explicit override to avoid version errors.
			const stripe = new Stripe(STRIPE_SECRET_KEY);
			console.log('creating payment intent', {
				subtotal,
				shipping: shipping.amount,
				line_items: line_items.length
			});
			const paymentIntent = await stripe.paymentIntents.create({
				amount: Math.round(grandTotal * 100),
				currency: 'usd',
				receipt_email: locals.user.email,
				metadata: {
					user_id: locals.user.id?.toString() || '',
					full_name,
					city,
					postal_code,
					country,
					shipping_amount: shipping.amount,
					shipping_label: shipping.label,
					order_subtotal: subtotal,
					items: JSON.stringify(line_items.slice(0, 20)) // limit metadata size
				},
				automatic_payment_methods: { enabled: true }
			});

			return { clientSecret: paymentIntent.client_secret };
		} catch (err) {
			console.error('Stripe payment intent error', err);
			return fail(500, { message: 'Unable to start checkout. Please try again.' });
		}
  }
};
