import { createConnection } from './mysql';
import bcrypt from 'bcrypt';

export async function login(email, password) {
  const db = await createConnection();
  const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    db.release();
    return { token: null, message: 'Email not found' };
  }

  const valid = await bcrypt.compare(password, users[0].password_hash);
  if (!valid) {
    db.release();
    return { token: null, message: 'Incorrect password' };
  }

  await db.execute('UPDATE users SET session_token = NULL, session_expiration = NULL WHERE id = ?', [users[0].id]);

  const token = await createSessionToken(users[0].id);
  db.release();
  return { token, message: 'Login successful' };
}

export async function register(email, username, password) {
  const db = await createConnection();
  const hashed = await bcrypt.hash(password, 12);

  const [emailTaken] = await db.query('SELECT 1 FROM users WHERE email = ?', [email]);
  const [usernameTaken] = await db.query('SELECT 1 FROM users WHERE username = ?', [username]);

  if (emailTaken.length) return { success: false, message: 'Email already in use' };
  if (usernameTaken.length) return { success: false, message: 'Username already in use' };

  await db.execute('INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)', [email, username, hashed]);
  db.release();
  return { success: true, message: 'User registered successfully' };
}

export async function createSessionToken(userId) {
  const db = await createConnection();
  const token = uuidv4();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.execute('UPDATE users SET session_token = ?, session_expiration = ? WHERE id = ?', [token, expires, userId]);
  db.release();
  return token;
}