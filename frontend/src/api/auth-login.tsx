import apiClient from './apiClient';

export interface LoginResponse {
    token: string;
}

export default async function authLogin(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await apiClient.post<LoginResponse>('/auth/login', { Email: email, Password: password });
        return response.data;
    }
    catch (error: any){
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
}
