/**
 * Stripe Products Routes
 * API endpoints for fetching Stripe products from Firestore cache
 */

import express from "express";
import { db } from "../lib/firebase.js";

const router = express.Router();

/**
 * GET /api/stripe-products
 * Fetches all active Stripe products from Firestore cache
 */
router.get("/stripe-products", async (req, res) => {
  try {
    const snapshot = await db
      .collection("stripe_products")
      .where("active", "==", true)
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Fetched ${products.length} active Stripe products`);
    res.json(products);
  } catch (err) {
    console.error("❌ Error loading Stripe products:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
