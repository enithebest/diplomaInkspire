import { env } from '$env/dynamic/private';
import Stripe from 'stripe';
import { json } from '@sveltejs/kit';
import { createConnection } from '$lib/db/mysql.js';
import { sendPrinterEmail } from '$lib/email/mailer.js';

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

          if (event.type === 'payment_intent.succeeded') {
            // Fetch order details to dispatch to printer
            const [orderRows] = await conn.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            const order = orderRows?.[0] || null;
            if (order) {
              const [userRows] = await conn.query('SELECT id, email, full_name FROM users WHERE id = ?', [
                order.user_id
              ]);
              const user = userRows?.[0] || null;

              const [addressRows] = await conn.query(
                'SELECT full_name, line1, line2, city, region, postal_code, country, phone FROM addresses WHERE id = ?',
                [order.shipping_address_id]
              );
              const shippingAddress = addressRows?.[0] || null;

              const [items] = await conn.query(
                'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
                [orderId]
              );
              for (const item of items || []) {
                const [productRows] = await conn.query(
                  'SELECT id, name, base_price, image_url FROM products WHERE id = ?',
                  [item.product_id]
                );
                const product = productRows?.[0] || null;

                let variant = null;
                if (item.variant_id) {
                  const [variantRows] = await conn.query('SELECT * FROM product_variants WHERE id = ?', [
                    item.variant_id
                  ]);
                  const variantRaw = variantRows?.[0] || null;
                  if (variantRaw) {
                    try {
                      const opts =
                        typeof variantRaw.option_values === 'string'
                          ? JSON.parse(variantRaw.option_values)
                          : variantRaw.option_values;
                      variant = { ...variantRaw, color: opts?.color ?? null, size: opts?.size ?? null };
                    } catch {
                      variant = variantRaw;
                    }
                  }
                }

                let designUrl = '';
                if (item.upload_id) {
                  const [uploadRows] = await conn.query('SELECT image_url FROM uploads WHERE id = ?', [
                    item.upload_id
                  ]);
                  designUrl = uploadRows?.[0]?.image_url || '';
                }

                try {
                  await sendPrinterEmail({
                    order,
                    orderItem: item,
                    product,
                    variant,
                    user,
                    designUrl,
                    renderUrl: designUrl,
                    renderBuffer: null,
                    customisation: null,
                    shippingAddress
                  });
                } catch (emailErr) {
                  console.error('Printer email failed (webhook)', emailErr);
                }
              }
            }
          }
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
