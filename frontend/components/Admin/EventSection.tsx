import { useState } from "react";
import { EventService } from "../../src/api/Services/eventService";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmationHook";
import { formatDate } from "../utils/formatters";
import type { Event } from "../Events/EventDrawer/types";

interface EventsSectionProps {
    events: Event[];
    onDataChange: () => void;
}

interface EventFormState {
    title: string;
    description: string;
    image: string;
    startDate: Date | string | undefined;
    endDate: Date | string | undefined;
    attendees: any[];
}

/**
 * elena
 * eventssection component 
 * manages events display, editing and deleting
 */

export function EventsSection({ events, onDataChange }: EventsSectionProps) {
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [editForm, setEditForm] = useState<EventFormState>({
        title: "",
        description: "",
        image: "",
        startDate: undefined,
        endDate: undefined,
        attendees: [],
    });

    const { handleDelete } = useDeleteConfirmation(
        EventService.deleteEvent,
        onDataChange,
        "Event"
    );

    /**
     * Opens the edit modal and populates form with event data
     * @param event - Event to edit
     */
    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setEditForm({
            title: event.title,
            description: event.description,
            image: event.image || "",
            startDate: event.startDate,
            endDate: event.endDate,
            attendees: event.attendees || [],
        });
    };

    /**
     * Closes the edit modal and resets form state
     */
    const handleCancelEdit = () => {
        setEditingEvent(null);
        setEditForm({
            title: "",
            description: "",
            image: "",
            startDate: undefined,
            endDate: undefined,
            attendees: [],
        });
    };

    /**
     * Submits the updated event data to the API
     * @param e - Form submission event
     */
    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;
        await EventService.updateEvent(editingEvent.id, {
            Title: editForm.title,           // Capitalize for API
            Description: editForm.description,
            Image: editForm.image,
            StartDate: editForm.startDate,
            EndDate: editForm.endDate,
        } as any);
    };

    return (
        <div className="events-section">
            <h2>Events Management ({events.length})</h2>

            {/* Edit Event Modal */}
            {editingEvent && (
                <div className="edit-event-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Edit Event</h3>
                            <button
                                onClick={handleCancelEdit}
                                className="close-modal-btn"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleUpdateEvent} className="edit-event-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="edit-title">
                                        Title:<span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="edit-title"
                                        value={editForm.title}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                title: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="edit-description">
                                        Description:<span className="required">*</span>
                                    </label>
                                    <textarea
                                        id="edit-description"
                                        value={editForm.description}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                description: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="edit-image">Image URL:</label>
                                    <input
                                        type="text"
                                        id="edit-image"
                                        value={editForm.image}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                image: e.target.value,
                                            })
                                        }
                                    />
                                    {editForm.image && (
                                        <div className="image-preview">
                                            <img src={editForm.image} alt="Event preview" />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="edit-start-date">Start Date:</label>
                                    <input
                                        type="datetime-local"
                                        id="edit-start-date"
                                        value={
                                            editForm.startDate
                                                ? new Date(editForm.startDate)
                                                    .toISOString()
                                                    .slice(0, 16)
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                startDate: e.target.value
                                                    ? new Date(e.target.value)
                                                    : undefined,
                                            })
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="edit-end-date">End Date:</label>
                                    <input
                                        type="datetime-local"
                                        id="edit-end-date"
                                        value={
                                            editForm.endDate
                                                ? new Date(editForm.endDate)
                                                    .toISOString()
                                                    .slice(0, 16)
                                                : ""
                                        }
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                endDate: e.target.value
                                                    ? new Date(e.target.value)
                                                    : undefined,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="save-btn">
                                    💾 Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="cancel-btn"
                                >
                                    ✕ Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Events Table */}
            <table className="events-table" aria-label="Events list">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Attendees</th>
                        <th scope="col">Reviews</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="center-text">
                                No events found
                            </td>
                        </tr>
                    ) : (
                        events.map((event) => (
                            <tr key={event.id}>
                                <td>{event.id}</td>
                                <td>{event.title}</td>
                                <td>{event.description}</td>
                                <td>{formatDate(event.startDate)}</td>
                                <td>{formatDate(event.endDate)}</td>
                                <td>{event.attendees?.length || 0}</td>
                                <td>{event.reviews?.length || 0}</td>
                                <td>
                                    <button
                                        onClick={() => handleEditEvent(event)}
                                        className="edit-btn"
                                        aria-label={`Edit event ${event.title}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id, event.title)}
                                        className="delete-btn"
                                        aria-label={`Delete event ${event.title}`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}