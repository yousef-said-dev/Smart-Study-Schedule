import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        taskType: {
            type: String,
            enum: ['Light', 'Medium', 'Heavy', 'Review'],
            required: true,
        },
        duration: {
            type: Number,
            required: [true, 'Estimated duration is required'],
            min: [0.1, 'Duration must be at least 0.1 hours'],
        },
        deadline: {
            type: Date,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
