import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // other config
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    // Make sure token is prefixed with 'Bearer '
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

export default api