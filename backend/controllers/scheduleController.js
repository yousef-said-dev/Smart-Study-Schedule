/**
 * Schedule Controller
 * Handles schedule generation and management
 */
import Schedule from '../models/Schedule.js';
import StudySession from '../models/StudySession.js';
import Task from '../models/Task.js';
import FocusLog from '../models/FocusLog.js';
import User from '../models/User.js';
import { generateAdaptiveSchedule } from '../utils/intelligentScheduler.js';

/**
 * @desc    Generate a smart study schedule
 * @route   POST /api/schedules/generate
 * @access  Private
 */
export const generateSchedule = async (req, res, next) => {
  try {
    // 1. Fetch user data (tasks, focus logs, preferences)
    const tasks = await Task.find({ userId: req.user._id, completed: false });
    const focusLogs = await FocusLog.find({ userId: req.user._id });
    const user = await User.findById(req.user._id);

    if (tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No tasks found. Please create tasks before generating a schedule.',
      });
    }

    // 2. Run adaptive logic
    const sessionData = generateAdaptiveSchedule(tasks, focusLogs, user.preferences || {});

    if (sessionData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Unable to generate schedule. Check your preferences and task durations.',
      });
    }

    // 3. Create schedule record
    const schedule = await Schedule.create({
      userId: req.user._id,
      title: `Generated Schedule - ${new Date().toLocaleDateString()}`,
      totalHours: sessionData.reduce((sum, s) => sum + s.duration, 0),
      examDate: new Date(), // placeholder or derived from tasks
      generatedDate: new Date(),
    });

    // 4. Create study sessions
    const sessions = await StudySession.insertMany(
      sessionData.map((session) => ({
        userId: req.user._id,
        scheduleId: schedule._id,
        taskId: session.taskId,
        title: session.title,
        date: session.date,
        duration: session.duration,
        focusLevel: session.focusLevel,
        status: 'scheduled',
        notes: `Focus Level: ${Math.round(session.focusLevel * 10) / 10}`,
      }))
    );

    res.status(201).json({
      success: true,
      message: 'Schedule generated successfully',
      data: {
        schedule,
        sessions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all schedules for user
 * @route   GET /api/schedules
 * @access  Private
 */
export const getSchedules = async (req, res, next) => {
  try {
    const schedules = await Schedule.find({ userId: req.user._id })
      .sort({ generatedDate: -1 })
      .lean();

    const schedulesWithCounts = await Promise.all(
      schedules.map(async (schedule) => {
        const sessionCount = await StudySession.countDocuments({
          scheduleId: schedule._id,
        });
        return { ...schedule, sessionCount };
      })
    );

    res.status(200).json({
      success: true,
      data: { schedules: schedulesWithCounts },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get schedule with all sessions
 * @route   GET /api/schedules/:id
 * @access  Private
 */
export const getSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).lean();

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    const sessions = await StudySession.find({ scheduleId: schedule._id })
      .sort({ date: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        schedule,
        sessions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete schedule and its sessions
 * @route   DELETE /api/schedules/:id
 * @access  Private
 */
export const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    await StudySession.deleteMany({ scheduleId: schedule._id });
    await Schedule.findByIdAndDelete(schedule._id);

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update session status
 * @route   PATCH /api/schedules/sessions/:id/status
 * @access  Private
 */
export const updateSessionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const session = await StudySession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

export default {
  generateSchedule,
  getSchedules,
  getSchedule,
  deleteSchedule,
  updateSessionStatus,
};