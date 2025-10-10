import { query } from '$lib/db/mysql.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const { id } = params;

  try {
    const [product] = await query('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      throw error(404, 'Product not found');
    }

    // Fetch related variants or customisation options (if available later)
    const variants = await query('SELECT * FROM product_variants WHERE product_id = ?', [id]);

    return { product, variants };
  } catch (err) {
    console.error('❌ Error loading product:', err.message);
    throw error(500, 'Failed to load product data');
  }
};
