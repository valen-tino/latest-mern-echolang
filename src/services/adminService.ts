import api from './api';
import { AdminStats, FeedbackEntry } from '@/features/dashboard/types';

// Get admin dashboard statistics
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await api.get('/api/admin/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch admin statistics');
  }
}

// Get all users for admin dashboard
export async function getUsers() {
  try {
    const response = await api.get('/api/admin/users');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
}

// Get all videos for admin dashboard
export async function getVideos(page = 1, limit = 10) {
  try {
    const response = await api.get(`/api/admin/videos?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch videos');
  }
}

// Get all feedback for admin dashboard
export async function getFeedback() {
  try {
    const response = await api.get('/feedback/all');
    return response.data.feedback;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch feedback');
  }
}

// Respond to feedback
export async function respondToFeedback(feedbackId: string, response: string) {
  try {
    const result = await api.put(`/feedback/update/${feedbackId}`, { admin_response: response });
    return result.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to respond to feedback');
  }
}

// Update video status
export async function updateVideoStatus(videoId: string, status: string) {
  try {
    const response = await api.put(`/api/admin/videos/${videoId}/status`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update video status');
  }
}

// Delete video
export async function deleteVideo(videoId: string) {
  try {
    const response = await api.delete(`/api/admin/videos/${videoId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete video');
  }
}