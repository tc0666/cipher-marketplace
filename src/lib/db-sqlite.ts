import Database from 'better-sqlite3';
import path from 'path';

// Create SQLite database file in the project root
const dbPath = path.join(process.cwd(), 'database.sqlite');

// This ensures that we only have one instance of the database across the application.
declare global {
  // eslint-disable-next-line no-var
  var db: Database.Database | undefined;
}

let database: Database.Database | null = null;

function ensureDatabase(): Database.Database {
  if (database) return database;

  // In production, this module should not be used. Prevent attempting to open a file on read-only FS.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SQLite adapter should not be used in production');
  }

  if (!global.db) {
    global.db = new Database(dbPath);
    // Initialize tables if they don't exist
    initializeTables(global.db);
  }
  database = global.db;
  return database;
}

function initializeTables(db: Database.Database) {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT UNIQUE,
      pgp_public_key TEXT,
      two_factor_secret TEXT,
      two_factor_enabled BOOLEAN DEFAULT FALSE,
      is_verified_seller BOOLEAN DEFAULT FALSE,
      subscription_tier TEXT DEFAULT 'free',
      subscription_expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create listings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price_xmr REAL NOT NULL,
      category TEXT,
      condition TEXT,
      location TEXT,
      is_hidden BOOLEAN DEFAULT FALSE,
      is_time_locked BOOLEAN DEFAULT FALSE,
      visible_from DATETIME,
      visible_until DATETIME,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL,
      buyer_id INTEGER NOT NULL,
      seller_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      total_price_xmr REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      escrow_address TEXT,
      escrow_tx_id TEXT,
      shipping_address TEXT,
      tracking_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
      FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      recipient_id INTEGER NOT NULL,
      encrypted_content TEXT NOT NULL,
      pgp_encrypted BOOLEAN DEFAULT FALSE,
      self_destruct_at DATETIME,
      is_read BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
    CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
    CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
    CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_messages_order_id ON messages(order_id);
    CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
    CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
  `);

  console.log('SQLite database initialized with tables');
}

// Adapter to make SQLite work with existing PostgreSQL-style queries
export default {
  query: (text: string, params: any[] = []) => {
    try {
      const db = ensureDatabase();
      // Convert PostgreSQL-style $1, $2 placeholders to SQLite ? placeholders
      let sqliteQuery = text;
      for (let i = params.length; i >= 1; i--) {
        sqliteQuery = sqliteQuery.replace(new RegExp(`\\$${i}`, 'g'), '?');
      }

      const stmt = db.prepare(sqliteQuery);
      
      if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
        const rows = stmt.all(...params);
        return { rows };
      } else {
        const result = stmt.run(...params);
        return { 
          rows: [], 
          rowCount: result.changes,
          insertId: result.lastInsertRowid 
        };
      }
    } catch (error) {
      console.error('Database query error:', error);
      console.error('Query:', text);
      console.error('Params:', params);
      throw error;
    }
  }
};