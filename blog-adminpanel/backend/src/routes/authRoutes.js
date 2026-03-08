import express from 'express';
import { login, signup, getMe } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);

router.get('/me', authMiddleware, getMe);

export default router;