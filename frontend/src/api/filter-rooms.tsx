import apiClient from "./apiClient";
import type { Room } from "../models/Room";

export default async function FilterRooms(floor?: string, startTime?: string , endTime?: string): Promise<Room[]> {
  try {
    const response = await apiClient.post<Room[]>("/rooms/filtered", {
      Floor: floor,
      StartTime: startTime,
      EndTime: endTime
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Filtering rooms failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}
