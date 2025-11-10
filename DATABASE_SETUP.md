# Database Setup Guide

This guide explains how to set up the database for the Photo2Profit application.

## Prerequisites

- PostgreSQL database (local or cloud-hosted)
- Node.js and npm installed
- Access to your database connection string

## Quick Start

### 1. Set up your database connection

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/photo2profit"
```

**Example connection strings:**

- **Local PostgreSQL:**
  ```
  DATABASE_URL="postgresql://postgres:password@localhost:5432/photo2profit"
  ```

- **Heroku Postgres:**
  ```
  DATABASE_URL="postgresql://user:pass@host.compute.amazonaws.com:5432/dbname"
  ```

- **Supabase:**
  ```
  DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
  ```

- **Railway:**
  ```
  DATABASE_URL="postgresql://postgres:[password]@containers-us-west-xxx.railway.app:5432/railway"
  ```

### 2. Install dependencies

```bash
npm install
```

### 3. Run database migrations

This will create the necessary tables in your database:

```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. (Optional) Seed the database

Create some test users:

```bash
npx prisma db seed
```

Or manually add users using Prisma Studio:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can add/edit users.

## Database Schema

The application uses the following User model:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  paid      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Testing the API

Once set up, you can test the API:

```bash
# Start the dev server
npm run dev

# In another terminal, test the endpoint
curl "http://localhost:5173/api/users?email=test@example.com"
```

## Production Deployment

### Environment Variables

Set these in your hosting platform (Vercel, Netlify, etc.):

```env
DATABASE_URL=postgresql://...
VITE_API_URL=https://your-domain.com
VITE_STRIPE_PRICE_ID=price_xxxxx
STRIPE_SECRET_KEY=sk_xxxxx
```

### Prisma in Production

For serverless deployments, you may need to:

1. **Use connection pooling** (recommended for serverless):
   ```env
   DATABASE_URL="postgresql://..."
   PRISMA_ACCELERATE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
   ```

2. **Generate Prisma Client** in your build step:
   ```json
   {
     "scripts": {
       "build": "prisma generate && vite build"
     }
   }
   ```

## Troubleshooting

### "Can't reach database server"

- Check your connection string is correct
- Ensure your database server is running
- Check firewall rules allow connections

### "Table doesn't exist"

Run migrations:
```bash
npx prisma migrate deploy
```

### "Module not found: @prisma/client"

Generate the client:
```bash
npx prisma generate
```

## Stripe Webhook Integration

To automatically update the `paid` status when users complete checkout, set up a Stripe webhook:

1. Create a webhook endpoint in Stripe Dashboard
2. Point it to: `https://your-domain.com/api/stripe-webhook`
3. Subscribe to: `checkout.session.completed`
4. Update the user's `paid` status in your webhook handler

Example webhook handler (create as `api/stripe-webhook.js`):

```javascript
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email;

    await prisma.user.update({
      where: { email },
      data: { paid: true },
    });
  }

  res.json({ received: true });
}
```

## Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
