import express from 'express';
import auth from '../middleware/auth.js';
import {
  generateListingAI,
  createListing,
  getListings,
  getListing,
  publishListing,
  archiveListing,
} from '../controllers/listings.prisma.controller.js';

const router = express.Router();

router.post('/generate', auth, generateListingAI);
router.post('/', auth, createListing);
router.get('/', auth, getListings);
router.get('/:id', auth, getListing);
router.post('/:id/publish', auth, publishListing);
router.patch('/:id/archive', auth, archiveListing);

export default router;
