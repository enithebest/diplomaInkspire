import nodemailer from 'nodemailer';
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  MAIL_FROM,
  MAIL_REPLY_TO,
  PRINTER_EMAIL
} from '$env/static/private';

const buildTransporter = () => {
  if (!SMTP_HOST) return null;
  const port = Number(SMTP_PORT) || 587;
  const secure =
    (typeof SMTP_SECURE === 'string' && SMTP_SECURE.toLowerCase() === 'true') || port === 465;

  try {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
    });
  } catch (err) {
    console.error('Failed to init mail transport', err);
    return null;
  }
};

const transporter = buildTransporter();

const csvEscape = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/["\n,]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const sendPrinterEmail = async ({
  order,
  orderItem,
  product,
  variant,
  user,
  designUrl,
  renderUrl,
  renderBuffer,
  customisation,
  shippingAddress
}) => {
  if (!PRINTER_EMAIL) {
    console.error('PRINTER_EMAIL is not configured; skipping printer email.');
    return;
  }
  if (!transporter) {
    console.error('SMTP transport is not configured; skipping printer email.');
    return;
  }

  const headers = [
    'order_id',
    'order_item_id',
    'created_at',
    'product_name',
    'variant_sku',
    'quantity',
    'unit_price',
    'total_price',
    'size',
    'color',
    'design_url',
    'render_url',
    'rotation',
    'scale',
    'position_x',
    'position_y',
    'customer_name',
    'customer_email',
    'customer_phone',
    'shipping_address_line1',
    'shipping_address_line2',
    'shipping_city',
    'shipping_state',
    'shipping_postal',
    'shipping_country',
    'notes'
  ];

  const orderCreated = order?.created_at || new Date().toISOString();
  const totalPrice = Number(orderItem?.unit_price || 0) * Number(orderItem?.quantity || 1);
  const row = [
    order?.id ?? '',
    orderItem?.id ?? '',
    orderCreated,
    product?.name ?? '',
    variant?.sku ?? variant?.id ?? '',
    orderItem?.quantity ?? 1,
    orderItem?.unit_price ?? '',
    totalPrice.toFixed(2),
    variant?.color ?? '',
    variant?.size ?? '',
    designUrl || '',
    renderUrl || designUrl || '',
    customisation?.rotation ?? 0,
    customisation?.scale ?? 1,
    customisation?.position_x ?? 0,
    customisation?.position_y ?? 0,
    shippingAddress?.full_name || user?.full_name || '',
    user?.email || '',
    shippingAddress?.phone || '',
    shippingAddress?.line1 || '',
    shippingAddress?.line2 || '',
    shippingAddress?.city || '',
    shippingAddress?.region || '',
    shippingAddress?.postal_code || '',
    shippingAddress?.country || '',
    ''
  ];
  const csv = [headers.join(','), row.map(csvEscape).join(',')].join('\n');

  const bodyLines = [
    'New order placed. Details below.',
    '',
    `Order: ${order?.id ?? 'N/A'}`,
    `Product: ${product?.name ?? 'N/A'}`,
    `Variant: ${variant?.sku ?? variant?.id ?? 'N/A'}`,
    `Quantity: ${orderItem?.quantity ?? 1}`,
    `Unit price: ${orderItem?.unit_price ?? 'N/A'}`,
    '',
    'Design:',
    `- Original: ${designUrl || 'N/A'}`,
    `- Render: ${renderUrl || designUrl || 'N/A'}`,
    `- Rotation: ${customisation?.rotation ?? 0}`,
    `- Scale: ${customisation?.scale ?? 1}`,
    `- Position: ${customisation?.position_x ?? 0}, ${customisation?.position_y ?? 0}`,
    '',
    'Customer:',
    `- Name: ${shippingAddress?.full_name || user?.full_name || 'N/A'}`,
    `- Email: ${user?.email || 'N/A'}`,
    `- Phone: ${shippingAddress?.phone || 'N/A'}`,
    'Shipping:',
    `- Address: ${[shippingAddress?.line1, shippingAddress?.line2].filter(Boolean).join(' ') || 'N/A'}`,
    `- City/State: ${[shippingAddress?.city, shippingAddress?.region].filter(Boolean).join(', ') || 'N/A'}`,
    `- Postal/Country: ${[shippingAddress?.postal_code, shippingAddress?.country].filter(Boolean).join(' ') || 'N/A'}`,
    '',
    'CSV attached for import. Assets are public links.'
  ];

  const attachments = [
    {
      filename: `order_${order?.id ?? 'new'}.csv`,
      content: csv,
      contentType: 'text/csv'
    }
  ];

  if (renderBuffer && renderBuffer.length) {
    attachments.push({
      filename: `design_${order?.id ?? 'new'}.png`,
      content: renderBuffer,
      contentType: 'image/png'
    });
  }

  const subject = `New Order #${order?.id ?? 'N/A'} - ${product?.name ?? 'Custom Product'} (${
    variant?.sku ?? variant?.id ?? 'variant'
  })`;

  await transporter.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to: PRINTER_EMAIL,
    replyTo: MAIL_REPLY_TO || user?.email || undefined,
    subject,
    text: bodyLines.join('\n'),
    attachments
  });
};
