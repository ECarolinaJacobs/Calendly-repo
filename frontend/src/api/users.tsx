import apiClient from "./apiClient";
import type { Employee } from "../models/Employee";
import type { UpdateUser } from "../models/UpdateUser";

export const getUserInformation = async (userId: number): Promise<Employee> => {
    try {
    const response = await apiClient.get<Employee>(`/Profile/${userId}`);
    return response.data;
    }
    catch (error: any) {
        console.error('Loading user data failed:', error.response?.data || error.message);
        throw error;
    }
}

export const updateUserInformation = async (userId: number, updatedUserInfo: UpdateUser): Promise<void> => {
    try {
        await apiClient.put(`/Profile/${userId}`, updatedUserInfo);
    }
    catch (error: any) {
        console.error('Updating user data failed:', error.response?.data || error.message);
        throw error;
    }
}


