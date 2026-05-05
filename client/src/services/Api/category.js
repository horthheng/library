import api from '../axios';

export const getCategory = () => api.get('/categories');

export const getCategoryId = (id) => api.get(`/categories/${id}`);

export const createCategory = (categoryData) => api.post('/categories', categoryData);

export const updateCategory = (id, categoryData) =>
  api.put(`/categories/${id}`, categoryData);

export const deleteCategory = (id) => api.delete(`/categories/${id}`);