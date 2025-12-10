import { useState } from "react";
import RoomCard from "../../components/RoomBooking/RoomCard";
// import Pagination from "../../components/Pagination";
import RoomFiltering from "../../components/RoomBooking/RoomFiltering";
import '../pages/BookingPage.css';

type Room = {
    id: number,
    name: string,
    floor: string,
    capacity: number,
    availability: string
}

const BookingPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [startIso, setStartIso] = useState("");
    const [endIso, setEndIso] = useState("");
    // const [currentPage, setCurrentPage] = useState(1);

    // const roomsPerPage = 8;
    // const indexOfLastRoom = currentPage * roomsPerPage;
    // const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    // const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

    return (
        <div>
            <div>
                <RoomFiltering
                setRooms={setRooms}
                startIso={startIso}
                setStartIso={setStartIso}
                endIso={endIso}
                setEndIso={setEndIso}/>
            </div>
            <div className="room-list">
                {rooms.map((room) => (
                    <RoomCard
                    room={room}
                    startIso={startIso}
                    endIso={endIso}
                   />
                ))}
            </div>
            {/* <div>
                <Pagination
                    totalRooms={rooms.length}
                    roomsPerPage={roomsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div> */}
        </div>
    )
}

export default BookingPage;