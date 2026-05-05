import ApiService from '../axios';

export const getLanguages = () => ApiService.get('/language');
export const getLanguageById = (id) => ApiService.get(`/language/${id}`);

export const createLanguage = (languageData) => {
  return ApiService.post('/language', languageData);
};

export const updateLanguage = (id, languageData) => {
  return ApiService.put(`/language/${id}`, languageData);
};

export const deleteLanguage = (id) => ApiService.delete(`/language/${id}`);