//elena
import apiClient from "../apiClient";
import type { Review, CreateReviewRequest } from "../../models/Review";

/*get all reviews for a specific event (public)*/
export const getReviewsByEvent = async (eventId: number): Promise<Review[]> => {
    try {
        const response = await apiClient.get<Review[]>("/Review/event/${eventId}");
        return response.data;
    } catch (error: any) {
        console.error("Failed to get reviews for event ${eventId}:", error.response?.data || error.message);
        throw error;
    }
};

/*create a review for an event (authenticated users only) */
export const createReview = async (
    eventId: number,
    review: CreateReviewRequest
): Promise<Review> => {
    try {
        const response = await apiClient.post<Review>("/Review/event/${eventId}", review);
        return response.data;
    } catch (error: any) {
        console.error("Failed to create review for event ${eventId}", error.response?.data || error.message);
        throw error;
    }
};

/* get all reviews in the system (amdin only) */
export const getAllReviews = async (): Promise<Review[]> => {
    try {
        const response = await apiClient.get<Review[]>("/Review/all");
        return response.data;
    } catch (error: any) {
        console.error("Failed to get all reviews:", error.response?.data || error.message);
        throw error;
    }
};

/*Delete a review (admin only) */
export const deleteReview = async (reviewId: number): Promise<boolean> => {
    try {
        await apiClient.delete("/Review/${reviewId}");
        return true;
    } catch (error: any) {
        console.error("Failed to delete review ${reviewId}: ", error.response?.data || error.message);
        return false;
    }
};
