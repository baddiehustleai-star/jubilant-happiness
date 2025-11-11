/*
  Prisma seed script for Photo2Profit

  Populates:
  - User (1 demo user)
  - Listings (5 listings: 4 active, 1 archived)
  - MarketplaceAccount (ebay)
  - ChannelListing (per listing, across ebay/facebook)
  - AuditEvent (publish, price_change, delist)

  Usage:
    1) Ensure DATABASE_URL is set and the schema is applied:
       npx prisma db push
    2) Run the seed:
       npx prisma db seed

  Notes:
  - Uses only standard libs (no faker) to avoid extra deps.
  - Decimal prices are provided as strings to satisfy Prisma Decimal.
*/

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(arr) {
  return arr[randInt(0, arr.length - 1)];
}

async function main() {
  console.log('🌱 Seeding Photo2Profit demo data...');

  // 1) Upsert a demo user
  const userEmail = 'seed+demo@photo2profit.com';
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: 'Seed Demo User',
    },
  });
  console.log('👤 User:', user.email);

  // 2) Create a marketplace account (eBay)
  await prisma.marketplaceAccount.upsert({
    where: { userId_platform: { userId: user.id, platform: 'ebay' } },
    update: {},
    create: {
      userId: user.id,
      platform: 'ebay',
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
      meta: { accountId: 'ebay_demo_123' },
    },
  });
  console.log('🔐 MarketplaceAccount (ebay) created');

  // 3) Create listings
  const titles = [
    'Vintage Camera Model X',
    'Designer Handbag Rose Gold',
    'Limited Edition Sneakers',
    'Bluetooth Headphones Pro',
    'Antique Porcelain Vase',
  ];
  const categories = ['Electronics', 'Fashion', 'Collectibles', 'Audio', 'Home'];
  const conditions = ['new', 'like new', 'good', 'fair'];

  const listings = [];
  for (let i = 0; i < titles.length; i++) {
    const archived = i === titles.length - 1; // last one archived
    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        title: titles[i],
        description: `${titles[i]} — premium quality with luxe styling.`,
        price: String(randInt(20, 250) + 0.99),
        imageUrl: `https://picsum.photos/seed/p2p-${i}/600/600`,
        condition: sample(conditions),
        category: categories[i % categories.length],
        sold: false,
        status: archived ? 'archived' : 'active',
        archivedAt: archived ? new Date() : null,
      },
    });
    listings.push(listing);
  }
  console.log(`🧾 Listings created: ${listings.length}`);

  // 4) Create channel listings per listing (ebay + facebook for actives)
  const channelListings = [];
  for (const l of listings) {
    if (l.status === 'archived') {
      // archived: single "facebook" record with inactive status
      const cl = await prisma.channelListing.create({
        data: {
          listingId: l.id,
          platform: 'facebook',
          externalId: `fb_${l.id.slice(0, 6)}`,
          status: 'archived',
        },
      });
      channelListings.push(cl);
      continue;
    }

    // Active: create two channels
    const ebay = await prisma.channelListing.create({
      data: {
        listingId: l.id,
        platform: 'ebay',
        externalId: `ebay_${l.id.slice(0, 6)}`,
        status: 'active',
      },
    });
    const fb = await prisma.channelListing.create({
      data: {
        listingId: l.id,
        platform: 'facebook',
        externalId: `fb_${l.id.slice(0, 6)}`,
        status: 'active',
      },
    });
    channelListings.push(ebay, fb);
  }
  console.log(`🔗 ChannelListings created: ${channelListings.length}`);

  // 5) Seed audit events
  const eventsToCreate = [];
  for (const l of listings) {
    // publish event per active listing
    if (l.status === 'active') {
      eventsToCreate.push({
        listingId: l.id,
        platform: 'ebay',
        type: 'publish',
        detail: 'Listing published to eBay',
        payload: { price: l.price, title: l.title },
      });
      // occasional price change
      if (Math.random() > 0.5) {
        const newPrice = String(Number(l.price) - 5);
        eventsToCreate.push({
          listingId: l.id,
          platform: 'facebook',
          type: 'price_change',
          detail: `Price updated from ${l.price} to ${newPrice}`,
          payload: { oldPrice: l.price, newPrice },
        });
      }
    } else {
      // archived listings get a delist event
      eventsToCreate.push({
        listingId: l.id,
        platform: 'facebook',
        type: 'delist',
        detail: 'Listing archived and delisted',
        payload: { reason: 'archived' },
      });
    }
  }

  for (const e of eventsToCreate) {
    await prisma.auditEvent.create({ data: e });
  }
  console.log(`🧾 AuditEvents created: ${eventsToCreate.length}`);

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
