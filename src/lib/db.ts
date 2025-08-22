import { Pool } from 'pg';

// This ensures that we only have one instance of the pool across the application.

declare global {
  var pool: Pool | undefined;
}

let db;

if (process.env.NODE_ENV === 'production') {
  if (process.env.POSTGRES_URL) {
    db = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  } else {
    console.error('POSTGRES_URL environment variable is not set');
    db = null;
  }
} else {
  if (process.env.POSTGRES_URL) {
    if (!global.pool) {
      global.pool = new Pool({
        connectionString: process.env.POSTGRES_URL,
      });
    }
    db = global.pool;
  } else {
    console.warn('POSTGRES_URL not set, database operations will be disabled');
    db = null;
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

