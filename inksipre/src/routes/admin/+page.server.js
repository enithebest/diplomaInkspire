import { redirect, fail } from '@sveltejs/kit';
import { createConnection } from '$lib/db/mysql.js';
import fs from 'fs';
import path from 'path';

export async function load({ locals }) {
  if (!locals.user || locals.user.role !== 'admin') {
    throw redirect(302, '/');
  }

  const db = await createConnection();
  const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');

  for (const p of products) {
    const [variants] = await db.execute(
      'SELECT id, option_values, price FROM product_variants WHERE product_id = ? ORDER BY id DESC',
      [p.id]
    );
    p.variants = variants;
  }

  db.release();
  return { products };
}

export const actions = {
  create: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');

    const formData = await request.formData();
    const rawName = formData.get('name');
    const rawDesc = formData.get('description');
    const rawPrice = formData.get('base_price');
    const rawCategory = formData.get('category');
    const image = formData.get('image');

    const name = rawName ? String(rawName).trim().slice(0, 120) : '';
    const description = rawDesc ? String(rawDesc).trim().slice(0, 2000) : '';
    const base_price = Math.max(0, parseFloat(rawPrice)) || 0;
    const category = rawCategory ? String(rawCategory) : '';

    const allowedCategories = ['hoodies', 'tshirts', 'sweatshirts', 'mugs'];
    if (!name || !category || !image || !allowedCategories.includes(category)) {
      return fail(400, { message: 'Bitte alle Pflichtfelder ausfüllen.' });
    }

    const uploadDir = 'static/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (typeof image === 'string' || !allowed.includes(image.type)) {
      return fail(400, { message: 'Ungültiger Bildtyp. Erlaubt: PNG, JPG, WEBP.' });
    }
    if (image.size > 5_000_000) {
      return fail(400, { message: 'Datei zu groß (max. 5MB).' });
    }

    const originalName = String(image.name || 'upload');
    const safeName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
    const fileName = `${Date.now()}-${safeName || 'image'}`;
    const filePath = path.join(uploadDir, fileName);

    const arrayBuffer = await image.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    const imageUrl = `/uploads/${fileName}`;

    const db = await createConnection();
    await db.execute(
      'INSERT INTO products (name, description, base_price, category, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, base_price, category, imageUrl]
    );
    db.release();

    return { success: true, message: 'Produkt erfolgreich erstellt!' };
  },

  delete: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');
    const data = await request.formData();
    const id = data.get('id');
    const db = await createConnection();
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    db.release();
    return { success: true };
  },

  addVariant: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');
    const data = await request.formData();
    const product_id = data.get('product_id');
    const size = String(data.get('size') || '').trim().slice(0, 20);
    const color = String(data.get('color') || '').trim().slice(0, 50);
    const price = Math.max(0, parseFloat(data.get('price'))) || 0.0;

    const option_values = JSON.stringify({ size, color });
    const db = await createConnection();
    await db.execute(
      'INSERT INTO product_variants (product_id, option_values, price) VALUES (?, ?, ?)',
      [product_id, option_values, price]
    );
    db.release();

    return { success: true };
  },

  deleteVariant: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');
    const data = await request.formData();
    const id = data.get('id');
    const db = await createConnection();
    await db.execute('DELETE FROM product_variants WHERE id = ?', [id]);
    db.release();
    return { success: true };
  }
};
