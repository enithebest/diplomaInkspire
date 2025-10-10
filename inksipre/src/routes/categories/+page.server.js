import { query } from '$lib/db/mysql.js';

export const load = async () => {
  // Fetch products grouped by category
  const [hoodies, tshirts, sweatshirts, mugs] = await Promise.all([
    query('SELECT * FROM products WHERE name LIKE "%Hoodie%" LIMIT 4'),
    query('SELECT * FROM products WHERE name LIKE "%T-Shirt%" LIMIT 4'),
    query('SELECT * FROM products WHERE name LIKE "%Sweatshirt%" LIMIT 4'),
    query('SELECT * FROM products WHERE name LIKE "%Mug%" LIMIT 1')
  ]);

  return { hoodies, tshirts, sweatshirts, mugs };
};
