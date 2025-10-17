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

export const actions = {
  search: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.trim();

    if (!name) {
      return { message: 'Bitte gib einen Produktnamen ein.', products: [] };
    }

    const products = await query('SELECT * FROM products WHERE name LIKE ?', [`%${name}%`]);

    if (products.length === 0) {
      return { message: `Kein Produkt mit dem Namen "${name}" gefunden.`, products: [] };
    }

    return { products, message: '' };
  }
};