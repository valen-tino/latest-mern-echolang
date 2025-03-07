import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './store';
import type { User } from './types';

export function useAuth() {
  const store = useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    try {
      await store.login(email, password);
      // Get the latest user state after login
      const user = useAuthStore.getState().user;
      // Redirect based on user role
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(() => {
    store.logout();
    navigate('/login');
  }, [navigate, store]);

  return {
    user: store.user,
    isAuthenticated: !!store.user,
    login,
    logout
  };
}