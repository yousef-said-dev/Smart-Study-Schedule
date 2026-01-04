import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { scheduleService } from '../../services/scheduleService';
import SessionCard from './SessionCard';
import { formatDate, getStatusColor, formatDuration } from '../../utils/helpers';

const ScheduleView = ({ schedules }) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleViewSchedule = async (scheduleId) => {
    try {
      const response = await scheduleService.getById(scheduleId);
      setSelectedSchedule(response.data);
    } catch (error) {
      toast.error('Failed to load schedule details');
    }
  };

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <div key={schedule._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{schedule.title}</h3>
              <p className="text-sm text-gray-600">
                Created: {formatDate(schedule.generatedDate)} | Exam: {formatDate(schedule.examDate)}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewSchedule(schedule._id)}
                className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
              >
                View
              </button>
              <button
                onClick={() => {/* TODO: Delete schedule */ }}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {selectedSchedule && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Schedule Details</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedSchedule.sessions?.map((session) => (
              <SessionCard key={session._id} session={session} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;