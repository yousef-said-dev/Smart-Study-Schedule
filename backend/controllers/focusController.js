import FocusLog from '../models/FocusLog.js';

// Get all focus logs for user
export const getFocusLogs = async (req, res) => {
    try {
        const logs = await FocusLog.find({ userId: req.user._id }).sort({ date: -1 });
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Log focus level
export const logFocus = async (req, res) => {
    try {
        const { focusScore, timeOfDay, notes } = req.body;
        const log = await FocusLog.create({
            userId: req.user._id,
            focusScore,
            timeOfDay,
            notes
        });
        res.status(201).json({ success: true, data: log });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get focus analysis/stats
export const getFocusStats = async (req, res) => {
    try {
        const stats = await FocusLog.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: '$timeOfDay',
                    averageFocus: { $avg: '$focusScore' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
