//elena
export interface Review {
    id: number;
    content: string;
    rating: number; //1-5
    createdAt: string | Date;
    eventId: number;
    employeeId: number;
    employeeName: string;
    employeeEmail: string;
}

export interface CreateReviewRequest {
    employeeId: number;
    content: string;
    rating: number; //1-5
}
