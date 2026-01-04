import mongoose from 'mongoose';

const focusLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        focusScore: {
            type: Number,
            required: [true, 'Focus score is required'],
            min: 1,
            max: 5,
        },
        timeOfDay: {
            type: Number, // Hour 0-23
            required: [true, 'Time of day is required'],
            min: 0,
            max: 23,
        },
        notes: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const FocusLog = mongoose.model('FocusLog', focusLogSchema);

export default FocusLog;
