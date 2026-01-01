import { deleteReview } from '../../src/api/Services/review-service';
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmationHook';
import type { Review } from '../../src/models/Review';
import type { Event } from '../../src/models/Event';
import { formatDateTime, renderStars } from '../utils/formatters';

interface ReviewsSectionProps {
    reviews: Review[];
    events: Event[];
    onDataChange: () => void;
}
/** 
 * elena
 * reviewscection component: displays all reviews in a table format with event info, 
 * employee info, ratings and delete functionality
 */

export function ReviewsSection({ reviews, events, onDataChange }: ReviewsSectionProps) {
    const { handleDelete } = useDeleteConfirmation(
        deleteReview,
        onDataChange,
        "Review"
    );
    /**
     * gets the event title for a given event id
     * @param eventId
     * @returns event title or fallback string with event id
     */
    const getEventTitle = (eventId: number): string => {
        const event = events.find(e => e.id === eventId)
        return event?.title || `Event #${eventId}`;
    };
    return (
        <div className="reviews-section" >
            <h2>Reviews management ({reviews.length})</h2>
            <table className="review-table" aria-label="Reviews list">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Event</th>
                        <th scope="col">Employee</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Content</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="center-text">
                                No reviews found
                            </td>
                        </tr>
                    ) : (
                        reviews.map((review) => (
                            <tr key={review.id}>
                                <td>{review.id}</td>
                                <td>{getEventTitle(review.eventId)}</td>
                                <td>
                                    {review.employeeName}
                                    <br />
                                    <small className="muted-text">
                                        {review.employeeEmail}
                                    </small>
                                </td>
                                <td>
                                    <span className="star-rating">
                                        {renderStars(review.rating)}
                                    </span>
                                    <br />
                                    <small>{review.rating}/5</small>
                                </td>
                                <td className="max-width-content">
                                    {review.content}
                                </td>
                                <td>{formatDateTime(review.createdAt)}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                review.id,
                                                review.employeeName,
                                            )
                                        }
                                        className="delete-btn"
                                        aria-label={`Delete review by ${review.employeeName}`}
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

