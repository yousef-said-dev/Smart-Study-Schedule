import moment from 'moment';

/**
 * Intelligent Scheduler Logic
 * Matches tasks to focus levels and time of day
 */

// Mapping of task types to focus requirement scores
const FOCUS_REQUIREMENTS = {
    'Heavy': 5,
    'Medium': 3,
    'Light': 2,
    'Review': 1
};

/**
 * Higher weight for more recent focus logs
 */
const getWeightedFocusAverages = (focusLogs) => {
    const hourlyFocus = Array(24).fill(0).map(() => ({ total: 0, count: 0 }));

    focusLogs.forEach(log => {
        const hour = log.timeOfDay;
        // Simple average for now, could be weighted by date recency
        hourlyFocus[hour].total += log.focusScore;
        hourlyFocus[hour].count += 1;
    });

    return hourlyFocus.map(h => (h.count === 0 ? 3 : h.total / h.count)); // Default to 3 if no data
};

/**
 * Generate a schedule for the upcoming days
 */
export const generateAdaptiveSchedule = (tasks, focusLogs, preferences) => {
    const { studyHoursPerDay = 4, preferredStudyTime = 'morning' } = preferences;
    const focusAverages = getWeightedFocusAverages(focusLogs);

    // Sort tasks: Heavy first, then by deadline
    const sortedTasks = [...tasks].sort((a, b) => {
        const typeDiff = FOCUS_REQUIREMENTS[b.taskType] - FOCUS_REQUIREMENTS[a.taskType];
        if (typeDiff !== 0) return typeDiff;
        if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
        return 0;
    });

    const schedule = [];
    const daysToSchedule = 7;
    let taskIndex = 0;

    for (let d = 0; d < daysToSchedule; d++) {
        const currentDate = moment().add(d, 'days').startOf('day');
        let hoursAllocated = 0;

        // Available hours based on focus levels and preferences
        // We'll look at the top focus hours for the day
        const dayHours = [];
        for (let h = 0; h < 24; h++) {
            dayHours.push({ hour: h, focus: focusAverages[h] });
        }

        // Sort hours by focus level (descending)
        const bestHours = dayHours.sort((a, b) => b.focus - a.focus);

        for (let hInfo of bestHours) {
            if (hoursAllocated >= studyHoursPerDay) break;
            if (taskIndex >= sortedTasks.length) break;

            const task = sortedTasks[taskIndex];
            const taskFocusNeeded = FOCUS_REQUIREMENTS[task.taskType];

            // Smart Matching:
            // If it's a Heavy task, we definitely want high focus.
            // If it's a Light task, we can put it in lower focus hours.
            // But for now, we just fill the best hours with the most important tasks.

            const sessionDuration = Math.min(task.duration, studyHoursPerDay - hoursAllocated, 2); // Max 2 hours per session

            if (sessionDuration > 0) {
                const sessionDate = currentDate.clone().hour(hInfo.hour);

                schedule.push({
                    taskId: task._id,
                    title: task.title,
                    subject: task.subject,
                    type: task.taskType,
                    date: sessionDate.toDate(),
                    duration: sessionDuration,
                    focusLevel: hInfo.focus
                });

                hoursAllocated += sessionDuration;

                // Update task remaining duration or mark as scheduled
                // In a real system, we'd handle partial completion. 
                // For this MVP, we'll just move to the next task once scheduled.
                taskIndex++;
            }
        }
    }

    return schedule;
};
