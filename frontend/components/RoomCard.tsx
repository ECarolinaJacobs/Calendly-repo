import '../src/pages/NewBookingPage.css';

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
                    <button className='book-button'>
                        Book this room
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RoomCard;