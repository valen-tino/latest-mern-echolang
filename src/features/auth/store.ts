import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api/client';
import { User } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { user, token } = await api.post('/auth/login', { email, password });
          set({ user, token, loading: false });
          localStorage.setItem('auth-token', token);
        } catch (error) {
          set({ 
            loading: false, 
            error: error.response?.data?.message || 'Login failed' 
          });
          throw error;
        }
      },
      
      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const { user, token } = await api.post('/auth/register', { 
            name, email, password 
          });
          set({ user, token, loading: false });
          localStorage.setItem('auth-token', token);
        } catch (error) {
          set({ 
            loading: false, 
            error: error.response?.data?.message || 'Registration failed' 
          });
          throw error;
        }
      },
      
      logout: () => {
        localStorage.removeItem('auth-token');
        set({ user: null, token: null });
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);