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
    const normalized = name.toLowerCase().replace(/[\s-]/g, '');

    const synonymMatch = /^t\s*-?\s*shirt$/i.test(raw || '') || normalized === 'tshirt';
    const searchAlias = synonymMatch ? 'tee' : name;

    if (!name) {
      return { message: 'Bitte gib einen Produktnamen ein.', products: [], searchTerm: '' };
    }

    const terms = Array.from(new Set([name.toLowerCase(), searchAlias.toLowerCase()])).filter(Boolean);
    const searchClauses = terms.map(() => '(LOWER(name) LIKE ? OR LOWER(category) LIKE ?)');
    const params = terms.flatMap((term) => [`%${term}%`, `%${term}%`]);

    const sql = `SELECT * FROM products WHERE ${searchClauses.join(' OR ')}`;
    const products = await query(sql, params);

    if (products.length === 0) {
      return { message: `Kein Produkt mit dem Namen "${name}" gefunden.`, products: [], searchTerm: name };
    }

    return { products, message: '', searchTerm: name };
  }
};
