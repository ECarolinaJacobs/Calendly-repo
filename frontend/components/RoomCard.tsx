import '../src/pages/NewBookingPage.css';

const RoomCard = () => {

    return (
        <div className='card-wrapper'>
            <div className="room-view">
                <div className='room-image'>
                    <img src="public/room.jpg" alt="room picture" />
                </div>
                <div className='room-title'>
                    Placeholder
                    <div className='room-location'>
                        <p>Placeholder location 📍</p>
                    </div>
                    <div className='room-info'>
                        <p>Placeholder info</p>
                    </div>
                    <div className='timeslot'>
                        9:00-12:00
                    </div>
                    <button className='book-button'>
                        Book this room
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RoomCard;