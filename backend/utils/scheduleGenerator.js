/**
 * Intelligent Study Schedule Generator
 * Generates optimal study sessions based on exam date, difficulty, and availability
 */

/**
 * Difficulty multiplier for session distribution
 * Higher difficulty = more frequent sessions
 */
const DIFFICULTY_MULTIPLIERS = {
  1: 1.0, // Easy
  2: 1.2, // Medium-Easy
  3: 1.5, // Medium
  4: 1.8, // Hard
  5: 2.2, // Very Hard
};

/**
 * Generate spaced repetition intervals (exponential backoff)
 */
const generateSpacedIntervals = (daysUntilExam, sessionCount) => {
  const intervals = [];
  let remainingDays = Math.max(daysUntilExam - 1, 1);

  // Use exponential spacing: sessions get further apart as exam approaches
  for (let i = 0; i < sessionCount; i++) {
    const ratio = i / Math.max(sessionCount - 1, 1);
    // Exponential backoff: earlier sessions are more frequent
    const daysFromNow = Math.floor(
      remainingDays * Math.pow(1 - ratio, 2)
    );
    intervals.push(daysFromNow);
  }

  // Sort ascending (closest to exam first, then backward)
  return intervals.sort((a, b) => a - b);
};

/**
 * Calculate optimal session count and distribution
 */
const calculateSessionDistribution = (totalHours, difficulty, daysUntilExam, dailyAvailability) => {
  // Base session count: 1-2 hours per session
  const baseSessionCount = Math.ceil(totalHours / 1.5);

  // Adjust for difficulty
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.5;
  const adjustedSessionCount = Math.ceil(baseSessionCount * difficultyMultiplier);

  // Respect daily availability and time constraints
  const maxPossibleSessions = Math.floor((daysUntilExam * dailyAvailability) / 0.5);
  const minSessions = Math.max(2, Math.ceil(totalHours / Math.min(3, dailyAvailability)));

  // Final session count constrained by availability and exam date
  const sessionCount = Math.max(
    minSessions,
    Math.min(adjustedSessionCount, maxPossibleSessions)
  );

  // Calculate actual duration per session
  const avgDuration = Math.min(totalHours / sessionCount, Math.min(3, dailyAvailability));

  return {
    sessionCount,
    avgDuration,
    maxPossibleSessions,
  };
};

/**
 * Generate study sessions for a subject
 * @param {Object} subject - Subject document
 * @param {Object} options - Generation options
 * @returns {Array} Array of session objects
 */
export const generateStudySessions = (subject, options = {}) => {
  const {
    dailyAvailability = 3, // Default 3 hours per day
    sessionBuffer = 0.5, // Minimum 30 minutes between sessions
  } = options;

  const now = new Date();
  const examDate = new Date(subject.examDate);
  const daysUntilExam = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));

  if (daysUntilExam <= 0) {
    throw new Error('Exam date must be in the future');
  }

  // Calculate session distribution
  const { sessionCount, avgDuration } = calculateSessionDistribution(
    subject.totalHours,
    subject.difficulty,
    daysUntilExam,
    dailyAvailability
  );

  // Generate spaced intervals
  const intervals = generateSpacedIntervals(daysUntilExam, sessionCount);

  const sessions = [];
  const usedHours = new Map(); // Track daily usage

  for (let i = 0; i < sessionCount; i++) {
    // Calculate session date (working backwards from exam)
    const daysFromExam = intervals[i];
    const sessionDate = new Date(examDate.getTime()); // Proper date copy
    sessionDate.setDate(sessionDate.getDate() - daysFromExam);

    // Ensure session is not in the past
    if (sessionDate < now) {
      // Recalculate starting from tomorrow
      const tmrw = new Date(now);
      tmrw.setDate(now.getDate() + i + 1);
      sessionDate.setTime(tmrw.getTime());
    }

    // Ensure we don't exceed daily availability
    const dateKey = sessionDate.toISOString().split('T')[0];
    const currentDayUsage = usedHours.get(dateKey) || 0;

    if (currentDayUsage >= dailyAvailability) {
      // Push to next available day
      sessionDate.setDate(sessionDate.getDate() + 1);
    }

    // Determine session duration (last session might be shorter)
    const remainingHours = Math.max(0, subject.totalHours - sessions.reduce((sum, s) => sum + s.duration, 0));
    const sessionDuration = Math.min(avgDuration, remainingHours, dailyAvailability - (usedHours.get(dateKey) || 0));

    if (sessionDuration >= 0.5) {
      sessions.push({
        title: `${subject.name} - Study Session ${i + 1}`,
        date: sessionDate,
        duration: Math.round(sessionDuration * 10) / 10, // Round to 1 decimal
        status: 'scheduled',
        notes: i === sessionCount - 1 ? 'Final review session' : '', // Last session is final review
      });

      // Track hours used on this day
      usedHours.set(dateKey, (usedHours.get(dateKey) || 0) + sessionDuration);
    }
  }

  return sessions;
};

export default generateStudySessions;