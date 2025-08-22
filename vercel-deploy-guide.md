# Vercel Deployment Guide

## Environment Variables Required

Make sure to set these environment variables in your Vercel dashboard:

### Required Variables:
1. `POSTGRES_URL` - Your PostgreSQL database connection string
2. `SESSION_SECRET` - A secure random string (at least 32 characters)
3. `NODE_ENV` - Set to `production`

### Optional Variables:
4. `MONERO_RPC_URL` - Monero node RPC URL (for future use)
5. `MONERO_RPC_USERNAME` - Monero RPC username
6. `MONERO_RPC_PASSWORD` - Monero RPC password

## Database Setup

The application will automatically create the required tables on first run in production.

### Required Tables:
- `users` - User accounts and authentication
- `listings` - Product listings

## Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy

## Troubleshooting

### 500 Internal Server Error
- Check that `POSTGRES_URL` is correctly set
- Ensure your database is accessible from Vercel
- Check Vercel function logs for detailed error messages

### Database Connection Issues
- Verify your PostgreSQL connection string format
- Ensure SSL is enabled if required by your database provider
- Check that your database allows connections from Vercel's IP ranges