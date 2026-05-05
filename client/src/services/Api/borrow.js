import api from '../axios';

export const getBorrows = () => api.get('/borrow');

export const getBorrowById = (id) => api.get(`/borrow/${id}`);

export const createBorrow = (borrowData) => api.post('/borrow', borrowData);

export const updateBorrow = (id, borrowData) =>
  api.put(`/borrow/${id}`, borrowData);

export const deleteBorrow = (id) => api.delete(`/borrow/${id}`);