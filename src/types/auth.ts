export type userRole = 'user' | 'admin';

export interface User {
    _id: string;
    id: string;
    name: string;
    email: string;
    role: userRole;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface loginCredentials {
    email: string;
    password: string;
}

export interface registerCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}