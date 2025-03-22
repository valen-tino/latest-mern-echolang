import api from "./api";
import { loginCredentials, registerCredentials, User } from "@/types/auth";

export async function loginUser(credentials: loginCredentials): Promise<User> {
    try {
        const response = await api.post('/auth/login', credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return user;
    } catch(error: any){
        throw new Error(error.response?.data?.message || 'Login failed');
    }
}

export async function registerUser(credentials: registerCredentials): Promise<User> {
    try {
        const response = await api.post('/auth/register', credentials);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        return user;
    } catch(error: any){
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
    
        const response = await api.get('/auth/current');
        return response.data;
    } catch (error) {
        localStorage.removeItem('token');
        return null;
    }
}

export async function logout(): Promise<void> {
    localStorage.removeItem('token');
}