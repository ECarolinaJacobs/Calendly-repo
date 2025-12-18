import { useState } from "react";
import FilterRooms from "../../src/api/filter-rooms";
import ResetFiltersButton from "./ResetFiltersButton.tsx";

type RoomFilteringProp = {
    setRooms: any,
    startIso: string,
    endIso: string,
    setStartIso: any,
    setEndIso: any,
    setErrorMessage: any
}

type Room = {
    id: number,
    name: string,
    floor: string,
    location: string,
    description: string
}

// Modularize filters in own components
// pass values to select tags

const RoomFiltering = ({setRooms, startIso, endIso, setStartIso, setEndIso, setErrorMessage} : RoomFilteringProp) => {
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
    "16:00",
    "17:00"
    ];
    
    const resetFilters = () => {
        setSelectedFloor("");
        setSelectedDate("");
        setSelectedStarttime("");
        setSelectedEndtime("");

        const rooms : Room[] = [];
        setRooms(rooms);

        setErrorMessage("Please set all filters")
    }

    const EndTimeLimiter = () => {
        const startTimeIndex = startTimes.indexOf(selectedStarttime);
        startTimes.shift();
        let endTimes = startTimes;
        return endTimes.splice(startTimeIndex);
    }

    const handleClick = async () => {
        if (!selectedFloor || !selectedDate || !selectedStarttime || !selectedEndtime) {
            return;
        }

        let newStartIso = undefined;
        let newEndIso = undefined;
        if (selectedStarttime){
            newStartIso = new Date(`${selectedDate}T${selectedStarttime}:00Z`).toISOString()
            setStartIso(newStartIso);
        }
        if (selectedEndtime){
            newEndIso = new Date(`${selectedDate}T${selectedEndtime}:00Z`).toISOString()
            setEndIso(newEndIso);
        }

        try {
            const result = await FilterRooms(selectedFloor, newStartIso, newEndIso);
            setRooms(result);
            setErrorMessage("");
        }
        catch (error) {
            console.error(error);
        }
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
                    min= {new Date().toISOString().split("T")[0]}
                    max="2026-01-01" 
                    onChange={(e : any) => {
                        const dateInput = e.target.value;
                        const minDate = new Date().toISOString().split("T")[0]

                        if (dateInput >= minDate) {
                            setSelectedDate(dateInput);
                        }
                        else {
                            setSelectedDate(minDate);
                        }
                    }}/>

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
                    {EndTimeLimiter().map((time) => (
                        <option>{time}</option>
                    ))}
                </select>

                <div className="confirm-filter-wrapper">
                    <ResetFiltersButton className="reset-filters-button"
                    onReset={resetFilters}/>

                    <button className="filter-button"
                    onClick={() => handleClick()}
                    >View Rooms</button>
                </div>
            </div>
        </div>
    )
}

export default RoomFiltering;