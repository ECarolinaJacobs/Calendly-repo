import "../../components/utils/formatters";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMyEvents } from "../../hooks/useMyEvents";
import { useEventActions } from "../../hooks/useEventActions";
import { ReviewModal } from "../../components/MyEvents/ReviewModal";
import type { Event } from "../../components/Events/EventDrawer/types";
import "../css/MyEventsPage.css";
import { EventCard } from "../../components/MyEvents/EventCard";

/**
 * elena
 * page component displaying users upcoming and past ecents
 * allows users to leave events and submit reviews for past events
 */

export default function MyEventsPage() {
    const navigate = useNavigate();
    const userId = Number(localStorage.getItem("userId"));
    const { upcomingEvents, pastEvents, loading, error, refetch } = useMyEvents(userId);
    const { leaveEvent, submitReview } = useEventActions(userId, refetch);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const openReviewModal = (event: Event) => {
        setSelectedEventId(event.id);
        setShowReviewModal(true);
    };
    const closeReviewModal = () => {
        setShowReviewModal(false);
        setSelectedEventId(null);
    };
    const handleSubmitReview = async (content: string, rating: number) => {
        if (!selectedEventId) return false;
        return await submitReview(selectedEventId, content, rating);
    };
    if (loading) {
        return (
            <div className="my-events-container">
                <h1>My Events</h1>
                <p>Loading your events...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="my-events-container">
                <h1>My Events</h1>
                <p className="error-message">Error: {error}</p>
                <button onClick={refetch}>Retry</button>
            </div>
        );
    }
    return (
        <>
            <Toaster position="top-right" />
            <div className="my-events-container">
                <div className="my-events-header">
                    <h1>My Events</h1>
                    <button className="back-button" onClick={() => navigate("/dashboard")}>
                        Back to dashboard
                    </button>
                </div>
                <section className="events-section">
                    <h2>Upcoming Events</h2>
                    {upcomingEvents.length === 0 ? (
                        <p className="empty-message">You havent joined any upcoming events yet</p>
                    ) : (
                        <div className="events-grid">
                            {upcomingEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onAction={leaveEvent}
                                    actionLabel="Leave Event"
                                    actionClass="unjoin-button"
                                />
                            ))}
                        </div>
                    )}
                </section>
                <section className="events-section">
                    <h2>Recently attended events</h2>
                    {pastEvents.length === 0 ? (
                        <p className="empty-message">No past events to show.</p>
                    ) : (
                        <div className="events-grid">
                            {pastEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    isPast={true}
                                    actionLabel="Add Review"
                                    actionClass="review-button"
                                    onAction={openReviewModal}
                                />
                            ))}
                        </div>
                    )}
                </section>
                <ReviewModal
                    isOpen={showReviewModal}
                    onClose={closeReviewModal}
                    onSubmit={handleSubmitReview}
                />
            </div>
        </>
    );
}
