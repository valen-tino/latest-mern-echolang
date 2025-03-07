import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from './types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string) => {
        // Simulate API call
        if (email === 'admin@example.com' && password === 'password') {
          set({
            isAuthenticated: true,
            user: {
              id: '1',
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin'
            }
          });
        } else if (email === 'user@example.com' && password === 'password') {
          set({
            isAuthenticated: true,
            user: {
              id: '2',
              email: 'user@example.com',
              name: 'Test User',
              role: 'customer'
            }
          });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);