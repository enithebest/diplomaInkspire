import { query } from '$lib/db/mysql.js';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// --- make sure /static/uploads exists ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = join(__dirname, '../../../../static/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// --- PAGE LOAD: get product data (optional) ---
export const load = async ({ params }) => {
  const { id } = params;
  const products = await query('SELECT * FROM products WHERE id = ?', [id]);
  return { product: products[0] ?? null };
};

// --- ACTION: handle file upload ---
export const actions = {
  upload: async ({ request, cookies, params }) => {
    console.log('🧠 Upload action triggered!');
    const formData = await request.formData();
    const file = formData.get('design');

    if (!file || file.size === 0) {
      console.log('❌ No file received');
      return fail(400, { message: 'No file uploaded' });
    }

    const sessionToken = cookies.get('session');
    const [user] = await query('SELECT id FROM users WHERE session_token = ?', [sessionToken]);

    if (!user) {
      console.log('❌ No user found for this session');
      return fail(401, { message: 'User not logged in' });
    }

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ File saved at: ${filepath}`);

    // Save to database
    const imageUrl = `/uploads/${filename}`;
    await query(
      'INSERT INTO uploads (user_id, customisation_id, image_url) VALUES (?, NULL, ?)',
      [user.id, imageUrl]
    );
    console.log('✅ DB record inserted for upload:', imageUrl);

    return { success: true, imageUrl };
  }
};
