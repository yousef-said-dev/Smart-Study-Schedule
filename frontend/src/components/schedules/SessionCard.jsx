import React from 'react';
import { formatDate, formatDuration, getStatusColor } from '../../utils/helpers';

const SessionCard = ({ session }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
      <div>
        <h4 className="font-medium text-gray-900">{session.title}</h4>
        <p className="text-sm text-gray-600">
          {formatDate(session.date)} • {formatDuration(session.duration)}
        </p>
        {session.notes && <p className="text-xs text-gray-500 mt-1">{session.notes}</p>}
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
        {session.status}
      </span>
    </div>
  );
};

export default SessionCard;