import { Router } from 'express';
import { createOrder, verifyPayment , recordPayment} from '../Controller/payment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = Router();

// Payment Routes
router.post('/create-order', verifyToken, createOrder);
router.post('/verify', verifyToken, verifyPayment);
router.post('/record',recordPayment);

export default router;
