import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { users } from '@/lib/mock/data';
import type { User } from './types';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email: string, password: string) => {
        const user = users.find(u => u.email === email);
        
        if (!user || password !== 'password') {
          throw new Error('Invalid credentials');
        }

        set({ user });
      },
      logout: () => set({ user: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);