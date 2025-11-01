import { query } from '$lib/db/mysql.js';

export const load = async ({ params }) => {
  const { id } = params;

  // Get the base product
  const productRows = await query('SELECT * FROM products WHERE id = ?', [id]);
  const product = productRows?.[0] || null;

  if (!product) {
    return { product: null, variants: [] };
  }

  // Get all variants linked to this product
  const variantRows = await query(
    'SELECT id, price, option_values FROM product_variants WHERE product_id = ?',
    [id]
  );

  const variants = (variantRows || []).map((v) => {
    let color = null;
    let size = null;
    if (v.option_values) {
      try {
        const opts = typeof v.option_values === 'string' ? JSON.parse(v.option_values) : v.option_values;
        color = opts?.color ?? null;
        size = opts?.size ?? null;
      } catch {
        // ignore JSON parse errors and keep nulls
      }
    }
    return { id: v.id, price: v.price, color, size };
  });

  return { product, variants };
};
