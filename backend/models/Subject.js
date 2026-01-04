/**
 * Subject Model
 * Stores learning subjects for each user
 */
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [100, 'Subject name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    difficulty: {
      type: Number,
      required: [true, 'Difficulty is required'],
      min: [1, 'Difficulty must be between 1 and 5'],
      max: [5, 'Difficulty must be between 1 and 5'],
    },
    totalHours: {
      type: Number,
      required: [true, 'Total study hours is required'],
      min: [0.5, 'Minimum study time is 0.5 hours'],
      max: [1000, 'Maximum study time is 1000 hours'],
    },
    examDate: {
      type: Date,
      required: [true, 'Exam date is required'],
      index: true,
    },
    color: {
      type: String,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Please enter a valid hex color'],
      default: '#3B82F6',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user-specific queries
subjectSchema.index({ userId: 1, examDate: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;