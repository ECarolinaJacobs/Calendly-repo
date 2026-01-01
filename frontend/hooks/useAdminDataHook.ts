import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllEmployees, getStatistics, type AdminStats } from '../src/api/admin';
import { getEvents } from '../src/api/eventService';
import { getAllReviews } from '../src/api/Services/review-service';
import type { Event } from '../src/models/Event';
import type { Review } from '../src/models/Review';

export interface Employee {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
    coins: number;
}

/**
 * elena
 * custom hook for managing all admin dashboard data
 * fetches and manages employees, events, reviews and stats
 */

export function useAdminData() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    /**
     * loads all admin data in parallel using promise.all
     */
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [employeesData, statsData, eventsData, reviewsData] = await Promise.all([
                getAllEmployees(),
                getStatistics(),
                getEvents(),
                getAllReviews(),
            ]);
            setEmployees(employeesData || []);
            setStats(statsData);
            setEvents(eventsData || []);
            setReviews(reviewsData || []);
        } catch (err) {
            const errorMessage = "Failed to load data";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData();
    }, []);
    return {
        employees,
        setEmployees,
        events,
        reviews,
        stats,
        loading,
        error,
        loadData,
    };
}
