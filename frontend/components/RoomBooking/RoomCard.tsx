import '../../src/pages/BookingPage.css';
import { useState } from 'react';
import BookingModal from '../RoomBooking/BookingModal';

type Room = {
    id: number,
    name: string,
    floor: string,
    capacity: number,
    availability: string
}

type RoomProp = {
    room: Room
    startIso: string,
    endIso: string
}

const RoomCard = ({room, startIso, endIso} : RoomProp) => {
    const [openModal, setOpenModal] = useState(false);

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
                    <button className='book-button' onClick={() => setOpenModal(true)}>
                        Book this room
                    </button>
                </div>
            </div>
            { openModal &&
            <BookingModal
            setOpenModal={setOpenModal}
            room={room}
            startIso={startIso}
            endIso={endIso}/>}
        </div>
    )
}

export default RoomCard;