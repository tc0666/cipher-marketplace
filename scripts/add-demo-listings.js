const Database = require('better-sqlite3');
const path = require('path');

// Connect to the database
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

// Initialize tables if they don't exist (same as in db-sqlite.ts)
function initializeTables() {
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

  console.log('Database tables initialized');
}

// Initialize tables
initializeTables();

// Demo listings data
const demoListings = [
  {
    seller_id: 1, // Assuming user with ID 1 exists
    title: "Vintage Leather Jacket",
    description: "Authentic vintage leather jacket from the 1980s. Excellent condition with minimal wear. Perfect for motorcycle enthusiasts or fashion lovers. Size Large.",
    price_xmr: 0.25,
    category: "Clothing",
    condition: "Used - Excellent",
    location: "New York, NY",
    is_hidden: false,
    status: "active"
  },
  {
    seller_id: 1,
    title: "Gaming Laptop - RTX 3070",
    description: "High-performance gaming laptop with NVIDIA RTX 3070, Intel i7-11800H, 16GB RAM, 1TB SSD. Perfect for gaming and content creation. Barely used, still under warranty.",
    price_xmr: 1.8,
    category: "Electronics",
    condition: "Used - Like New",
    location: "San Francisco, CA",
    is_hidden: false,
    status: "active"
  },
  {
    seller_id: 1,
    title: "Rare Bitcoin Mining Hardware",
    description: "Antminer S19 Pro 110TH/s Bitcoin miner. Excellent condition, well-maintained. Includes power supply and cables. Great for crypto mining operations.",
    price_xmr: 2.5,
    category: "Electronics",
    condition: "Used - Good",
    location: "Austin, TX",
    is_hidden: false,
    status: "active"
  },
  {
    seller_id: 1,
    title: "Handcrafted Wooden Desk",
    description: "Beautiful handcrafted oak desk with multiple drawers. Perfect for home office or study. Solid wood construction, no particle board. Dimensions: 60\"W x 30\"D x 30\"H.",
    price_xmr: 0.8,
    category: "Furniture",
    condition: "New",
    location: "Portland, OR",
    is_hidden: false,
    status: "active"
  },
  {
    seller_id: 1,
    title: "Professional Camera Kit",
    description: "Canon EOS R5 with 24-70mm f/2.8L lens, extra batteries, memory cards, and carrying case. Perfect for professional photography. Low shutter count.",
    price_xmr: 3.2,
    category: "Electronics",
    condition: "Used - Excellent",
    location: "Los Angeles, CA",
    is_hidden: false,
    status: "active"
  },
  {
    seller_id: 1,
    title: "Collectible Vinyl Records",
    description: "Collection of rare vinyl records from the 70s and 80s. Includes Pink Floyd, Led Zeppelin, and The Beatles. All in excellent condition with original sleeves.",
    price_xmr: 0.6,
    category: "Collectibles",
    condition: "Used - Excellent",
    location: "Nashville, TN",
    is_hidden: false,
    status: "active"
  },
  {
    seller_id: 1,
    title: "Mountain Bike - Trek X-Caliber",
    description: "Trek X-Caliber 8 mountain bike, size Large. 29\" wheels, 1x12 drivetrain, hydraulic disc brakes. Great for trail riding and cross-country. Well-maintained.",
    price_xmr: 0.9,
    category: "Sports",
    condition: "Used - Good",
    location: "Denver, CO",
    is_hidden: false,
    status: "active"
  },
  {
    seller_id: 1,
    title: "Artisan Coffee Beans",
    description: "Premium single-origin coffee beans from Ethiopia. Freshly roasted, medium roast with notes of chocolate and citrus. Perfect for espresso or pour-over. 2lb bag.",
    price_xmr: 0.05,
    category: "Food & Beverages",
    condition: "New",
    location: "Seattle, WA",
    is_hidden: false,
    status: "active"
  },
  {
    seller_id: 1,
    title: "Smart Home Security System",
    description: "Complete smart home security system with 8 cameras, central hub, motion sensors, and mobile app. Easy installation, cloud storage included for 1 year.",
    price_xmr: 1.2,
    category: "Electronics",
    condition: "New",
    location: "Miami, FL",
    is_hidden: false,
    status: "active"
  },
  {
    seller_id: 1,
    title: "Vintage Watch Collection",
    description: "Collection of 5 vintage watches from the 1960s-1980s. Includes Seiko, Citizen, and Timex. All working condition, some may need minor servicing. Great for collectors.",
    price_xmr: 0.4,
    category: "Collectibles",
    condition: "Used - Good",
    location: "Chicago, IL",
    is_hidden: false,
    status: "active"
  }
];

try {
  console.log('Adding demo listings to database...');
  
  // Prepare the insert statement
  const insertStmt = db.prepare(`
    INSERT INTO listings 
    (seller_id, title, description, price_xmr, category, condition, location, is_hidden, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Insert each demo listing
  let count = 0;
  for (const listing of demoListings) {
    try {
      const result = insertStmt.run(
        listing.seller_id,
        listing.title,
        listing.description,
        listing.price_xmr,
        listing.category,
        listing.condition,
        listing.location,
        listing.is_hidden ? 1 : 0,
        listing.status
      );
      count++;
      console.log(`Added listing: ${listing.title} (ID: ${result.lastInsertRowid})`);
    } catch (error) {
      console.error(`Error adding listing "${listing.title}":`, error.message);
    }
  }
  
  console.log(`\nSuccessfully added ${count} demo listings to the database!`);
  
} catch (error) {
  console.error('Error connecting to database:', error.message);
} finally {
  db.close();
}