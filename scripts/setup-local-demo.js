const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

// Create or open the database
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

// Initialize tables
function initializeTables() {
  console.log('Creating database tables...');
  
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

  console.log('Database tables created successfully!');
}

// Demo listings data
const demoListings = [
  {
    title: "Monero Full Node VPS (1 Month)",
    description: "Managed VPS pre-configured with a synced Monero full node (pruned). Includes monitoring, automatic updates, and weekly backups. Renewal available.",
    price_xmr: 0.18,
    category: "VPS & Hosting",
    condition: "New",
    location: "Remote",
    status: "active"
  },
  {
    title: "Hardware Wallet - Ledger Nano X (Sealed)",
    description: "Brand new, factory-sealed Ledger Nano X hardware wallet. Purchased from official distributor. Supports XMR via third-party apps.",
    price_xmr: 0.95,
    category: "Electronics",
    condition: "New",
    location: "Silicon Valley, CA",
    status: "active"
  },
  {
    title: "Cold Storage Metal Backup Kit",
    description: "Stainless steel seed backup kit with letter tiles. Fire-resistant, corrosion-proof. Includes tamper-evident seals and instructions.",
    price_xmr: 0.32,
    category: "Security",
    condition: "New",
    location: "Austin, TX",
    status: "active"
  },
  {
    title: "Raspberry Pi 4 Monero Node Kit",
    description: "Raspberry Pi 4 (4GB) with 256GB microSD pre-imaged for Monero node, aluminum case, fan, and power supply. Quick-start guide included.",
    price_xmr: 1.6,
    category: "Hardware",
    condition: "Used - Like New",
    location: "Portland, OR",
    status: "active"
  },
  {
    title: "PGP Key Signing Service",
    description: "Identity verification and PGP key signing service. Includes verification call, proof-of-control checks, and published signature on your key.",
    price_xmr: 0.06,
    category: "Services",
    condition: "New",
    location: "Remote",
    status: "active"
  },
  {
    title: "Monero Wallet Hardening Session (1h)",
    description: "One-on-one video session covering best practices for securing your Monero wallet: backups, watch-only, view keys, offline signing.",
    price_xmr: 0.22,
    category: "Education",
    condition: "New",
    location: "Remote",
    status: "active"
  },
  {
    title: "ASIC Miner Power Supply (APW7)",
    description: "Genuine Bitmain APW7 1800W PSU. Cleaned, tested, and stable under load. Includes power cable and 10x PCIe connectors.",
    price_xmr: 0.58,
    category: "Mining",
    condition: "Used - Good",
    location: "Phoenix, AZ",
    status: "active"
  },
  {
    title: "Privacy Coins 101 - eBook (PDF)",
    description: "Beginner-friendly guide to privacy coins with a focus on Monero: transactions, wallets, nodes, and operational security.",
    price_xmr: 0.03,
    category: "Education",
    condition: "New",
    location: "Remote",
    status: "active"
  },
  {
    title: "Cryptocurrency Hardware Wallet (Trezor Model T)",
    description: "Lightly used Trezor Model T in excellent condition. Reset to factory settings. Includes USB-C cable and original box.",
    price_xmr: 1.15,
    category: "Electronics",
    condition: "Used - Excellent",
    location: "Los Angeles, CA",
    status: "active"
  },
  {
    title: "Monero Sticker Pack (10 pcs)",
    description: "High-quality vinyl stickers with Monero designs. Waterproof and UV resistant. Great for laptops and gear.",
    price_xmr: 0.01,
    category: "Collectibles",
    condition: "New",
    location: "Chicago, IL",
    status: "active"
  },
  {
    title: "GPU Mining Frame (6-GPU)",
    description: "Aluminum open-air mining frame for up to 6 GPUs. Includes screws, riser mounts, and fans. Some cosmetic wear.",
    price_xmr: 0.24,
    category: "Mining",
    condition: "Used - Good",
    location: "Denver, CO",
    status: "active"
  },
  {
    title: "Crypto Tax Spreadsheet Template",
    description: "Customizable spreadsheet template for tracking cryptocurrency trades, mining income, and expenses. Includes formulas and pivot tables.",
    price_xmr: 0.04,
    category: "Software",
    condition: "New",
    location: "Remote",
    status: "active"
  },
  {
    title: "Monero Donation QR Plaque (Laser-engraved)",
    description: "Laser-engraved acrylic plaque with your Monero address encoded as QR. Great for cafés, booths, or desks. Includes stand.",
    price_xmr: 0.12,
    category: "Collectibles",
    condition: "New",
    location: "Seattle, WA",
    status: "active"
  },
  {
    title: "OpSec Review for Crypto Sellers (90m)",
    description: "Security assessment for online sellers: device hygiene, password managers, 2FA, PGP, wallet segregation, shipping privacy.",
    price_xmr: 0.45,
    category: "Services",
    condition: "New",
    location: "Remote",
    status: "active"
  },
  {
    title: "Prepaid Mobile eSIM (Data Only)",
    description: "Anonymous eSIM with global data plan for 30 days. Great for travel and privacy. Activation instructions included.",
    price_xmr: 0.17,
    category: "Telecom",
    condition: "New",
    location: "Remote",
    status: "active"
  },
  {
    title: "USB Rubber Ducky (PenTest Tool)",
    description: "Original USB Rubber Ducky for authorized testing and education. Ships with case. For legitimate security research only.",
    price_xmr: 0.39,
    category: "Security",
    condition: "Used - Excellent",
    location: "Boston, MA",
    status: "active"
  },
  {
    title: "Monero-branded Hoodie",
    description: "Cozy black hoodie with Monero logo, 320gsm fleece. Sizes S-XL available. Screen-printed locally.",
    price_xmr: 0.2,
    category: "Clothing",
    condition: "New",
    location: "New York, NY",
    status: "active"
  },
  {
    title: "Self-Hosted BTC/XMR Pay Button (Source Code)",
    description: "Lightweight, self-hosted pay button with XMR and BTC support. Includes serverless functions and setup guide. MIT license.",
    price_xmr: 0.16,
    category: "Software",
    condition: "New",
    location: "Remote",
    status: "active"
  },
  {
    title: "Portable Faraday Bag (Laptop)",
    description: "Signal-blocking Faraday bag for 13-15\" laptops and hardware wallets. Blocks WiFi, BT, NFC, GPS, and cellular.",
    price_xmr: 0.28,
    category: "Security",
    condition: "New",
    location: "San Diego, CA",
    status: "active"
  },
  {
    title: "Monero OTC Mediation (Per Case)",
    description: "Trusted third-party mediation for OTC XMR trades. Includes identity verification, escrow coordination, and dispute resolution.",
    price_xmr: 0.7,
    category: "Services",
    condition: "New",
    location: "Remote",
    status: "active"
  }
];

function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get('demo_seller');
    
    if (existingUser) {
      console.log('Demo user already exists with ID:', existingUser.id);
      return existingUser.id;
    }

    // Create test user
    const passwordHash = bcrypt.hashSync('password123', 10);
    const result = db.prepare(
      'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?) RETURNING id'
    ).get('demo_seller', passwordHash, 'demo@example.com');
    
    console.log('Created demo user with ID:', result.id);
    return result.id;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

function addDemoListings() {
  try {
    console.log('Setting up local demo database...');
    
    // Initialize tables
    initializeTables();
    
    // Create test user
    const sellerId = createTestUser();
    
    // Clear existing demo listings
    db.prepare('DELETE FROM listings WHERE seller_id = ?').run(sellerId);
    console.log('Cleared existing demo listings');
    
    // Add demo listings
    console.log('Adding demo listings...');
    
    const insertListing = db.prepare(`
      INSERT INTO listings (seller_id, title, description, price_xmr, category, condition, location, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const listing of demoListings) {
      insertListing.run(
        sellerId,
        listing.title,
        listing.description,
        listing.price_xmr,
        listing.category,
        listing.condition,
        listing.location,
        listing.status
      );
    }
    
    console.log(`Successfully added ${demoListings.length} demo listings!`);
    
    // Verify listings were added
    const result = db.prepare('SELECT COUNT(*) as count FROM listings WHERE seller_id = ?').get(sellerId);
    console.log(`Total listings in database for demo user: ${result.count}`);
    
    console.log('\nDemo setup complete!');
    console.log('You can now login with:');
    console.log('Username: demo_seller');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error setting up demo:', error);
  } finally {
    db.close();
  }
}

// Run the script
addDemoListings();