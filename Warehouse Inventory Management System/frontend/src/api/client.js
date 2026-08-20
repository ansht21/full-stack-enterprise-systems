import axios from 'axios'
import toast from 'react-hot-toast'

// Central Axios instance. Attaches the JWT and handles auth errors globally.
const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || 'Something went wrong'

    if (status === 401) {
      // Token expired or invalid — clear and send back to login.
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error('You do not have permission for this action')
    }
    return Promise.reject(new Error(message))
  },
)

export default api
