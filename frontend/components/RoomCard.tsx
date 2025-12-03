import '../src/pages/NewBookingPage.css';
import { useState } from 'react';
import BookRoom from '../src/api/book-room';

type Room = {
    id: number,
    name: string,
    floor: string,
    capacity: number,
    availability: string
}

type RoomProp = {
    room: Room
    currentRooms: any
}

const RoomCard = ({room, currentRooms} : RoomProp) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);


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