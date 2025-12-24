import '../../src/css/BookingPage.css';
import { useState } from 'react';
import BookingModal from '../RoomBooking/BookingModal';
import type { RoomProp } from './bookingTypes';

const RoomCard = ({room, startIso, endIso} : RoomProp) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div className='card-wrapper'>
            <div className="room-view">
                <div className='room-image'>
                    <img src="/room.jpg" alt="room picture" />
                </div>
                <div className='room-title'>
                    {room.name}
                    <div className='room-location'>
                        <p>📍{room.location}</p>
                    </div>
                    <div className='room-info'>
                        <p>{room.description}</p>
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
