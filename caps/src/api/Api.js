// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://15.165.19.114:3000', // ✅ 서버 주소
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ 요청 인터셉터: 매 요청마다 토큰 자동 삽입
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
