-- =============================================
-- Photo2Profit Raw SQL Seed (Postgres / Prisma)
-- =============================================
-- Compatible with current schema in api/prisma/schema.prisma
-- Models referenced: User, Listing, MarketplaceAccount, ChannelListing, AuditEvent
-- NOTE: Prisma uses cuid() defaults; here we supply explicit string IDs.
-- Safe for local/dev. Do NOT use in production as-is.

-- Clean existing data (order matters due to FKs)
TRUNCATE TABLE "AuditEvent", "ChannelListing", "MarketplaceAccount", "Listing", "User" RESTART IDENTITY CASCADE;

-- Users (one demo user)
INSERT INTO "User" ("id", "email", "name", "createdAt", "updatedAt")
VALUES ('usr_seed_demo', 'seed+demo@photo2profit.com', 'Seed Demo User', NOW(), NOW());

-- Marketplace accounts (tied to user)
INSERT INTO "MarketplaceAccount" ("id", "userId", "platform", "accessToken", "refreshToken", "meta", "createdAt", "updatedAt") VALUES
('acct_seed_ebay', 'usr_seed_demo', 'ebay', 'demo-access', 'demo-refresh', '{"accountId":"ebay_demo_123"}', NOW(), NOW());

-- Listings (4 active, 1 archived)
INSERT INTO "Listing" ("id", "userId", "title", "description", "price", "imageUrl", "condition", "category", "sold", "status", "archivedAt", "createdAt", "updatedAt") VALUES
('lst_seed_001', 'usr_seed_demo', 'Vintage Camera Model X', 'Vintage Camera Model X — premium optics in working condition.', 129.99, 'https://picsum.photos/seed/lst_seed_001/600/600', 'good', 'Electronics', false, 'active', NULL, NOW(), NOW()),
('lst_seed_002', 'usr_seed_demo', 'Designer Handbag Rose Gold', 'Designer Handbag Rose Gold — elegant with minimal wear.', 249.99, 'https://picsum.photos/seed/lst_seed_002/600/600', 'like new', 'Fashion', false, 'active', NULL, NOW(), NOW()),
('lst_seed_003', 'usr_seed_demo', 'Limited Edition Sneakers', 'Limited Edition Sneakers — collectible drop.', 199.00, 'https://picsum.photos/seed/lst_seed_003/600/600', 'new', 'Fashion', false, 'active', NULL, NOW(), NOW()),
('lst_seed_004', 'usr_seed_demo', 'Bluetooth Headphones Pro', 'Bluetooth Headphones Pro — immersive sound.', 89.99, 'https://picsum.photos/seed/lst_seed_004/600/600', 'like new', 'Audio', false, 'active', NULL, NOW(), NOW()),
('lst_seed_005', 'usr_seed_demo', 'Antique Porcelain Vase', 'Antique Porcelain Vase — archived decorative item.', 59.00, 'https://picsum.photos/seed/lst_seed_005/600/600', 'fair', 'Home', false, 'archived', NOW(), NOW(), NOW());

-- ChannelListings (active listings get ebay + facebook; archived gets facebook archived)
INSERT INTO "ChannelListing" ("id", "listingId", "platform", "externalId", "status", "createdAt", "updatedAt") VALUES
('chn_seed_001e', 'lst_seed_001', 'ebay', 'ebay_lst_seed_001', 'active', NOW(), NOW()),
('chn_seed_001f', 'lst_seed_001', 'facebook', 'fb_lst_seed_001', 'active', NOW(), NOW()),
('chn_seed_002e', 'lst_seed_002', 'ebay', 'ebay_lst_seed_002', 'active', NOW(), NOW()),
('chn_seed_002f', 'lst_seed_002', 'facebook', 'fb_lst_seed_002', 'active', NOW(), NOW()),
('chn_seed_003e', 'lst_seed_003', 'ebay', 'ebay_lst_seed_003', 'active', NOW(), NOW()),
('chn_seed_003f', 'lst_seed_003', 'facebook', 'fb_lst_seed_003', 'active', NOW(), NOW()),
('chn_seed_004e', 'lst_seed_004', 'ebay', 'ebay_lst_seed_004', 'active', NOW(), NOW()),
('chn_seed_004f', 'lst_seed_004', 'facebook', 'fb_lst_seed_004', 'active', NOW(), NOW()),
('chn_seed_005f', 'lst_seed_005', 'facebook', 'fb_lst_seed_005', 'archived', NOW(), NOW());

-- AuditEvents (publish + price_change + delist)
INSERT INTO "AuditEvent" ("id", "listingId", "platform", "type", "detail", "payload", "createdAt") VALUES
( 'evt_seed_pub_001', 'lst_seed_001', 'ebay', 'publish', 'Listing published to eBay', '{"price":129.99,"title":"Vintage Camera Model X"}', NOW() - INTERVAL '6 hours'),
( 'evt_seed_price_001', 'lst_seed_001', 'facebook', 'price_change', 'Price reduced from 139.99 to 129.99', '{"oldPrice":139.99,"newPrice":129.99}', NOW() - INTERVAL '3 hours'),
( 'evt_seed_pub_002', 'lst_seed_002', 'ebay', 'publish', 'Listing published to eBay', '{"price":249.99,"title":"Designer Handbag Rose Gold"}', NOW() - INTERVAL '5 hours'),
( 'evt_seed_pub_003', 'lst_seed_003', 'ebay', 'publish', 'Listing published to eBay', '{"price":199.00,"title":"Limited Edition Sneakers"}', NOW() - INTERVAL '4 hours'),
( 'evt_seed_pub_004', 'lst_seed_004', 'facebook', 'publish', 'Listing published to Facebook', '{"price":89.99,"title":"Bluetooth Headphones Pro"}', NOW() - INTERVAL '2 hours'),
( 'evt_seed_delist_005', 'lst_seed_005', 'facebook', 'delist', 'Listing archived (soft delete)', '{"reason":"archived"}', NOW() - INTERVAL '1 hour');

-- Confirmation
SELECT '✅ Seed data inserted successfully' AS result;
