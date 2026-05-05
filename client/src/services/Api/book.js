import ApiService from '../axios';

export const getBooks = () => ApiService.get('/books');
export const getBookById = (id) => ApiService.get(`/books/${id}`);
export const createBook = (bookData) => ApiService.post('/books', bookData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateBook = (id, bookData) => ApiService.put(`/books/${id}`, bookData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteBook = (id) => ApiService.delete(`/books/${id}`);
export const getAuthors = () => ApiService.get('/authors');
export const getCategories = () => ApiService.get('/categories');
export const getLanguages = () => ApiService.get('/language');

export const importBooks = (formData) => {
  return ApiService.post('/books/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`Upload progress: ${percentCompleted}%`);
    },
  });
};

export const previewBooks = (formData) => {
  return ApiService.post('/books/preview', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`Preview upload progress: ${percentCompleted}%`);
    },
  });
};