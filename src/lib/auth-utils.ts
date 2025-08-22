import bcrypt from 'bcrypt';
import db from './db';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  created_at: Date;
  updated_at: Date;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function findUserByUsername(username: string): Promise<User | null> {
  if (!db) {
    throw new Error('Database connection not available');
  }
  const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  return (result.rows[0] as User) || null;
}

export async function createUser(username: string, passwordHash: string) {
  if (!db) {
    throw new Error('Database connection not available');
  }
  await db.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, passwordHash]);
}
