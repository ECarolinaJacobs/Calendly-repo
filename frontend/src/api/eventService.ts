import apiClient from "./apiClient";
import type { Event, CreateEventRequest } from "../models/Event";


export const getEvents = async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/Event');
    return response.data;
};

export const createEvent = async (event: CreateEventRequest): Promise<Event> => {
    const response = await apiClient.post<Event>('/Event', event);
    return response.data;
};
