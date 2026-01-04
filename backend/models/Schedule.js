/**
 * Schedule Model
 * Container for generated study schedules
 */
import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Schedule title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    generatedDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    totalHours: {
      type: Number,
      required: true,
      min: 0,
    },
    examDate: {
      type: Date,
      required: true,
    },
    subjectIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    }],
    status: {
      type: String,
      enum: {
        values: ['active', 'completed', 'archived'],
        message: 'Status must be active, completed, or archived',
      },
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

scheduleSchema.index({ userId: 1, status: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;