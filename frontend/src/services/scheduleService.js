import api from './api';

const generate = () => {
  return api.post('/schedules/generate', {});
};

const getSchedules = () => {
  return api.get('/schedules');
};

const getById = (id) => {
  return api.get(`/schedules/${id}`);
};

const deleteSchedule = (id) => {
  return api.delete(`/schedules/${id}`);
};

const updateSessionStatus = (sessionId, status) => {
  return api.patch(`/schedules/sessions/${sessionId}/status`, { status });
};

export default {
  generate,
  getSchedules,
  getById,
  deleteSchedule,
  updateSessionStatus,
};