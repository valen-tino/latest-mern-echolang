import type { LoginCredentials, User } from '@/features/auth/types';

const API_BASE = '/api/auth';

export async function login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Login failed');
  }

  const data = await response.json();
  return {
    token: data.token,
    user: {
      ...data.user,
      emailVerified: true, // Server doesn't return this yet
      createdAt: new Date().toISOString() // Server doesn't return this yet
    }
  };
}

export async function register(data: {
  email: string;
  password: string;
  name: string;
}): Promise<void> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Registration failed');
  }
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) return;

  const response = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Logout failed');
  }

  localStorage.removeItem('token');
}