import { Pool } from 'pg';
import sqliteDb from './db-sqlite';

// This ensures that we only have one instance of the pool across the application.

declare global {
  var pool: Pool | undefined;
}

let db: Pool | typeof sqliteDb | null;

if (process.env.NODE_ENV === 'production') {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is required in production');
  }
  db = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
} else {
  if (process.env.POSTGRES_URL) {
    if (!global.pool) {
      global.pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
      });
    }
    db = global.pool;
  } else {
    console.warn('POSTGRES_URL not set, falling back to SQLite for local development');
    db = sqliteDb;
  }
}

// Initialize database tables
export async function initializeDatabase() {
  if (!db) {
    console.warn('Database not available, skipping initialization');
    return;
  }
  
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        pgp_public_key TEXT,
        two_factor_secret VARCHAR(255),
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        is_verified_seller BOOLEAN DEFAULT FALSE,
        subscription_tier VARCHAR(50) DEFAULT 'free',
        subscription_expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create listings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price_xmr DECIMAL(12, 8) NOT NULL,
        category VARCHAR(100),
        condition VARCHAR(50),
        location VARCHAR(255),
        is_hidden BOOLEAN DEFAULT FALSE,
        is_time_locked BOOLEAN DEFAULT FALSE,
        visible_from TIMESTAMP WITH TIME ZONE,
        visible_until TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 1,
        total_price_xmr DECIMAL(12, 8) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        escrow_address VARCHAR(255),
        escrow_tx_id VARCHAR(255),
        shipping_address TEXT,
        tracking_number VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        encrypted_content TEXT NOT NULL,
        pgp_encrypted BOOLEAN DEFAULT FALSE,
        self_destruct_at TIMESTAMP WITH TIME ZONE,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create update trigger function
    await db.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers
    await db.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await db.query(`
      DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
      CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    await db.query(`
      DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
      CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // Indexes for better performance
    await db.query(`
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

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Initialize database on import
if (process.env.NODE_ENV === 'production' || process.env.INIT_DB === 'true') {
  initializeDatabase().catch(console.error);
}

export default db;

