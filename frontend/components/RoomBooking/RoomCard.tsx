import '../../src/pages/BookingPage.css';
import { useState } from 'react';
import BookRoom from '../../src/api/book-room';

type Room = {
    id: number,
    name: string,
    floor: string,
    capacity: number,
    availability: string
}

type RoomProp = {
    room: Room
}

const RoomCard = ({room} : RoomProp) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);


    const handleRoomClick = async (room: Room) => {
        setSelectedRoom(room);
        console.log("Selected room:", room);

        const currentDate = new Date().toISOString();

        try {
            const result = await BookRoom({
            RoomId: room.id,
            BookingDate: currentDate,
            StartTime: "2025-12-12T09:00:00.000Z",
            EndTime: "2025-12-12T17:00:00.000Z"
        })
        console.log("Booking added:", result)
        }
        catch (error) {
            console.log("Booking failed", error);
        }
    }

    return (
        <div className='card-wrapper'>
            <div className="room-view">
                <div className='room-image'>
                    <img src="public/room.jpg" alt="room picture" />
                </div>
                <div className='room-title'>
                    {room.name}
                    <div className='room-location'>
                        <p>Placeholder location 📍</p>
                    </div>
                    <div className='room-info'>
                        <p>Placeholder info</p>
                    </div>
                    <div className='timeslot'>
                        9:00-12:00
                    </div>
                    <button className='book-button' onClick={() => handleRoomClick(room)}>
                        Book this room
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RoomCard;