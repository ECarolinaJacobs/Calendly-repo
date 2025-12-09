import { useState } from "react";
import FilterRooms from "../../src/api/filter-rooms";
import ResetFiltersButton from "./ResetFiltersButton.tsx";

const RoomFiltering = ({setRooms} : any) => {
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const [selectedStarttime, setSelectedStarttime] = useState("");
    const [selectedEndtime, setSelectedEndtime] = useState("");


    const floors = ["Floor 1", "Floor 2", "Floor 3"];
    
    const startTimes = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00"
    ];

    const endTimes = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00"
    ];

    const handleClick = () => {
        if ()
        {
            
        }
        const startIso = new Date(`${selectedDate}T${selectedStarttime}:00Z`).toISOString();
        const endIso = new Date(`${selectedDate}T${selectedEndtime}:00Z`).toISOString();
    }

    return (
        <div className="filter-box">
            <div className="filters">
                <select className="floor-select" value={selectedFloor} onChange={(e : any) => setSelectedFloor(e.target.value)}>
                    <option value="">Select floor</option>
                    {floors.map((floor : any) => (
                        <option>{floor}</option>
                    ))}
                </select>
                <input type="date"
                    className="date-select"
                    value={selectedDate}
                    min="2025-01-01"
                    max="2026-01-01" 
                    onChange={(e : any) => setSelectedDate(e.target.value)}/>

                <select
                    className="starttime-select"
                    value={selectedStarttime}
                    onChange={(e : any) => setSelectedStarttime(e.target.value)}>
                    <option value="">Select start time</option>
                    {startTimes.map((time) => (
                        <option>{time}</option>
                    ))}
                </select>

                <select
                    className="endtime-select"
                    value={selectedEndtime}
                    onChange={(e : any) => setSelectedEndtime(e.target.value)}>
                    <option value="">Select end time</option>
                    {endTimes.map((time) => (
                        <option>{time}</option>
                    ))}
                </select>

                <div className="confirm-filter-wrapper">
                    <ResetFiltersButton className="reset-filters-button"
                    setRooms={setRooms}
                    setSelectedFloor={setSelectedFloor}
                    setSelectedDate={setSelectedDate}/>
                    <button className="filter-button"
                    onClick={async () => 
                    {
                        const filteredRooms = await FilterRooms(selectedFloor, startIso, endIso);
                        setRooms(filteredRooms);
                    }}>View Rooms</button>
                </div>
            </div>
        </div>
    )
}

export default RoomFiltering;