/**
 * Subject Controller
 * CRUD operations for study subjects
 */
import Subject from '../models/Subject.js';
import Schedule from '../models/Schedule.js';
import StudySession from '../models/StudySession.js';

/**
 * @desc    Create a new subject
 * @route   POST /api/subjects
 * @access  Private
 */
export const createSubject = async (req, res, next) => {
  try {
    const { name, description, difficulty, totalHours, examDate, color } = req.body;

    const subject = await Subject.create({
      userId: req.user._id,
      name,
      description,
      difficulty,
      totalHours,
      examDate,
      color,
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: { subject },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all subjects for logged-in user
 * @route   GET /api/subjects
 * @access  Private
 */
export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id })
      .sort({ examDate: 1 }) // Sort by exam date ascending
      .lean(); // Return plain JS objects for performance

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: { subjects },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single subject by ID
 * @route   GET /api/subjects/:id
 * @access  Private
 */
export const getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { subject },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update subject
 * @route   PUT /api/subjects/:id
 * @access  Private
 */
export const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: { subject },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete subject
 * @route   DELETE /api/subjects/:id
 * @access  Private
 */
export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};