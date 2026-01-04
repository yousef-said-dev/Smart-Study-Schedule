import api from './api';

const create = (subjectData) => {
  return api.post('/subjects', subjectData);
};

const getAll = () => {
  return api.get('/subjects');
};

const getById = (id) => {
  return api.get(`/subjects/${id}`);
};

const update = (id, subjectData) => {
  return api.put(`/subjects/${id}`, subjectData);
};

const deleteSubject = (id) => {
  return api.delete(`/subjects/${id}`);
};

export default {
  create,
  getAll,
  getById,
  update,
  deleteSubject,
};