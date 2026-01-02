import { useState, useEffect, useCallback } from "react";
import type { Event } from "../components/Events/EventDrawer/types";
import { EventService} from "../src/api/Services/eventService";

/**
 * custom hook to manage users events (upcoming and past)
 */
export function useMyEvents(userId: number | null) {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [pastEvents, setPastEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchMyEvents = useCallback(async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const allEvents = await EventService.getEvents();
            const myEvents = EventService.getUserEvents(allEvents, userId);
            const { upcoming, past } = EventService.categorizeEvents(myEvents);
            setUpcomingEvents(upcoming);
            setPastEvents(past);
        } catch (err) {
            console.error("Failed to load events:", err);
            setError(err instanceof Error ? err.message : "Failed to load events");
        } finally {
            setLoading(false);
        }
    }, [userId]);
    useEffect(() => {
        fetchMyEvents();
    }, [userId]);
    return {
        upcomingEvents,
        pastEvents,
        loading,
        error,
        refetch: fetchMyEvents,
    };
}
