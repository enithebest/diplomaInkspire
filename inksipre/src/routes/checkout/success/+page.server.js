import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const load = async ({ url }) => {
	const session_id = url.searchParams.get('session_id');

	if (!session_id) {
		return {
			status: 'unknown',
			amount: null,
			currency: null
		};
	}

	try {
		const session = await stripe.checkout.sessions.retrieve(session_id);
		return {
			status: session.payment_status,
			amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : null,
			currency: session.currency?.toUpperCase() ?? 'USD'
		};
	} catch (err) {
		console.error('Stripe session fetch error', err);
		return {
			status: 'error',
			amount: null,
			currency: null
		};
	}
};
