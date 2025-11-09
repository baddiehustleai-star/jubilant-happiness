import express from 'express';
import auth from '../middleware/auth.js';
import { saveEbayAuth } from '../controllers/integrations.prisma.controller.js';

const router = express.Router();

router.post('/ebay/auth', auth, saveEbayAuth);

export default router;
