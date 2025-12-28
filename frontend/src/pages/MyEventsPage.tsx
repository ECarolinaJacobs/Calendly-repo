// elena 
import {useState, useEffect, useActionState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../css/MyEventsPage.css";

interface Event {
    id: number;
    title: string;
    description: string;
    image?: string;
    startDate: string;
    endDate: string;
    attendees?: any[];
}

interface Review {
    content: string;
    rating: number;
}

export default function MyEventsPage() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [pastEvents, setPastEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [newReview, setNewReview] = useState<Review>({ content: "", rating: 5});
    useEffect(() => {
        fetchMyEvents();
    }, []);


    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5167/api/event");
            const allEvents = await response.json();
            const myEvents = allEvents.filter((event: Event) => 
                event.attendees?.some((att: any) => att.employeeId === Number(userId))
            );
            const now = new Date();
            const upcoming = myEvents.filter((event: Event) => new Date(event.startDate) > now);
            const past = myEvents.filter((event: Event) => new Date(event.startDate) <= now);
            setUpcomingEvents(upcoming);
            setPastEvents(past);
        } catch (error) {
            console.error("Failed to load events:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleUnjoinEvent = async (eventId: number, eventTitle: string) => {
        if (!confirm(`Are you sure you want to leave "${eventTitle}"?`)) return;
        try {
            const response = await fetch("http://localhost:5167/api/event");
            const allEvents = await response.json();
            const event = allEvents.find((e: Event) => e.id === eventId);
            const attendee = event?.attendees?.find((att: any) => att.employeeId === Number(userId));
            if (!attendee) {
                alert("You are not attending this event");
                return;
            }
            const deleteResponse = await fetch(`http://localhost:5167/api/event/${eventId}/attendee/${attendee.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (deleteResponse.ok) {
                alert("Successfully left the event");
                fetchMyEvents();
            } else {
                alert("Failed to leave event");
            }
        } catch (error) {
            console.error("Error leaving event:", error);
            alert("Failed to leave event");
        }
    };

    const openReviewModal = (eventId: number) => {
        setSelectedEventId(eventId);
        setShowReviewModal(true);
    };
    const closeReviewModal = () => {
        setShowReviewModal(false);
        setSelectedEventId(null);
        setNewReview({content: "", rating: 5});
    };
    const handleSubmitReview = async () => {
        if (!selectedEventId || !newReview.content.trim()) {
            alert("Please write a review before submitting");
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:5167/api/review/event/${selectedEventId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        employeeId: Number(userId),
                        content: newReview.content,
                        rating: newReview.rating,

                    }),
                }
            );
            if (response.ok) {
                alert("Review submitted successfully");
                closeReviewModal();
            } else {
                const error = await response.json();
                alert(error.message || "Failed to sumbit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to sumbit review");
        }
    };
    if (loading) {
        return (
            <div className="my-events-container">
                <h1>My Events</h1>
                <p>Loading your events...</p>
            </div>
        );
    }
    return (
        <div className="my-events-container">
            <div className="my-events-header">
                <h1>My Events</h1>
                <button className="back-button" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
            {/*upcoming events*/}
            <section className="events-section">
                <h2>Upcoming Events</h2>
                {upcomingEvents.length === 0 ? (
                    <p  className="empty-message">You haven't joined any upcoming events yet</p>
                ) : (
                    <div className="events-grid">
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="event-item">
                                {event.image && (
                                    <img src={event.image} alt={event.title} className="event-item-image" />
                                )}
                                <div className="event-item-content">
                                    <h3>{event.title}</h3>
                                    <p className="event-item-description">{event.description}</p>
                                    <div className="event-item-details">
                                        <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                                        <span>
                                            🕐{" "}
                                            {new Date(event.startDate).toLocaleDateString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <div className="event-item-actions">
                                        <button 
                                            className="unjoin-button"
                                            onClick={() => handleUnjoinEvent(event.id, event.title)}
                                        >
                                            Leave Event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {/*past events section */}
            <section className="events-section">
                <h2>Recently Attended Events</h2>
                {pastEvents.length === 0 ? (
                    <p className="empty-message">No past events to show.</p>
                ) : (
                    <div className="events-grid">
                        {pastEvents.map((event) => (
                            <div key={event.id} className="event-item past">
                                {event.image && (
                                    <img src={event.image} alt={event.title} className="event-item-image" />
                                )}
                                <div className="event-item-content">
                                    <h3>{event.title}</h3>
                                    <p className="event-item-description">{event.description}</p>
                                    <div className="event-item-details">
                                        <span>📅 {new Date(event.startDate).toLocaleDateString()}</span>
                                        <span>
                                            🕐{" "}
                                            {new Date(event.startDate).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <div className="event-item-actions">
                                        <button
                                            className="review-button"
                                            onClick={() => openReviewModal(event.id)}
                                        >
                                            Add Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {/*review modal */}
            {showReviewModal && (
                <div className="modal-overlay" onClick={closeReviewModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Add your review</h3>
                        <textarea
                            value={newReview.content}
                            onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                            placeholder="Share your thoughts on this event..."
                            rows={5}
                        />
                        <div className="rating-selector">
                            <label>Rating:</label>
                            <select
                                value={newReview.rating}
                                onChange={(e) => 
                                    setNewReview({ ...newReview, rating: Number(e.target.value)})
                                }
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>
                                        {num} ⭐
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-buttons">
                            <button className="submit-button" onClick={handleSubmitReview}>
                                Sumbit Review
                            </button>
                            <button className="cancel-button" onClick={closeReviewModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
