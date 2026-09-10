import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 35000,
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('replate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired sessions
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired and not on login/register, notify or cleanup
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Optional: localStorage.removeItem('replate_token');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  sendWhatsAppTest: (data) => API.post('/auth/send-whatsapp-test', data),
};

// Chat / AI Endpoints
export const chatAPI = {
  sendMessage: (data) => API.post('/chat/message', data),
  getConversations: (params) => API.get('/chat/conversations', { params }),
  getMessages: (id) => API.get(`/chat/conversations/${id}`),
  deleteConversation: (id) => API.delete(`/chat/conversations/${id}`),
  clearHistory: () => API.delete('/chat/clear'),
};

// Donation Endpoints
export const donationAPI = {
  getStats: () => API.get('/donations/stats'),
  getAll: (params) => API.get('/donations', { params }),
  getById: (id) => API.get(`/donations/${id}`),
  create: (data) => API.post('/donations', data),
  claim: (id, data) => API.patch(`/donations/${id}/claim`, data),
  updateStatus: (id, data) => API.patch(`/donations/${id}/status`, data),
  getTimeline: (id) => API.get(`/donations/${id}/timeline`),
  getMyDonations: () => API.get('/donations/my-donations'),
  getMyClaims: () => API.get('/donations/my-claims'),
};


export default API;
