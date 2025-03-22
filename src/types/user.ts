export type userRole = 'user' | 'admin';

export interface User {
    _id: string;
    id: string;
    name: string;
    email: string;
    role: userRole;
}