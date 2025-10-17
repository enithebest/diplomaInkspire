import { query, createConnection } from './mysql.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function login(email, password) {
  const db = await createConnection();

  // Get rows directly from the pool query helper
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    db.release();
    return { token: null, message: 'Email not found' };
  }

  const user = rows[0];

  // ✅ extra safety: trim email & lowercase
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    db.release();
    return { token: null, message: 'Incorrect password' };
  }

  // ✅ clear previous session
  await db.execute(
    'UPDATE users SET session_token = NULL, session_expiration = NULL WHERE id = ?',
    [user.id]
  );

  const token = uuidv4();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.execute(
    'UPDATE users SET session_token = ?, session_expiration = ? WHERE id = ?',
    [token, expires, user.id]
  );

  db.release();

  return { token, message: 'Login successful' };
}

export async function register(email, full_name, password) {
  const db = await createConnection();
  const hashed = await bcrypt.hash(password, 12);

  const [emailTaken] = await db.query('SELECT 1 FROM users WHERE email = ?', [email]);
  if (emailTaken.length) {
    db.release();
    return { token: null, message: 'Email already in use' };
  }

  await db.execute(
    'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
    [email, hashed, full_name]
  );

  const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  const userId = rows[0].id;

  const token = uuidv4();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.execute(
    'UPDATE users SET session_token = ?, session_expiration = ? WHERE id = ?',
    [token, expires, userId]
  );

  db.release();
  return { token, message: 'User registered successfully' };
}
