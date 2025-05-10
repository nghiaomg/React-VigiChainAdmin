import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:2222/api',
});

const cookie = document.cookie;

if (cookie) {
  const tokenCookie = cookie.split('; ').find(row => row.startsWith('token='));
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export default api;