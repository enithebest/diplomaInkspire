// src/routes/customisation/[id]/+page.server.js
import { query } from '$lib/db/mysql.js';
import { fail, redirect } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export const load = async ({ params }) => {
  const { id } = params;
  const [product] = await query('SELECT * FROM products WHERE id = ?', [id]);
  return { product: product?.[0] ?? null };
};

export const actions = {
  upload: async ({ request, locals, params }) => {
    const user = locals?.user;
    if (!user) throw redirect(302, '/login');

    const form = await request.formData();
    const file = form.get('file');

    if (!file || typeof file === 'string') {
      return fail(400, { error: 'No file provided' });
    }

    // Optional: validate type & size
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return fail(400, { error: 'Invalid file type' });
    }
    if (file.size > 5_000_000) { // 5MB
      return fail(400, { error: 'File too large (max 5MB)' });
    }

    // Unique filename (tie to user & product/customisation)
    const filename = `${user.id}-${params.id}-${Date.now()}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN
    });

    // Store URL in DB (customisation_id NULL for now; link later if needed)
    await query(
      'INSERT INTO uploads (user_id, customisation_id, image_url) VALUES (?, NULL, ?)',
      [user.id, blob.url]
    );

    return { success: true, imageUrl: blob.url };
  }
};
