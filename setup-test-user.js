const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

// Create or open the database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Create tables first
console.log('Creating database tables...');
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
console.log('Tables created successfully!');

// Hash the password
const password = 'password123';
const saltRounds = 10;
const passwordHash = bcrypt.hashSync(password, saltRounds);

// Insert test user
try {
  const stmt = db.prepare('INSERT OR REPLACE INTO users (username, password_hash, email, created_at, updated_at) VALUES (?, ?, ?, datetime(\'now\'), datetime(\'now\'))');
  const result = stmt.run('testuser', passwordHash, 'test@example.com');
  
  console.log('Test user created successfully!');
  console.log('Username: testuser');
  console.log('Password: password123');
  console.log('User ID:', result.lastInsertRowid);
} catch (error) {
  console.error('Error creating test user:', error);
}

// Verify the user was created
try {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get('testuser');
  if (user) {
    console.log('\nUser verification successful:');
    console.log('ID:', user.id);
    console.log('Username:', user.username);
    console.log('Email:', user.email);
    console.log('Created at:', user.created_at);
  } else {
    console.log('User not found!');
  }
} catch (error) {
  console.error('Error verifying user:', error);
}

db.close();