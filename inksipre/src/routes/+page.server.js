import { query } from '$lib/db/mysql.js';

export const load = async () => {
  const bestsellers = query(
    `SELECT p.id, p.name, p.description, p.base_price, p.image_url, COALESCE(SUM(oi.quantity), 0) AS total_sold
     FROM products p
     LEFT JOIN order_items oi ON oi.product_id = p.id
     GROUP BY p.id, p.name, p.description, p.base_price, p.image_url
     ORDER BY total_sold DESC, p.created_at DESC
     LIMIT 4`
  ).then(async (bestRows) => {
    if (bestRows?.length) return bestRows;

    return await query(
      `SELECT id, name, description, base_price, image_url, 0 AS total_sold
       FROM products
       ORDER BY created_at DESC
       LIMIT 4`
    );
  });

  return { bestsellers };
};
