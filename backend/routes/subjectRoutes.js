/**
 * Subject Routes
 */
import express from 'express';
import {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController.js';
import { validate, subjectSchema } from '../middleware/validator.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(validate(subjectSchema), createSubject)
  .get(getSubjects);

router.route('/:id')
  .get(getSubject)
  .put(validate(subjectSchema), updateSubject)
  .delete(deleteSubject);

export default router;