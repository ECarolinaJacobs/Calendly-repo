import apiClient from './apiClient';

export interface RegisterResponse {
    id: string;
    name: string;
    email: string;
}

export default async function authRegister(name: string, email: string, password: string): Promise<RegisterResponse> {
    try {
        const response = await apiClient.post<RegisterResponse>('/auth/register', { Name: name, Email: email, Password: password });
        return response.data;
    }
    catch (error: any){
        console.error('Registration failed:', error.response?.data || error.message);
        throw error;
    }
}