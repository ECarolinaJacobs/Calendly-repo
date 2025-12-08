export interface Event {
    id: number;
    title: string;
    description: string;
    image?: string;
    startDate?: string;
    endDate?: string;
    attendees?: any[]; // We can refine this later if needed
}

export interface CreateEventRequest {
    Title: string;
    Description: string;
    Image?: string;
    StartDate?: string;
    EndDate?: string;
}
