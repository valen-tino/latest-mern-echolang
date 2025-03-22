import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, loginCredentials, registerCredentials, User } from '../types/auth';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';

interface AuthContextType extends AuthState {
    login: (credentials: loginCredentials) => Promise<User>;
    register: (credentials: registerCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true, error: null };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
                user: action.payload,
                error: null,
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                error: null,
            };
        default:
            return state;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    dispatch({ type: 'AUTH_SUCCESS', payload: user });
                } else {
                    dispatch({ type: 'AUTH_FAILURE', payload: 'No user found' });
                }
            } catch(error){
                dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
            }
        }
        initAuth();
    }, [])

    const login = async (credentials: loginCredentials): Promise<User> => {
        dispatch({ type: 'AUTH_START' });
        try {
            const user = await loginUser(credentials);
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
            return user; // Return user for role-based redirection
        } catch(error: any){
            dispatch({ type: 'AUTH_FAILURE', payload: error.message });
            throw error;
        }
    }
    
    const register = async (credentials: registerCredentials) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const user = await registerUser(credentials);
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } catch(error: any){
            dispatch({ type: 'AUTH_FAILURE', payload: error.message });
            throw error;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };
    
    return (
        <AuthContext.Provider value={{ ...state, login, register, logout }}>
          {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}