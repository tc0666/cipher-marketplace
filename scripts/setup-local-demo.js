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
    title: "Vintage Leather Jacket",
    description: "Authentic vintage leather jacket from the 1980s. Excellent condition with minimal wear. Perfect for motorcycle enthusiasts or fashion lovers. Size Large.",
    price_xmr: 0.25,
    category: "Clothing",
    condition: "Used - Excellent",
    location: "New York, NY",
    status: "active"
  },
  {
    title: "Gaming Laptop - RTX 3070",
    description: "High-performance gaming laptop with NVIDIA RTX 3070, Intel i7-11800H, 16GB RAM, 1TB SSD. Perfect for gaming and content creation. Barely used, still under warranty.",
    price_xmr: 1.8,
    category: "Electronics",
    condition: "Used - Like New",
    location: "San Francisco, CA",
    status: "active"
  },
  {
    title: "Rare Bitcoin Mining Hardware",
    description: "Antminer S19 Pro 110TH/s Bitcoin miner. Excellent condition, well-maintained. Includes power supply and cables. Great for crypto mining operations.",
    price_xmr: 2.5,
    category: "Electronics",
    condition: "Used - Good",
    location: "Austin, TX",
    status: "active"
  },
  {
    title: "Handcrafted Wooden Desk",
    description: "Beautiful handcrafted oak desk with multiple drawers. Perfect for home office or study. Solid wood construction, no particle board. Dimensions: 60\"W x 30\"D x 30\"H.",
    price_xmr: 0.8,
    category: "Furniture",
    condition: "New",
    location: "Portland, OR",
    status: "active"
  },
  {
    title: "Professional Camera Kit",
    description: "Canon EOS R5 with 24-70mm f/2.8L lens, extra batteries, memory cards, and carrying case. Perfect for professional photography. Low shutter count.",
    price_xmr: 3.2,
    category: "Electronics",
    condition: "Used - Excellent",
    location: "Los Angeles, CA",
    status: "active"
  },
  {
    title: "Collectible Vinyl Records",
    description: "Collection of rare vinyl records from the 70s and 80s. Includes Pink Floyd, Led Zeppelin, and The Beatles. All in excellent condition with original sleeves.",
    price_xmr: 0.6,
    category: "Collectibles",
    condition: "Used - Excellent",
    location: "Nashville, TN",
    status: "active"
  },
  {
    title: "Mountain Bike - Trek X-Caliber",
    description: "Trek X-Caliber 8 mountain bike, size Large. 29\" wheels, 1x12 drivetrain, hydraulic disc brakes. Great for trail riding and cross-country. Well-maintained.",
    price_xmr: 0.9,
    category: "Sports",
    condition: "Used - Good",
    location: "Denver, CO",
    status: "active"
  },
  {
    title: "Artisan Coffee Beans",
    description: "Premium single-origin coffee beans from Ethiopia. Freshly roasted, medium roast with notes of chocolate and citrus. Perfect for espresso or pour-over. 2lb bag.",
    price_xmr: 0.05,
    category: "Food & Beverages",
    condition: "New",
    location: "Seattle, WA",
    status: "active"
  },
  {
    title: "Smart Home Security System",
    description: "Complete smart home security system with 8 cameras, central hub, motion sensors, and mobile app. Easy installation, cloud storage included for 1 year.",
    price_xmr: 1.2,
    category: "Electronics",
    condition: "New",
    location: "Miami, FL",
    status: "active"
  },
  {
    title: "Vintage Watch Collection",
    description: "Collection of 5 vintage watches from the 1960s-1980s. Includes Seiko, Citizen, and Timex. All working condition, some may need minor servicing. Great for collectors.",
    price_xmr: 0.4,
    category: "Collectibles",
    condition: "Used - Good",
    location: "Chicago, IL",
    status: "active"
  },
  {
    title: "Electric Guitar - Fender Stratocaster",
    description: "Classic Fender Stratocaster electric guitar in sunburst finish. Excellent playability, recently set up with new strings. Includes hard case and cable.",
    price_xmr: 1.1,
    category: "Musical Instruments",
    condition: "Used - Excellent",
    location: "Nashville, TN",
    status: "active"
  },
  {
    title: "Organic Honey - Raw & Unfiltered",
    description: "Pure organic honey from local beehives. Raw and unfiltered, retains all natural enzymes and nutrients. Perfect for health-conscious consumers. 1lb jar.",
    price_xmr: 0.03,
    category: "Food & Beverages",
    condition: "New",
    location: "Vermont",
    status: "active"
  },
  {
    title: "Yoga Mat & Accessories Set",
    description: "Premium yoga mat with alignment guides, yoga blocks, strap, and carrying bag. Non-slip surface, eco-friendly materials. Perfect for home practice.",
    price_xmr: 0.15,
    category: "Sports",
    condition: "New",
    location: "Boulder, CO",
    status: "active"
  },
  {
    title: "Antique Pocket Watch",
    description: "Beautiful antique pocket watch from the early 1900s. Gold-plated case, mechanical movement, still keeping accurate time. Comes with original chain.",
    price_xmr: 0.7,
    category: "Collectibles",
    condition: "Used - Good",
    location: "Boston, MA",
    status: "active"
  },
  {
    title: "Gaming Chair - Ergonomic Design",
    description: "High-quality gaming chair with lumbar support, adjustable armrests, and reclining function. Perfect for long gaming sessions or office work.",
    price_xmr: 0.35,
    category: "Furniture",
    condition: "Used - Like New",
    location: "Phoenix, AZ",
    status: "active"
  },
  {
    title: "Drone with 4K Camera",
    description: "Professional drone with 4K camera, 3-axis gimbal, and 30-minute flight time. Includes extra batteries, propellers, and carrying case. Perfect for aerial photography.",
    price_xmr: 0.95,
    category: "Electronics",
    condition: "Used - Excellent",
    location: "San Diego, CA",
    status: "active"
  },
  {
    title: "Handmade Ceramic Dinnerware Set",
    description: "Beautiful handmade ceramic dinnerware set for 4 people. Includes plates, bowls, and mugs. Dishwasher safe, unique glazed finish. Perfect for special occasions.",
    price_xmr: 0.2,
    category: "Home & Garden",
    condition: "New",
    location: "Santa Fe, NM",
    status: "active"
  },
  {
    title: "Cryptocurrency Hardware Wallet",
    description: "Secure hardware wallet for storing cryptocurrencies offline. Supports multiple currencies including Bitcoin, Ethereum, and Monero. Brand new, sealed package.",
    price_xmr: 0.12,
    category: "Electronics",
    condition: "New",
    location: "Silicon Valley, CA",
    status: "active"
  },
  {
    title: "Vintage Comic Book Collection",
    description: "Collection of vintage comic books from the 1980s and 1990s. Includes Marvel and DC titles. All in protective sleeves, excellent condition for collectors.",
    price_xmr: 0.45,
    category: "Collectibles",
    condition: "Used - Excellent",
    location: "New York, NY",
    status: "active"
  },
  {
    title: "Professional Espresso Machine",
    description: "Commercial-grade espresso machine perfect for home use. Dual boiler system, PID temperature control, and steam wand. Recently serviced and calibrated.",
    price_xmr: 2.1,
    category: "Appliances",
    condition: "Used - Good",
    location: "Portland, OR",
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