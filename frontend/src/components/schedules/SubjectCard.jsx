import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getDifficultyColor } from '../../utils/helpers';

const SubjectCard = ({ subject, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: subject.color }}
            />
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {subject.name}
            </h3>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              subject.difficulty
            )}`}
          >
            {subject.difficulty}/5
          </span>
        </div>

        {subject.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{subject.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>📅 {formatDate(subject.examDate)}</span>
          <span>⏱️ {subject.totalHours}h total</span>
        </div>

        <div className="flex space-x-2">
          <Link to={`/schedule/${subject._id}`} className="flex-1">
            <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
              Generate Schedule
            </button>
          </Link>
          <Link to={`/subjects/${subject._id}`}>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
              Edit
            </button>
          </Link>
          <button
            onClick={() => onDelete(subject._id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;