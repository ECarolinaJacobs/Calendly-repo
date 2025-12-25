import type { Attendee } from "../../components/Events/EventDrawer/types";
import type { Review } from "./Review";

export interface Event {
	id: number;
	title: string;
	description: string;
	image?: string;
	startDate?: string;
	endDate?: string;
	attendees?: Attendee[];
	reviews?: Review[];
}

export interface CreateEventRequest {
	Title: string;
	Description: string;
	Image?: string;
	StartDate?: string;
	EndDate?: string;
}
