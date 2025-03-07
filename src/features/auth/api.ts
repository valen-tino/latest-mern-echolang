import { LoginCredentials, RegisterData, User } from './types';

const API_URL = '/api/auth';

export async function login(credentials: LoginCredentials): Promise<User> {
  // Simulate API call - replace with real API call
  if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
    return {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      emailVerified: true,
      createdAt: new Date().toISOString()
    };
  }
  
  if (credentials.email === 'user@example.com' && credentials.password === 'password') {
    return {
      id: '2',
      email: 'user@example.com',
      name: 'Test User',
      role: 'customer',
      emailVerified: true,
      createdAt: new Date().toISOString()
    };
  }

  throw new Error('Invalid credentials');
}

export async function register(data: RegisterData): Promise<void> {
  // Simulate API call - replace with real API call
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  // Simulate email verification
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function verifyEmail(token: string): Promise<void> {
  // Simulate API call - replace with real API call
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

export async function logout(): Promise<void> {
  // Simulate API call - replace with real API call
  return new Promise((resolve) => setTimeout(resolve, 500));
}