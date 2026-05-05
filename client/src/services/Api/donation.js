import ApiService from '../axios';

export const getDonations = () => ApiService.get('/donations');

export const getDonationById = (id) => ApiService.get(`/donations/${id}`);

export const createDonation = (donationData) => 
  ApiService.post('/donations', donationData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateDonation = (id, donationData) =>
  ApiService.put(`/donations/${id}`, donationData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteDonation = (id) => ApiService.delete(`/donations/${id}`);