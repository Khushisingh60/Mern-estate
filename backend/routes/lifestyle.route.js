import express from 'express';
import { getLifestyleMatches } from '../controllers/lifestyle.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Protected route - requires authentication
router.post('/match', verifyToken, getLifestyleMatches);

export default router;