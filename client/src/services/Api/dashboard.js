import ApiService from '../axios';

export const getLastMonthBook = () => ApiService.get('/books/last-month');
export const getBorrowActivity = ({ year, view, month, week }) => {
  return ApiService.get('/borrows/activity', {
    params: { year, view, month, week }
  });
};
export const getTopBorrowers = () => ApiService.get('/borrows/top-borrowers');