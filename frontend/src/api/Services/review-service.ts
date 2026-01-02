//elena
import apiClient from "../apiClient";
import type { Review, CreateReviewRequest } from "../../models/Review";

/**
 * fetches all reviews for a specific event
 * @param eventId
 * @returns promise resolved to array of review objects
 */
export const getReviewsByEvent = async (eventId: number): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>(`/Review/event/${eventId}`);
    return response.data;
};

/**
 * creates a new review for an event
 * @param eventId 
 * @param review 
 * @returns promise resolving into the created review object
 */
export const createReview = async (
    eventId: number,
    review: CreateReviewRequest
): Promise<Review> => {
    const response = await apiClient.post<Review>(`/Review/event/${eventId}`, review);
    return response.data;
};

/**
 * fetches all reviews in the system
 * @returns array of all review objects
 * 
 */
export const getAllReviews = async (): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>("/Review/all");
    return response.data;
};

/**
 * deletes review by its id
 * @param reviewId 
 * @returns error if deletion fails
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
    await apiClient.delete(`/Review/${reviewId}`);
};
