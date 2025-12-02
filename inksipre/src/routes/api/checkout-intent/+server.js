import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { json, redirect } from '@sveltejs/kit';
import { createConnection } from '$lib/db/mysql.js';

export const POST = async ({ request, locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login?reason=order_required&next=%2Fcheckout');
  }

  const form = await request.formData();

  const rawCart = form.get('cart');
  const full_name = (form.get('full_name') || '').toString().trim();
  const line1 = (form.get('line1') || '').toString().trim();
  const city = (form.get('city') || '').toString().trim();
  const postal_code = (form.get('postal_code') || '').toString().trim();
  const country = (form.get('country') || '').toString().trim().toUpperCase();

  if (!rawCart) {
    return json({ message: 'Missing cart data' }, { status: 400 });
  }

  if (!STRIPE_SECRET_KEY) {
    return json({ message: 'Payment is not configured. Please contact support.' }, { status: 500 });
  }

  let cart;
  try {
    cart = JSON.parse(rawCart.toString());
  } catch (err) {
    return json({ message: 'Invalid cart payload' }, { status: 400 });
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return json({ message: 'Your cart is empty' }, { status: 400 });
  }

  if (!full_name || !line1 || !city || !postal_code || country.length < 2) {
    return json({ message: 'Please fill all required shipping fields' }, { status: 400 });
  }

  const line_items = [];
  let total = 0;
  const rawItems = [];

  for (const item of cart) {
    const qty = Number(item.qty) || 1;
    const price = Number(item.price);
    const name = (item.name || 'Item').toString().slice(0, 100);

    if (!Number.isFinite(price) || price <= 0 || qty <= 0) {
      continue;
    }

    total += price * qty;

    line_items.push({
      name,
      qty: Math.round(qty),
      price: Math.round(price * 100)
    });
    rawItems.push({
      product_id: item.product_id || null,
      variant_id: item.variant_id || null,
      quantity: Math.round(qty),
      unit_price: price
    });
  }

  if (!line_items.length || total <= 0) {
    return json({ message: 'No valid items to purchase' }, { status: 400 });
  }

  // Create order + order_items so we can mark paid on success
  let orderId = null;
  const conn = await createConnection();

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    console.log('creating payment intent', { total, line_items: line_items.length });
    await conn.beginTransaction();
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
      [locals.user.id, total, 'pending']
    );
    orderId = orderResult.insertId;

    for (const it of rawItems) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, variant_id, upload_id, quantity, unit_price) VALUES (?, ?, ?, NULL, ?, ?)',
        [orderId, it.product_id, it.variant_id, it.quantity, it.unit_price]
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      receipt_email: locals.user.email,
      metadata: {
        order_id: orderId?.toString?.() || '',
        user_id: locals.user.id?.toString() || '',
        full_name,
        city,
        postal_code,
        country,
        items: JSON.stringify(line_items.slice(0, 20)) // limit metadata size
      },
      payment_method_types: ['card'], // keep it simple in test; avoid wallets/link hanging in HTTP
    });

    await conn.commit();
    return json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe payment intent error', err);
    try {
      await conn.rollback();
    } catch {}
    return json({ message: 'Unable to start checkout. Please try again.' }, { status: 500 });
  } finally {
    conn.release();
  }
};
