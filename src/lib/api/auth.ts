import type { LoginCredentials, User } from '@/features/auth/types';

const API_BASE = '/api/auth';

export async function login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
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
    throw new Error('Registration failed');
  }
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE}/logout`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
}