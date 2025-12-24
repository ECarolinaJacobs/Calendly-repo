import apiClient from "./apiClient";

export interface Attendance {
    id: number;
    employeeId: number;
    employeeName: string;
    date: string; 
}
export interface CreateAttendanceRequest {
    date: string;
}
export interface UpdateAttendanceRequest {
    date?: string;
}

export async function getMyAttendance(): Promise<Attendance[]> {
    try {
        const response = await apiClient.get<Attendance[]>("/attendance");
        return response.data;
    } catch (error: any) {
        console.error(
            "Failed to get attendance",
            error.response?.data || error.message
        );
        throw error;
    }
}

export async function createAttendance(
    request: CreateAttendanceRequest
) : Promise<Attendance> {
    try {
        const response = await apiClient.post<Attendance>("/attendance", request);
        return response.data;
    } catch (error: any) {
        console.error(
            "Failed to create attendance: ",
            error.response?.data || error.message
        );
        throw error;
    }
}


export async function updateAttendance(
    id: number,
    request: UpdateAttendanceRequest
): Promise<void> {
    try {
        await apiClient.put(`/attendance/${id}`, request);
    } catch (error: any) {
        console.error(
            `Failed to update attendance ${id}:`,
            error.response?.data || error.message 
        );
        throw error;
    }
}

export async function deleteAttendance(id: number): Promise<boolean> {
    try {
        await apiClient.delete(`/attendance/${id}`);
        return true;
    } catch (error: any) {
        console.error(
            `Failed to delete attendance ${id}`,
            error.response?.data || error.message
        );
        return false;
    }
}
