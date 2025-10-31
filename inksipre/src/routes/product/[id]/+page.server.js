import { query } from '$lib/db/mysql.js';

export const load = async ({ params }) => {
  const { id } = params;

  // Get the base product
  const [product] = await query('SELECT * FROM products WHERE id = ?', [id]);

  if (!product || product.length === 0) {
    return { product: null, variants: [] };
  }

  // Get all variants linked to this product
  const variants = await query(
    'SELECT id, color, size, price, image_url FROM product_variants WHERE product_id = ?',
    [id]
  );

  return { product: product[0], variants };
};
