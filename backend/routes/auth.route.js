import express from 'express'
import { signout} from '../controllers/auth.controller.js';

const router=express.Router();

router.post("/signout",signout);

export default router;