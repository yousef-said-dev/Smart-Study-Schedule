import { format, isToday, isTomorrow, isPast } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  
  return format(d, 'MMM dd, yyyy');
};

export const formatDuration = (hours) => {
  if (!hours) return '0h';
  
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-red-100 text-red-800',
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800';
};

export const getStatusColor = (status) => {
  const colors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    skipped: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};