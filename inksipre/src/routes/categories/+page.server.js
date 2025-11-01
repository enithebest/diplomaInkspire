import { query } from '$lib/db/mysql.js';

export const load = async () => {
  // Fetch products grouped by category
  const [hoodies, tshirts, sweatshirts, mugs] = await Promise.all([
    query('SELECT * FROM products WHERE category = "hoodies" LIMIT 4'),
    query('SELECT * FROM products WHERE category = "tshirts" LIMIT 4'),
    query('SELECT * FROM products WHERE category = "sweatshirts" LIMIT 4'),
    query('SELECT * FROM products WHERE category = "mugs" LIMIT 4')
  ]);

  return { hoodies, tshirts, sweatshirts, mugs };
};

export const actions = {
  search: async ({ request }) => {
    const formData = await request.formData();
    const raw = formData.get('name');
    const name = raw ? String(raw).trim().slice(0, 50).replace(/[\%_]/g, '') : '';

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
