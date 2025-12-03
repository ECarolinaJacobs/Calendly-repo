import { useState, useEffect } from "react";
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

    useEffect(() => {
        async function fetchRooms() {
            const res = await fetch('http://localhost:5167/api/rooms');
            const data = await res.json();
            setRooms(data);
        }

        fetchRooms();
    }, [])

    return (
        <div className="room-list">
            {rooms.map((room) => (
                <RoomCard
                room={room}
                setRooms={setRooms}/>
            ))}
        </div>
    )
}

export default RoomLayout;