/**
 * Authentication Routes
 */
import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updatePreferences,
} from '../controllers/authController.js';
import { validate, registerSchema, loginSchema } from '../middleware/validator.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/preferences', protect, updatePreferences);

export default router;