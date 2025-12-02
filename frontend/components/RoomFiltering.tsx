import { useState } from "react";

const RoomFiltering = () => {
    const [selectedFloor, setSelectedFloor] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    let floors = ["Floor 1", "Floor 2", "Floor 3"];

    return (
        <div className="filters">
            <select className="floor-select" onChange={(e : any) => setSelectedFloor(e.target.value)}>
                <option value="">Select floor</option>
                {floors.map((floor : any) => (
                    <option>{floor}</option>
                ))}
            </select>
            <input type="date"
                className="date-select"
                min="2025-01-01"
                max="2026-01-01" 
                onChange={(e : any) => setSelectedDate(e.target.value)}/>
            <button className="filter-button">Filter</button>
        </div>
    )
}

export default RoomFiltering;