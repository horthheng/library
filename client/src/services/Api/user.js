import api from '@/services/axios'

export const registerUser = async (form) => {
  const formData = new FormData();
  formData.append('username', form.username);
  formData.append('email', form.email);
  formData.append('phone', form.phone);
  formData.append('password', form.password);
  formData.append('roleId', form.roleId || 1); // Optional with default
  if (form.profile_image) formData.append('profile_image', form.profile_image);

  try {
    const token = localStorage.getItem('token') || ''; // Optional auth
    const response = await api.post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}` // Optional
      }
    });
    return response.data.user;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/signin', { email, password })
    return response.data
  } catch (err) {
    console.error('loginUser error:', err.response?.data || err.message)
    throw err
  }
}

export function createUser(formData) {
  return api.post('/user/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function getAllUsers() {
  return api.get('/user/users');
}

export function getRoles() {
  return api.get('/user/roles');
}

export function getUserById(id) {
  return api.get(`/user/${id}`);
}

export function updateUser(id, formData) {
  return api.put(`/user/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export function deleteUser(id) {
  return api.delete(`/user/${id}`);
}

export function getProfile() {
  return api.get('/user/profile/me');
}

export function getUserBarcodeImage(id) {
  return api.get(`/user/${id}/barcode`, {
    responseType: 'blob'
  });
}

export function getUserQRCode(id) {
  return api.get(`/user/${id}/qrcode`, {
    responseType: 'blob',
  });
}
export const uploadProfileImage = async (id, imageFile) => {
  const formData = new FormData();
  formData.append("profile_image", imageFile);

  try {
    const response = await api.post(`/user/${id}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error('Image upload error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Image upload failed');
  }
};

export const getBorrows = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/borrow', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Raw API response for borrows:', response.data); // Log raw data for debugging
    if (!response.data || !Array.isArray(response.data)) {
      console.warn('Invalid borrow data received:', response.data);
      return [];
    }
    // Map API response to expected structure based on database schema
    return response.data.map(borrow => {
      const dueDate = new Date(borrow.return_date);
      if (isNaN(dueDate.getTime())) {
        console.warn(`Invalid date for borrow ${borrow.id}: ${borrow.return_date}, using current date as fallback`);
        dueDate = new Date(); // Fallback to current date
      }
      return {
        id: borrow.id,
        bookTitle: {
          title: borrow.book?.title || borrow.title || borrow.isbn || 'Unknown Book',
        },
        userBorrow: borrow.borrower_name || borrow.username || borrow.user?.name || 'Unknown User',
        dueDate: dueDate,
        status: borrow.status || 'borrowed',
      };
    });
  } catch (error) {
    console.error('Error fetching borrows:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch borrows');
  }
};
