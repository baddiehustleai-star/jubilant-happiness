import express from 'express';
import auth from '../middleware/auth.js';
import { listAuditEvents } from '../controllers/auditEvents.prisma.controller.js';

const router = express.Router();

router.get('/', auth, listAuditEvents);

export default router;
