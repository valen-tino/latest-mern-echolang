import axios from 'axios';
import { Video } from '@/features/videos/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle session expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Video API functions
export async function getVideos() {
  return api.get('/videos');
}

export async function getVideoById(id) {
  return api.get(`/videos/${id}`);
}

export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append('video', file);
  
  return api.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      // You can use this to track upload progress
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`Upload progress: ${percentCompleted}%`);
    },
  });
}

export async function updateVideo(id, updates) {
  return api.put(`/videos/${id}`, updates);
}

export async function deleteVideo(id) {
  return api.delete(`/videos/${id}`);
}