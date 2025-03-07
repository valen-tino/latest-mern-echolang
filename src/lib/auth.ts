import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
  } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
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
}));