/* eslint-env node */
/* eslint-disable no-undef */
import express from 'express';
import { getUser } from '../controllers/users.prisma.controller.js';

const router = express.Router();
router.get('/users', getUser);

export default router;
