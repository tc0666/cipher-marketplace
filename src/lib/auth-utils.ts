import bcrypt from 'bcrypt';
import db from './db-sqlite';

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function findUserByUsername(username: string) {
  const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
}

export async function createUser(username: string, passwordHash: string) {
  await db.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, passwordHash]);
}
