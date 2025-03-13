import { Video } from '@/features/videos/types';
import { ApiError, ApiRequestError } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth-token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new ApiRequestError(
      error.message || 'API request failed',
      error.code || 'UNKNOWN_ERROR',
      response.status
    );
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint),
  post: (endpoint: string, data: any) => 
    fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) =>
    fetchWithAuth(endpoint, {
      method: 'DELETE',
    }),
};

export async function fetchVideos(userId?: string, page = 1, limit = 12) {
  const params = new URLSearchParams({
    ...(userId && { userId }),
    page: page.toString(),
    limit: limit.toString()
  });

  return api.get(`/videos?${params}`);
}

export async function fetchVideoById(id: string) {
  return api.get(`/videos/${id}`);
}

export async function createVideo(video: Omit<Video, '_id'>) {
  return api.post('/videos', video);
}

export async function updateVideo(id: string, updates: Partial<Video>) {
  return api.put(`/videos/${id}`, updates);
}

export async function deleteVideo(id: string) {
  return api.delete(`/videos/${id}`);
}