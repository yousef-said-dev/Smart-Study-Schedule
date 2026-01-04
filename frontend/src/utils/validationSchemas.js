import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const subjectSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Subject name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .required('Subject name is required'),
  description: Yup.string()
    .max(500, 'Description cannot exceed 500 characters'),
  difficulty: Yup.number()
    .min(1, 'Difficulty must be between 1-5')
    .max(5, 'Difficulty must be between 1-5')
    .required('Difficulty is required'),
  totalHours: Yup.number()
    .min(0.5, 'Minimum 0.5 hours')
    .max(1000, 'Maximum 1000 hours')
    .required('Total hours is required'),
  examDate: Yup.date()
    .min(new Date(), 'Exam date must be in the future')
    .required('Exam date is required'),
  color: Yup.string()
    .matches(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
});

export const scheduleGenerateSchema = Yup.object({
  dailyAvailability: Yup.number()
    .min(0, 'Cannot be negative')
    .max(24, 'Cannot exceed 24 hours')
    .required('Daily availability is required'),
});