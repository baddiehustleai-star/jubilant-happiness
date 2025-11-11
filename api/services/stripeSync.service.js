// api/services/stripeSync.service.js
import Stripe from "stripe";
import { db } from "../lib/firebase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

/**
 * Sync all Stripe Products and Prices into Firestore
 */
export async function syncStripeProducts() {
  console.log("🔁 Syncing Stripe products and prices to Firestore...");

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️  STRIPE_SECRET_KEY not configured, skipping sync");
    return { success: false, message: "Stripe not configured" };
  }

  try {
    // Fetch products and prices from Stripe
    const [products, prices] = await Promise.all([
      stripe.products.list({ limit: 100, active: true }),
      stripe.prices.list({ limit: 100, active: true }),
    ]);

    console.log(`📦 Found ${products.data.length} products and ${prices.data.length} prices in Stripe`);

    // Use batch writes for efficiency
    const batch = db.batch();
    let syncedCount = 0;

    for (const product of products.data) {
      // Find all prices for this product
      const productPrices = prices.data.filter(p => p.product === product.id);
      
      const docRef = db.collection("stripe_products").doc(product.id);

      batch.set(docRef, {
        id: product.id,
        name: product.name,
        description: product.description || "",
        active: product.active,
        images: product.images || [],
        metadata: product.metadata || {},
        features: product.features || [],
        updatedAt: new Date().toISOString(),
        syncedAt: new Date().toISOString(),
        prices: productPrices.map(p => ({
          id: p.id,
          currency: p.currency,
          amount: p.unit_amount ? p.unit_amount / 100 : 0,
          recurring: p.recurring ? {
            interval: p.recurring.interval,
            intervalCount: p.recurring.interval_count,
          } : null,
          type: p.type, // 'one_time' or 'recurring'
          active: p.active,
        })),
      }, { merge: true });

      syncedCount++;
    }

    await batch.commit();
    console.log(`✅ Successfully synced ${syncedCount} products to Firestore`);

    return {
      success: true,
      message: `Synced ${syncedCount} products`,
      productsCount: syncedCount,
      pricesCount: prices.data.length,
    };
  } catch (err) {
    console.error("❌ Stripe sync failed:", err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * Get a specific Stripe product from Firestore (cached)
 */
export async function getStripeProduct(productId) {
  try {
    const doc = await db.collection("stripe_products").doc(productId).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (err) {
    console.error("Error fetching Stripe product:", err);
    return null;
  }
}

/**
 * Get all Stripe products from Firestore
 */
export async function getAllStripeProducts() {
  try {
    const snapshot = await db.collection("stripe_products")
      .where("active", "==", true)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching Stripe products:", err);
    return [];
  }
}
