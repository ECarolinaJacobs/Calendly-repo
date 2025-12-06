import apiClient from './apiClient';

type BookingParams = {
    RoomId: number;
    EmployeeId: number;
    BookingDate: string;
    StartTime: string;
    EndTime: string;
};

export default async function BookRoom(params: BookingParams) {
    try {
        const response = await apiClient.post('/bookings/start', params);
        return response.data;
    } catch (error: any) {
        console.error('Booking failed:', error.response?.data || error.message);
        throw error;
    }
}