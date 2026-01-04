/**
 * User Model
 * Stores user credentials and preferences
 */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    preferences: {
      studyHoursPerDay: {
        type: Number,
        default: 4,
      },
      preferredStudyTime: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'night'],
        default: 'morning',
      },
      notificationSettings: {
        studyReminders: { type: Boolean, default: true },
        focusReminders: { type: Boolean, default: true },
      }
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true
  }
);

// Removed password hashing as per requirements

/**
 * Compare password method (Direct comparison as per "no hashing" requirement)
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return candidatePassword === this.password;
};

/**
 * Safe toJSON method to remove sensitive fields
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;