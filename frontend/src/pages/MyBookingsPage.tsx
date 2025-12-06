import React, { useState, useEffect } from "react";
import { getMyBookings } from "../api/my-bookings";
import type { Booking } from "../api/my-bookings";

import "./MyBookingsPage.css";
import axios from "axios";

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyBookings();
        setBookings(data);
        setError(null);
      } catch (err) {
        if (
          axios.isAxiosError(err) &&
          (err.response?.status === 401 || err.response?.status === 403)
        ) {
          setError("You must be logged in to view your bookings.");
        } else {
          setError("Failed to fetch bookings. Please try again later.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="my-bookings-container">
        <h2>Loading your bookings...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-bookings-container">
        <h2 className="error-message">{error}</h2>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <h1>My Bookings</h1>
      {bookings.length > 0 ? (
        <ul className="bookings-list">
          {bookings.map((booking) => (
            <li key={booking.id} className="booking-item">
              <div className="booking-room">
                <strong>Room:</strong> {booking.roomName}
              </div>
              <div className="booking-time">
                <strong>From:</strong> {formatDate(booking.startTime)}
              </div>
              <div className="booking-time">
                <strong>To:</strong> {formatDate(booking.endTime)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no bookings.</p>
      )}
    </div>
  );
};

export default MyBookingsPage;
