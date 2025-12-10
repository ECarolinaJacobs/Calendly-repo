import { useEffect, useState } from "react";
import '../../src/pages/BookingPage.css';
import BookRoom from '../../src/api/book-room';

type Room = {
    id: number,
    name: string,
    floor: string,
    capacity: number,
    availability: string
}

type BookingModalProp = {
    setOpenModal: (open: boolean) => void,
    room: Room
    startIso: string,
    endIso: string
}

const BookingModal = ({ setOpenModal, room, startIso, endIso } : BookingModalProp) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [success, setSuccess] = useState(false);

    const handleRoomClick = async (room: Room) => {
        setSelectedRoom(room);
        console.log("Selected room:", room);

        try {
            const result = await BookRoom({
            RoomId: room.id,
            StartTime: startIso,
            EndTime: endIso
        })
        console.log("Booking added:", result)
        }
        catch (error) {
            console.log("Booking failed", error);
        }
    }

    useEffect(() => {
        if (success) {
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
                <div className="query">
                    Would you like to book this room?
                </div>
                <div className="modal-booking-details">
                    <p>- {room.name}</p>
                    <p>Location: {room.floor}</p>
                    <p>Facilities: </p>
                </div>
                <div className="query-options">
                    <button className="query-confirm"
                    onClick={() => {
                        handleRoomClick(room);
                        setSuccess(true);
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