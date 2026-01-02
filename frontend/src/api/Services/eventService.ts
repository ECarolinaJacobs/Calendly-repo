import apiClient from "../apiClient";
import type { Event, CreateEventRequest , Attendee} from "../../../components/Events/EventDrawer/types";

export class EventService {
	/**
	 * gets all events from the api
	 */
	static async getEvents(): Promise<Event[]> {
		const response = await apiClient.get<Event[]>("/Event");
		return response.data;
	}


	/**
	 * creates a new event
	 */
	static async createEvent(event: CreateEventRequest): Promise<Event> {
		const response = await apiClient.post<Event>("/Event", event);
		return response.data;
	}

	/**
	 * updates a specific event
	 */
	static async updateEvent(id: number, event: CreateEventRequest): Promise<Event> {
		const response = await apiClient.put<Event>(`/Event/${id}`, event);
		return response.data;
	}

	/**
	 * deletes a specific event
	 */
	static async deleteEvent(id: number): Promise<boolean> {
		try {
			await apiClient.delete(`/Event/${id}`);
			return true;
		} catch (error) {
			console.error("Error deleting event:", error);
			return false;
		}
	}

	/**
	 * gets all events belonging to the user with the userid
	 */
	static getUserEvents(events: Event[], userId: number): Event[] {
		return events.filter((event) =>
			event.attendees?.some((att) => att.employeeId === userId)
		);
	}

	/**
	 * seperates events into upcoming and past events
	 */
	static categorizeEvents(events: Event[]): { upcoming: Event[]; past: Event[] } {
		const now = new Date();
		const upcoming = events.filter((event) =>
			event.startDate && new Date(event.startDate) > now
		);
		const past = events.filter((event) =>
			event.startDate && new Date(event.startDate) <= now
		);
		return { upcoming, past };
	}

	/**
   * Removes a user from an event
   */
	static async leaveEvent(eventId: number, attendeeId: number): Promise<void> {
		await apiClient.delete(`/Event/${eventId}/attendee/${attendeeId}`);
	}

	/**
	 * Finds the attendee record for a specific user in an event
	 */
	static findUserAttendee(event: Event, userId: number): Attendee | undefined {
		return event.attendees?.find((att) => att.employeeId === userId);
	}
}
