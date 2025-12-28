import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import type { Event } from "../Events/EventDrawer/types";

interface EventsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
}

export function EventsPanel({ isOpen, onClose, events }: EventsPanelProps) {
  const navigate = useNavigate();
  const upcomingEvents = events.filter(event => {
    if (!event.startDate) return false;
    return new Date(event.startDate) > new Date();
  }).sort((a, b) => {
    //sorts by date, earlier to latest
    return new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime();
  });

  const handleEventClick = (eventTitle: string) => {
    navigate(`/events/${eventTitle}`);
    onClose();
  };
  return (
    <>
      {isOpen && (
        <div
          className="events-panel-overlay"
          onClick={onClose}
        />
      )}
      <div className={`events-panel ${isOpen ? 'open' : ''}`}>
        <div className="events-panel-header">
          <h2>Upcoming Events</h2>
          <button className="events-panel-close" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <div className="events-panel-content">
          {upcomingEvents.length === 0 ? (
            <p className="events-panel-empty">No upcoming events</p>
          ) : (
            <div className="events-list">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="event-card"
                  onClick={() => handleEventClick(event.title)}
                >
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="event-card-image"
                    />
                  )}
                  <div className="event-card-content">
                    <h3 className="event-card-title">{event.title}</h3>
                    <p className="event-card-description">
                      {event.description.length > 100
                        ? `${event.description.substr(0, 100)}...`
                        : event.description}
                    </p>
                    <div className="event-card-details">
                      <span className="event-card-date">
                        📅{new Date(event.startDate!).toLocaleDateString()}
                      </span>
                      <span className="event-card-time">
                        🕐{new Date(event.startDate!).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="event-card-attendees">
                        👥 {event.attendees.length} attending
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </>
  );
}
