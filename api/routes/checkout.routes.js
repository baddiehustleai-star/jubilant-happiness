/* eslint-env node */
// Checkout and billing portal routes
import express from 'express';
import {
  createCheckoutSession,
  createBillingPortalSession,
  handleWebhook,
} from '../controllers/checkout.controller.js';

const router = express.Router();

router.post('/checkout', createCheckoutSession);
router.post('/billing-portal', createBillingPortalSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
