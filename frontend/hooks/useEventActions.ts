import { useState } from "react";
import toast from "react-hot-toast";
import type { Event } from "../components/Events/EventDrawer/types";
import type { CreateReviewRequest } from "../src/models/Review";
import { createReview } from "../src/api/Services/review-service";
import { EventService } from "../src/api/Services/eventService";

/** 
 * custom hook to handle event related actions, leave event and submit review
 */

export function useEventActions(userId: number | null, onSuccess: () => void) {
    const [isProcessing, setIsProcessing] = useState(false);
    const leaveEvent = async (event: Event) => {
        if (!userId) return;
        const confirmed = window.confirm(`Are you sure you want to leave "${event.title}"?`);
        if (!confirmed) return;
        try {
            setIsProcessing(true);
            const attendee = EventService.findUserAttendee(event, userId);
            if (!attendee) {
                throw new Error("You are not attending this event");
            }
            await EventService.leaveEvent(event.id, attendee.id);
            toast.success("succesfully left the event");
            onSuccess();
        } catch (err) {
            console.error("Error leaving event");
            toast.error(err instanceof Error ? err.message : "Failed to leave event");
        } finally {
            setIsProcessing(false);
        }
    };
    const submitReview = async (eventId: number, content: string, rating: number) => {
        if (!userId) return;
        if (!content.trim()) {
            toast.error("Please write a review before submitting");
            return false;
        }
        try {
            setIsProcessing(true);
            const reviewRequest: CreateReviewRequest = {
                employeeId: userId,
                content,
                rating,
            };
            await createReview(eventId, reviewRequest);
            toast.success("Review submitted successfully");
            return true;
        } catch (err) {
            console.error("Error sumbitting review:", err);
            toast.error(err instanceof Error ? err.message : "Failed to submit review");
            return false;
        } finally {
            setIsProcessing(false);
        }
    };
    return {
        leaveEvent,
        submitReview,
        isProcessing,
    };
}
