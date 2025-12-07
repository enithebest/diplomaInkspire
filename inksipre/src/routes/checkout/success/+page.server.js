import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { createConnection } from '$lib/db/mysql.js';

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

export const load = async ({ url }) => {
  const statusParam = url.searchParams.get('status') || null;
  const payment_intent = url.searchParams.get('payment_intent');
  const client_secret = url.searchParams.get('payment_intent_client_secret');
  const intentId = payment_intent || client_secret?.split('_secret')[0] || null;

  console.log('success load', { statusParam, intentId, hasStripe: Boolean(stripe) });

  // Default response if we cannot fetch intent
  const fallbackStatus = statusParam
    ? statusParam === 'succeeded'
      ? 'paid'
      : statusParam === 'requires_action'
      ? 'processing'
      : statusParam
    : intentId
    ? 'processing'
    : 'unknown';

  if (!stripe || !intentId) {
    return { status: fallbackStatus, amount: null, currency: null };
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(intentId);
    let status = intent.status;
    if (status === 'succeeded') status = 'paid';
    if (status === 'requires_action') status = 'processing';

    console.log('success load: fetched intent', { intentId, status: intent.status });

    // Update order status if we have the order_id in metadata
    if (intent.metadata?.order_id) {
      const orderId = Number(intent.metadata.order_id) || null;
      if (orderId) {
        const conn = await createConnection();
        try {
          await conn.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        } finally {
          conn.release();
        }
      }
    }

    return {
      status,
      amount: intent.amount ? (intent.amount / 100).toFixed(2) : null,
      currency: intent.currency?.toUpperCase() ?? 'USD'
    };
  } catch (err) {
    console.error('Stripe payment intent fetch error', err);
    return { status: fallbackStatus, amount: null, currency: null };
  }
};
