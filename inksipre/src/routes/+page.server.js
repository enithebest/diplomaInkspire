import { query } from '$lib/db/mysql.js';

export const load = async () => {
  // Top 4 products by total quantity sold
  const bestRows = await query(
    `SELECT p.id, p.name, p.description, p.base_price, COALESCE(SUM(oi.quantity), 0) AS total_sold
     FROM products p
     LEFT JOIN order_items oi ON oi.product_id = p.id
     GROUP BY p.id, p.name, p.description, p.base_price
     ORDER BY total_sold DESC, p.created_at DESC
     LIMIT 4`
  );

  let bestsellers = bestRows || [];

  // Fallback: if no orders yet, just pick 4 latest products
  if (!bestsellers.length) {
    bestsellers = await query(
      `SELECT id, name, description, base_price, 0 AS total_sold
       FROM products
       ORDER BY created_at DESC
       LIMIT 4`
    );
  }

  return { bestsellers };
};

