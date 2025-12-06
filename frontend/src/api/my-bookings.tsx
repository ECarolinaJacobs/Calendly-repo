import apiClient from './apiClient';

export interface Booking {
    id: number;
    roomName: string;
    startTime: string;
    endTime: string;
}

export const getMyBookings = async (): Promise<Booking[]> => {
    try {
        const response = await apiClient.get('/user/bookings');
        return response.data;
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
    }
};
