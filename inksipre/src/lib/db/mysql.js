import mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from '$env/static/private';

// 👇 Add this right below the imports
console.log('🔍 Connecting to DB with config:', {
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  port: DB_PORT
});

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function createConnection() {
  return await pool.getConnection();
}

export async function query(sql, params = []) {
  const conn = await createConnection();
  const [rows] = await conn.query(sql, params);
  conn.release();
  return rows;
}
