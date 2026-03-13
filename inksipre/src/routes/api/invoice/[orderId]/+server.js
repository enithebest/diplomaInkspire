import { createConnection } from '$lib/db/mysql.js';
import { error } from '@sveltejs/kit';

const escapePdfText = (value) =>
  String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const formatMoney = (value) => `${Number(value || 0).toFixed(2)} USD`;

const buildInvoicePdf = ({ invoiceNumber, order, user, shippingAddress, items }) => {
  const subtotal = (items || []).reduce(
    (sum, item) => sum + Number(item.line_total ?? Number(item.quantity || 0) * Number(item.unit_price || 0)),
    0
  );
  const orderTotal = Number(order?.total_price || 0);
  const shipping = Math.max(0, orderTotal - subtotal);
  const issueDate = new Date(order.created_at).toISOString().slice(0, 10);

  const lines = [];
  const text = (x, y, size, value, font = 'F1') => {
    lines.push('BT');
    lines.push(`/${font} ${size} Tf`);
    lines.push(`1 0 0 1 ${x} ${y} Tm`);
    lines.push(`(${escapePdfText(value)}) Tj`);
    lines.push('ET');
  };
  const rectFill = (x, y, w, h, r, g, b) => {
    lines.push(`${r} ${g} ${b} rg`);
    lines.push(`${x} ${y} ${w} ${h} re f`);
  };
  const rectStroke = (x, y, w, h, lw = 1) => {
    lines.push(`${lw} w`);
    lines.push('0.85 0.87 0.9 RG');
    lines.push(`${x} ${y} ${w} ${h} re S`);
  };
  const lineStroke = (x1, y1, x2, y2, lw = 1) => {
    lines.push(`${lw} w`);
    lines.push('0.85 0.87 0.9 RG');
    lines.push(`${x1} ${y1} m ${x2} ${y2} l S`);
  };

  // Header band + logo block
  rectFill(0, 742, 612, 50, 0.07, 0.1, 0.18);
  rectFill(46, 752, 34, 30, 0.31, 0.27, 0.9);
  text(57, 760, 16, 'I', 'F2');
  text(90, 765, 20, 'INKSPIRE', 'F2');
  text(460, 765, 18, 'INVOICE', 'F2');

  // Seller / invoice meta
  text(50, 710, 10, 'From', 'F2');
  text(50, 695, 10, 'Inkspire Studio');
  text(50, 681, 10, 'Leipzig, DE');
  text(50, 667, 10, 'support@inkspire.studio');

  text(360, 710, 10, 'Invoice No', 'F2');
  text(455, 710, 10, invoiceNumber);
  text(360, 695, 10, 'Order ID', 'F2');
  text(455, 695, 10, String(order.id));
  text(360, 681, 10, 'Issue Date', 'F2');
  text(455, 681, 10, issueDate);
  text(360, 667, 10, 'Status', 'F2');
  text(455, 667, 10, 'PAID');

  // Bill to section
  rectStroke(46, 600, 520, 52);
  text(54, 634, 10, 'Bill To', 'F2');
  text(54, 619, 10, shippingAddress?.ship_name || user?.full_name || user?.email || 'Customer');
  text(54, 605, 10, [shippingAddress?.ship_line1, shippingAddress?.ship_line2].filter(Boolean).join(' ') || 'N/A');
  text(
    285,
    605,
    10,
    [shippingAddress?.ship_city, shippingAddress?.ship_region, shippingAddress?.ship_postal, shippingAddress?.ship_country]
      .filter(Boolean)
      .join(', ') || 'N/A'
  );

  // Table header
  rectFill(46, 566, 520, 24, 0.95, 0.96, 0.98);
  rectStroke(46, 566, 520, 24);
  text(54, 574, 10, 'Item', 'F2');
  text(350, 574, 10, 'Qty', 'F2');
  text(410, 574, 10, 'Unit', 'F2');
  text(490, 574, 10, 'Line Total', 'F2');

  // Table rows
  let y = 548;
  const cappedItems = (items || []).slice(0, 14);
  for (const item of cappedItems) {
    const qty = Number(item.quantity || 0);
    const unit = Number(item.unit_price || 0);
    const total = Number(item.line_total || qty * unit);
    rectStroke(46, y - 4, 520, 22, 0.5);
    text(54, y + 4, 10, String(item.name || 'Product'));
    text(355, y + 4, 10, String(qty));
    text(410, y + 4, 10, formatMoney(unit));
    text(490, y + 4, 10, formatMoney(total));
    y -= 22;
  }
  if ((items || []).length > cappedItems.length) {
    text(54, y + 4, 9, `... and ${(items || []).length - cappedItems.length} more items`);
    y -= 18;
  }

  // Totals
  rectStroke(356, y - 52, 210, 64);
  text(366, y - 14, 10, 'Subtotal', 'F2');
  text(490, y - 14, 10, formatMoney(subtotal));
  text(366, y - 28, 10, 'Shipping', 'F2');
  text(490, y - 28, 10, formatMoney(shipping));
  lineStroke(366, y - 34, 556, y - 34, 1);
  text(366, y - 48, 11, 'Total', 'F2');
  text(490, y - 48, 11, formatMoney(orderTotal), 'F2');

  // Footer
  text(50, 72, 9, 'Thank you for your order.');
  text(50, 58, 9, 'This invoice was generated automatically after successful payment.');
  text(50, 44, 9, `Customer: ${user?.email || 'N/A'}`);

  const content = `${lines.join('\n')}\n`;
  const contentLength = Buffer.byteLength(content, 'utf8');

  const objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  objects.push(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>\nendobj\n'
  );
  objects.push(`4 0 obj\n<< /Length ${contentLength} >>\nstream\n${content}endstream\nendobj\n`);
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');
  objects.push('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj;
  }
  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, 'binary');
};

export const GET = async ({ params, locals }) => {
  const user = locals?.user;
  if (!user) throw error(401, 'Unauthorized');

  const orderId = Number(params.orderId);
  if (!Number.isFinite(orderId) || orderId <= 0) throw error(400, 'Invalid order id');

  const db = await createConnection();
  try {
    const [orders] = await db.query(
      `SELECT
         o.id, o.user_id, o.total_price, o.status, o.created_at,
         a.full_name AS ship_name, a.line1 AS ship_line1, a.line2 AS ship_line2,
         a.city AS ship_city, a.region AS ship_region, a.postal_code AS ship_postal, a.country AS ship_country
       FROM orders o
       LEFT JOIN addresses a ON a.id = o.shipping_address_id
       WHERE o.id = ? AND o.user_id = ?
       LIMIT 1`,
      [orderId, user.id]
    );
    const order = orders?.[0];
    if (!order) throw error(404, 'Order not found');
    if ((order.status || '').toLowerCase() !== 'paid') throw error(400, 'Invoice available after payment only');

    const [items] = await db.query(
      `SELECT oi.quantity, oi.unit_price, (oi.quantity * oi.unit_price) AS line_total, p.name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [orderId]
    );

    const invoiceNumber = `INV-${String(order.id).padStart(6, '0')}`;
    const pdf = buildInvoicePdf({
      invoiceNumber,
      order,
      user,
      shippingAddress: order,
      items
    });
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice_${order.id}.pdf"`,
        'Cache-Control': 'no-store'
      }
    });
  } finally {
    db.release();
  }
};
