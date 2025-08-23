# Cipher Market Project Plan

## 1. Project Overview

This document outlines the development plan for **Cipher Market**, a secure, privacy-first online marketplace using Monero (XMR). The platform is built with a focus on user anonymity and data security, featuring a modern React-based frontend with server-side rendering and secure session management.

**Current Status:** The marketplace has core functionality implemented including user authentication, listing management, and a marketplace interface.

## 2. Technology Stack

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (Dark Mode by default)
-   **Database:** SQLite
-   **Authentication:** NextAuth and custom session-based authentication
-   **UI Components:** Custom React components with modern design patterns

## 3. Development Milestones

### ✅ Milestone 1: Core Foundation & Privacy Features
- **[✅] Initial Project Setup**
- **[✅] User Registration (UI & Server Action)**
- **[✅] Secure User Login & Session Management**
- **[✅] Dark Mode Default Theme**
- **[✅] Responsive Design Implementation**
- **[ ] Two-Factor Authentication (2FA) via TOTP**
- **[ ] PGP-Only Communication Option for Sellers**
- **[ ] Self-Destruct Messaging System**

### 🚧 Milestone 2: Listings & Seller Features
- **[✅] Product Listing Management (CRUD)**
- **[✅] Marketplace Homepage with Featured Listings**
- **[ ] Time-Locked Listings (Scheduled visibility)**
- **[ ] Hidden Listings (Accessible by direct link only)**
- **[ ] Seller Verification Toggle**

### 📋 Milestone 3: Orders, Payments & Escrow
- **[ ] Monero Wallet Integration**
- **[ ] Order Placement System**
- **[ ] Payment Verification**
- **[ ] Escrow System Implementation**
- **[ ] Dispute Resolution System**

## 4. Current Features

### ✅ Implemented Features
- **User Authentication**: Registration and login system with NextAuth and secure session management
- **Marketplace Interface**: Modern design with dark mode
- **Listing Management**: Basic operations for product listings

### 🔄 In Development
- **Payment Integration**: Monero wallet connectivity
- **Enhanced Security**: 2FA implementation
- **Messaging System**: Secure communication between buyers and sellers

## 5. Technical Architecture

### Database Schema
- **Users Table**: User authentication and profile data
- **Listings Table**: Product information with XMR pricing
- **Wallet Addresses**: Monero wallet addresses for transactions
- **Transactions**: Payment records and verification data

### Security Features
- **NextAuth Integration**: Secure authentication with JWT
- **Input Validation**: Form validation with Zod
- **Route Protection**: Middleware-based access control
- **Two-Factor Authentication**: TOTP implementation (planned)

## 6. Next Steps

1. **Complete 2FA Implementation**: Enhance security with TOTP authentication
2. **Monero Wallet Integration**: Connect to Monero RPC for transactions
3. **Messaging System**: Implement secure buyer-seller communication
4. **Escrow System**: Develop secure payment holding mechanism
5. **UI Refinement**: Polish user interface and experience

