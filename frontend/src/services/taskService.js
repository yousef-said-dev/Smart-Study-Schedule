import api from './api';

const createTask = (taskData) => api.post('/tasks', taskData);
const getTasks = () => api.get('/tasks');
const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};
