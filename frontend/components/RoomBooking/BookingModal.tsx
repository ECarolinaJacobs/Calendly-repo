import { useEffect, useState } from "react";
import '../../src/css/BookingPage.css';
import BookRoom from '../../src/api/book-room';
import type { Room, BookingModalProp } from './bookingTypes';

const BookingModal = ({ setOpenModal, room, startIso, endIso } : BookingModalProp) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleRoomClick = async (room: Room) => {
        setSelectedRoom(room);
        console.log("Selected room:", room);

        try {
            const result = await BookRoom({
            RoomId: room.id,
            StartTime: startIso,
            EndTime: endIso
        })
        setSuccess(true);
        console.log("Booking added:", result)
        }
        catch (error) {
            setErrorMessage("Room is already booked");
            console.log("Booking failed", error);
        }
    }

    useEffect(() => {
        if (success || errorMessage === "Room is already booked") {
            {setTimeout(() => {
                setOpenModal(false)
                clearTimeout
            }, 2000)}
        }
    })


    return (
        <div className="modal-wrapper">
            {!success ?
            <div className="modal-content">
                {errorMessage && 
                (<div className="booking-failed-wrapper">
                    <div className="booking-failed-content">
                        <div className="booking-failed-text">
                            {errorMessage}
                        </div>
                    </div>
                </div>)}
                <div className="query">
                    Would you like to book this room?
                </div>
                <div className="modal-booking-details">
                    <p>- {room.name}</p>
                    <p>Location: {room.floor}, {room.location}</p>
                    <p>Facilities: {room.description}</p>
                </div>
                <div className="query-options">
                    <button className="query-confirm"
                    onClick={() => {
                        handleRoomClick(room);
                    }}>
                        Yes
                    </button>
                    <button className="query-deny"
                    onClick={() =>
                        setOpenModal(false)}>
                        No
                    </button>
                </div>
            </div>
            : (
                <div className="booking-confirmation-wrapper">
                    <div className="booking-confirmation-content">
                        <div className="booking-confirmation-text">
                            Room booking confirmed
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookingModal;