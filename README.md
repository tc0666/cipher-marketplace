# Cipher Market - Monero Marketplace

A secure, privacy-first online marketplace using Monero (XMR) built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Privacy First**: End-to-end encryption and minimal data tracking
- 💰 **Monero Payments**: Secure, private transactions using XMR
- 🛡️ **Secure Escrow**: Trust-minimized multisig escrow system
- 🔒 **Two-Factor Authentication**: TOTP-based 2FA for enhanced security
- 💬 **PGP Messaging**: Encrypted communication between users
- ⏰ **Self-Destruct Messages**: Time-limited encrypted communications
- 🌙 **Dark Mode**: Built-in dark theme for better privacy

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon for production)
- **Authentication**: Iron Session with bcrypt
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or Neon)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd monero-marketplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment template and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database Configuration
POSTGRES_URL=postgresql://username:password@localhost:5432/cipher_market

# Session Configuration (generate a strong random string)
SESSION_SECRET=your_very_long_random_secret_key_at_least_32_characters_long

# Environment
NODE_ENV=development
```

**Important**: Generate a strong random string for `SESSION_SECRET` (at least 32 characters).

### 4. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb cipher_market`
3. Update your `.env.local` with local connection details

#### Option B: Neon Database (Recommended for Production)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `.env.local`

#### Run Database Schema

Execute the SQL commands from `schema.sql` in your database:

```bash
# If using psql locally
psql -d cipher_market -f schema.sql

# Or copy and paste the contents into your database dashboard
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page and actions
│   │   └── register/      # Registration page and actions
│   ├── dashboard/         # User dashboard (protected)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Utility libraries
│   └── db.ts             # Database connection
└── middleware.ts          # Route protection middleware
```

## Development Milestones

### ✅ Milestone 1: Core Foundation & Privacy Features
- [x] Initial Project Setup
- [x] User Registration (UI & Server Action)
- [x] Secure User Login & Session Management
- [ ] Two-Factor Authentication (2FA) via TOTP
- [ ] Dark Mode Default Theme
- [ ] PGP-Only Communication Option for Sellers
- [ ] Self-Destruct Messaging System (UI & Logic)
- [ ] Foundation for Multi-Language Support

### 🔄 Milestone 2: Listings & Seller Features
- [ ] Product Listing Management (CRUD)
- [ ] Time-Locked Listings (Scheduled visibility)
- [ ] Hidden Listings (Accessible by direct link only)
- [ ] Seller Verification Toggle (Admin Controlled)
- [ ] Implement Disclaimer for Illegal Items on Listing Creation

### ⏳ Milestone 3: Orders, Payments & Escrow
- [ ] Monero Payment Gateway Integration
- [ ] 2-of-3 Multisignature Escrow System
- [ ] Order Placement Flow with Manual Shipping Fields
- [ ] Encrypted Order Tracking (for both registered and guest users)
- [ ] Escrow Release Mechanism (Buyer confirmation)

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Iron Session with secure cookies
- **Route Protection**: Middleware-based authentication
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

Cipher Market is intended for sensitive but **legal** privacy-focused items only. The platform explicitly prohibits the listing of illegal goods, including but not limited to drugs, weapons, and stolen property.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

