import { useState, useEffect } from "react";
import BookRoom from '../api/book-room';
import RoomCard from "../../components/RoomCard";
import '../pages/NewBookingPage.css';

type Room = {
    id: number,
    name: string,
    floor: string,
    capacity: number,
    availability: string
}

const RoomLayout = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    useEffect(() => {
        async function fetchRooms() {
            const res = await fetch('http://localhost:5167/api/rooms');
            const data = await res.json();
            setRooms(data);
        }

        fetchRooms();
    }, []);

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room);
        console.log("Selected room:", room);

        const currentDate = new Date().toISOString();

        BookRoom({
            RoomId: room.id,
            EmployeeId: 1,
            BookingDate: currentDate,
            StartTime: "09:00:00",
            EndTime: "12:00:00"
        })
    }

    return (
        <div className="room-list">
            {rooms.map((room) => (
                <RoomCard
                room={room}/>
            ))}
        </div>
    )
}

export default RoomLayout;