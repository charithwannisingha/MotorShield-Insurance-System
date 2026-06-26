import axios from 'axios';

// Laravel Backend එක දුවන ප්‍රධාන ලින්ක් එක
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ලොග් වුණාට පස්සේ ලැබෙන Token එක හැම රික්වෙස්ට් එකක් එක්කම යවන්න
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;