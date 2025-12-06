import apiClient from './apiClient';

export interface LoginResponse {
    token: string;
    userId: number;
    name: string;
    email: string;
    isAdmin: boolean; // FIXME: temporary, should be changed for security reasons, assignee: Elena
}

export default async function authLogin(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await apiClient.post<LoginResponse>('/auth/login', { Email: email, Password: password });
        return response.data;
    }
    catch (error: any) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
}
