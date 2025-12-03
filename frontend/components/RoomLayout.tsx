import { useState, useEffect } from "react";
import BookRoom from '../src/api/book-room.tsx';

type Room = {
    id: number,
    name: string,
    floor: string,
    capacity: number,
    availability: string
}

const RoomLayout = ({ currentRooms, setRooms } : any) => {
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
    };

    return (
        <table className="booking-table">
            <thead>
                <tr>
                    <th>Rooms</th>
                    <th>Capacity</th>
                    <th>Availability</th>
                </tr>
            </thead>
            <tbody>
                {currentRooms.map((room : Room) => (
                    <tr
                        key={room.name}
                        className={room === selectedRoom ? 'selected-room' : ''}
                        onClick={() => handleRoomClick(room)}
                        style={{ cursor: 'pointer' }}>
                        <td>{room.name}</td>
                        <td>{room.capacity} persons</td>
                        <td>{room.availability}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default RoomLayout;