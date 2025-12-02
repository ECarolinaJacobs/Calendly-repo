import { useState } from 'react';
import './BookingPage.css';
import Pagination from '../../components/Pagination.tsx';
import RoomFiltering from '../../components/RoomFiltering.tsx';
import RoomLayout from "../../components/RoomLayout.tsx";

type Room = {
    id: number,
    name: string,
    floor: string,
    capacity: number,
    availability: string
}

export default function BookingLayout() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const roomsPerPage = 8;
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

    return (
        <div className="booking-page">
            <div className="booking-box">
                <h1 className="title">Book a room</h1>

                <RoomFiltering
                setRooms={setRooms}/>
                
                <RoomLayout
                currentRooms={currentRooms}
                setRooms={setRooms}/>

                <div className="available-room-layout">
                    <Pagination
                        totalRooms={rooms.length}
                        roomsPerPage={roomsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    )
}