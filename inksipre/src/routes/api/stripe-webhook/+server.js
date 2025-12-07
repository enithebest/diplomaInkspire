import { env } from '$env/dynamic/private';
import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import { createConnection } from '$lib/db/mysql.js';

// This route expects the raw body. Ensure your deployment preserves the raw body for webhook verification.

export const POST = async ({ request }) => {
  const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    const body = await request.arrayBuffer();
    const payload = Buffer.from(body);
    event = stripe.webhooks.constructEvent(payload, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed', err.message);
    return json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.processing') {
      const intent = event.data.object;
      const orderId = Number(intent.metadata?.order_id) || null;
      if (orderId) {
        const conn = await createConnection();
        try {
          const newStatus = event.type === 'payment_intent.succeeded' ? 'paid' : 'processing';
          await conn.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);
        } finally {
          conn.release();
        }
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const intent = event.data.object;
      const orderId = Number(intent.metadata?.order_id) || null;
      if (orderId) {
        const conn = await createConnection();
        try {
          await conn.query('UPDATE orders SET status = ? WHERE id = ?', ['failed', orderId]);
        } finally {
          conn.release();
        }
      }
    }
  } catch (err) {
    console.error('Webhook handler error', err);
    return json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return json({ received: true });
};
