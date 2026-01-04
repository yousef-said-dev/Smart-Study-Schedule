import api from './api';

const logFocus = (logData) => api.post('/focus', logData);
const getFocusLogs = () => api.get('/focus');
const getFocusStats = () => api.get('/focus/stats');

export default {
    logFocus,
    getFocusLogs,
    getFocusStats,
};
