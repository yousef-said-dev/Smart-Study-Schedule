/**
 * Schedule Routes
 */
import express from 'express';
import {
  generateSchedule,
  getSchedules,
  getSchedule,
  deleteSchedule,
  updateSessionStatus,
} from '../controllers/scheduleController.js';
import { validate, scheduleGenerateSchema } from '../middleware/validator.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/generate', validate(scheduleGenerateSchema), generateSchedule);
router.route('/')
  .get(getSchedules);

router.route('/:id')
  .get(getSchedule)
  .delete(deleteSchedule);

router.patch('/sessions/:id/status', updateSessionStatus);

export default router;