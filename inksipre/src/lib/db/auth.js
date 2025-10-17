import { createConnection } from './mysql.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; 

export async function login(email, password) {
  const db = await createConnection();

  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    db.release();
    return { token: null, message: 'Email not found' };
  }

  const user = users[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    db.release();
    return { token: null, message: 'Incorrect password' };
  }

  await db.execute(
    'UPDATE users SET session_token = NULL, session_expiration = NULL WHERE id = ?',
    [user.id]
  );

  const token = await createSessionToken(user.id);
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

  const token = await createSessionToken(userId);

  db.release();
  return { token, message: 'User registered successfully' };
}

export async function createSessionToken(userId) {
  const db = await createConnection();
  const token = uuidv4();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

  await db.execute(
    'UPDATE users SET session_token = ?, session_expiration = ? WHERE id = ?',
    [token, expires, userId]
  );

  db.release();
  return token;
}
