import type { Event } from "../Events/EventDrawer/types";
import { formatEventDate, formatEventTime } from "../utils/formatters";

interface EventCardProps {
    event: Event;
    isPast?: boolean;
    onAction: (event: Event) => void;
    actionLabel: string;
    actionClass: string;
}
/** 
 * reusable event card component for displaying event info in my events page
 */

export function EventCard({ event, isPast = false, onAction, actionLabel, actionClass }: EventCardProps) {
    return (
        <div
            className={`event-item ${isPast ? 'past' : ''}`}
            aria-label={`${event.title} - ${isPast ? 'Past event' : 'Upcoming event'}`}
        >
            {event.image && (
                <img src={event.image} alt={event.title} className="event-item-image" />
            )}
            <div className="event-item-content">
                <h3>{event.title}</h3>
                <p className="event-item-description">{event.description}</p>
                <div className="event-item-details" aria-label="Event details">
                    <span aria-label="Event date">
                        📅 {event.startDate ? formatEventDate(event.startDate) : 'To Be Determined'}
                    </span>
                    <span aria-label="Event time">
                        🕐 {event.startDate ? formatEventTime(event.startDate) : 'To Be Determined'}
                    </span>

                </div>
                <div className="event-item-actions">
                    <button
                        className={actionClass}
                        onClick={() => onAction(event)}
                        aria-label={`${actionLabel} for ${event.title}`}
                    >
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div >
    );
}

