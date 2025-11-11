import express from 'express';
import {
  ebayWebhook,
  facebookWebhook,
  poshmarkWebhook,
} from '../controllers/webhooks.controller.js';
import { verifySignature } from '../middleware/signature.js';

const router = express.Router();

// In production add signature verification middleware per platform
router.post('/ebay', verifySignature, ebayWebhook);
router.post('/facebook', verifySignature, facebookWebhook);
router.post('/poshmark', verifySignature, poshmarkWebhook);

export default router;
