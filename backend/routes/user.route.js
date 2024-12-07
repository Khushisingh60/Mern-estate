//In routes we create api routes because if we'll do it in index.js file then file become too long and unmanageable
import express from 'express';
import { test } from '../controllers/user.controller.js';

const router=express.Router();

router.get('/test',test);

export default router;

