# User Dashboard Setup

This document explains how to use the new user dashboard feature that displays payment status.

## Features

- **User API Endpoint**: `/api/users?email={email}` to fetch user data
- **Dashboard UI**: Clean interface showing email and payment status
- **Visual Indicators**: 
  - ✅ Green checkmark for paid members
  - ❌ Red X for free users with upgrade CTA

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

The project uses Prisma with SQLite. Initialize the database:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed test data
node prisma/seed.js
```

This creates two test users:
- `paid@example.com` (paid: true)
- `free@example.com` (paid: false)

### 3. Run Development Servers

**Option A: Frontend Only**
```bash
npm run dev
```
Visit http://localhost:5173

**Option B: With Backend API (for testing)**
```bash
# Terminal 1 - Backend API
node dev-server.js

# Terminal 2 - Frontend
npm run dev
```

### 4. Test the Dashboard

1. Open http://localhost:5173
2. Click "View Dashboard (Paid User)" or "View Dashboard (Free User)"
3. The dashboard will fetch user data from the API and display payment status

## API Endpoint

### GET `/api/users?email={email}`

Fetch user data by email.

**Query Parameters:**
- `email` (required): User email address

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "paid@example.com",
  "paid": true,
  "createdAt": "2025-11-10T07:28:45.676Z",
  "updatedAt": "2025-11-10T07:28:45.676Z"
}
```

**Error Responses:**
- `400`: Missing email parameter
- `404`: User not found
- `500`: Server error

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  paid      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Deployment

For production deployment (Vercel/Netlify):

1. Set up your database (PostgreSQL recommended for production)
2. Update `DATABASE_URL` in environment variables
3. Deploy the `/api/users.js` serverless function
4. Deploy the frontend with `npm run build`

## Environment Variables

Required for production:

```env
DATABASE_URL="your-database-connection-string"
VITE_API_URL="https://your-api-domain.com"
```

## Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build
npm run build
```
