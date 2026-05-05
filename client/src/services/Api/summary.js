import ApiService from '../axios';

export const getSummary = () => ApiService.get('/summaries');
export const getSummaryById = (id) => ApiService.get(`/summaries/${id}`);

export const createSummary = (summaryData) => {
  return ApiService.post('/summaries', summaryData);
};

export const updateSummary = (id, summaryData) => {
  return ApiService.put(`/summaries/${id}`, summaryData);
};

export const deleteSummary = (id) => ApiService.delete(`/summaries/${id}`);