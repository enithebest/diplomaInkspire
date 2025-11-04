import { query } from '$lib/db/mysql.js';
import { fail, redirect } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export const load = async ({ params, locals }) => {
  const { variant_id } = params;

  // Load the selected variant and its parent product
  const variantRows = await query('SELECT * FROM product_variants WHERE id = ?', [variant_id]);
  const variant = variantRows?.[0] || null;
  if (!variant) {
    return { product: null, variant: null };
  }

  const productRows = await query('SELECT * FROM products WHERE id = ?', [variant.product_id]);
  const product = productRows?.[0] || null;

  // If user is logged in, load their previous uploads (most recent first)
  let uploads = [];
  if (locals?.user?.id) {
    uploads = await query(
      'SELECT id, image_url FROM uploads WHERE user_id = ? ORDER BY id DESC LIMIT 100',
      [locals.user.id]
    );
  }

  return { product, variant, uploads };
};

export const actions = {
  upload: async ({ request, locals, params }) => {
    const user = locals?.user;
    if (!user) throw redirect(302, '/login');

    const { variant_id } = params;

    const form = await request.formData();
    const file = form.get('design');

    if (!file || typeof file === 'string') {
      return fail(400, { error: 'No file provided' });
    }

    // Validate file type and size
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return fail(400, { error: 'Invalid file type. Allowed: PNG, JPG, WEBP.' });
    }
    if (file.size > 5_000_000) {
      return fail(400, { error: 'File too large (max 5MB).' });
    }

    // Create a unique, sanitized name for the blob using the variant id
    const originalName = String(file.name || 'upload');
    const safeName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
    const filename = `${user.id}-${variant_id}-${Date.now()}-${safeName || 'image'}`;

    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN // optional in production (auto handled by Vercel)
    });

    // Store the uploaded file URL in the DB and link to variant
    await query(
      'INSERT INTO uploads (user_id, customisation_id, variant_id, image_url) VALUES (?, NULL, ?, ?)',
      [user.id, variant_id, blob.url]
    );

    return { success: true, imageUrl: blob.url };
  }
};

