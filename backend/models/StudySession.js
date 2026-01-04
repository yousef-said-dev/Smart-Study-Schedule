/**
 * StudySession Model
 * Individual study sessions that make up a schedule
 */
import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: false,
      index: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    focusLevel: {
      type: Number,
    },
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Session date is required'],
      index: true,
    },
    duration: {
      type: Number,
      required: [true, 'Session duration is required'],
      min: [0.5, 'Minimum session duration is 0.5 hours'],
      max: [12, 'Maximum session duration is 12 hours'],
    },
    status: {
      type: String,
      enum: {
        values: ['scheduled', 'completed', 'skipped'],
        message: 'Status must be scheduled, completed, or skipped',
      },
      default: 'scheduled',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Optimized indexes for common queries
studySessionSchema.index({ userId: 1, date: 1 });
studySessionSchema.index({ userId: 1, status: 1 });

const StudySession = mongoose.model('StudySession', studySessionSchema);

export default StudySession;