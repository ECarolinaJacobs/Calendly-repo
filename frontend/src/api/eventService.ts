import apiClient from "./apiClient";
import type { Event, CreateEventRequest } from "../models/Event";

export const getEvents = async (): Promise<Event[]> => {
	const response = await apiClient.get<Event[]>("/Event");
	return response.data;
};

export const createEvent = async (
	event: CreateEventRequest,
): Promise<Event> => {
	const response = await apiClient.post<Event>("/Event", event);
	return response.data;
};

export const updateEvent = async (
	id: number,
	event: CreateEventRequest,
): Promise<Event> => {
	const response = await apiClient.put<Event>(`/Event/${id}`, event);
	return response.data;
};

export const deleteEvent = async (id: number): Promise<boolean> => {
	try {
		await apiClient.delete(`/Event/${id}`);
		return true;
	} catch (error) {
		console.error("Error deleting event:", error);
		return false;
	}
};
