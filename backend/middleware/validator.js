/**
 * Validation middleware using Joi
 * Schemas and validation wrapper for all routes
 */
import Joi from 'joi';

// Custom validation messages
const customMessages = {
  'string.base': '{#label} must be a string',
  'string.empty': '{#label} cannot be empty',
  'string.min': '{#label} must be at least {#limit} characters',
  'string.max': '{#label} cannot exceed {#limit} characters',
  'number.base': '{#label} must be a number',
  'number.min': '{#label} must be at least {#limit}',
  'number.max': '{#label} cannot exceed {#limit}',
  'any.required': '{#label} is required',
  'date.base': '{#label} must be a valid date',
};

// Auth validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages(customMessages),
  email: Joi.string().email().trim().lowercase().required().messages(customMessages),
  password: Joi.string().min(6).max(100).required().messages(customMessages),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages(customMessages),
  password: Joi.string().min(6).required().messages(customMessages),
});

// Subject validation schema
export const subjectSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages(customMessages),
  description: Joi.string().trim().max(500).allow('').optional().messages(customMessages),
  difficulty: Joi.number().min(1).max(5).required().messages(customMessages),
  totalHours: Joi.number().min(0.5).max(1000).required().messages(customMessages),
  examDate: Joi.date().greater('now').required().messages({
    ...customMessages,
    'date.greater': 'Exam date must be in the future',
  }),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional().messages({
    ...customMessages,
    'string.pattern.base': 'Color must be a valid hex code (e.g. #FF0000)',
  }),
});

// Schedule generation validation
export const scheduleGenerateSchema = Joi.object({
  subjectId: Joi.string().hex().length(24).optional().messages({
    ...customMessages,
    'string.base': 'Subject ID must be a valid ObjectId',
  }),
  dailyAvailability: Joi.number().min(0).max(24).optional().messages({
    ...customMessages,
    'number.base': 'Daily availability must be a number of hours',
  }),
});

// Validation middleware wrapper
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Get all errors, not just the first
      allowUnknown: false, // Don't allow unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors,
      });
    }

    next();
  };
};