import express from 'express';
import { getFocusLogs, logFocus, getFocusStats } from '../controllers/focusController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Protect all focus routes

router.route('/')
    .get(getFocusLogs)
    .post(logFocus);

router.get('/stats', getFocusStats);

export default router;
