import { useState } from "react";
import FilterRooms from "../../src/api/filter-rooms";
import ResetFiltersButton from "./ResetFiltersButton.tsx";
import DateFilter from "./DateFilter.tsx";
import FloorFilter from "./FloorFilter.tsx";
import type { RoomFilteringProp, Room, DateTimeFilter } from "./bookingTypes.ts";

// Modularize filters in own components

const RoomFiltering = ({setRooms, setStartIso, setEndIso, setErrorMessage} : RoomFilteringProp) => {
    const [selectedFloor, setSelectedFloor] = useState("");
    const [dateTimeFilters, setDateTimeFilters] = useState<DateTimeFilter>({ selectedDate: "", selectedStarttime: "", selectedEndtime: "" });
    
    const resetFilters = () => {
        setSelectedFloor("");
        setDateTimeFilters({
            selectedDate: "",
            selectedStarttime: "",
            selectedEndtime: ""
        });

        const rooms : Room[] = [];
        setRooms(rooms);

        setErrorMessage("Please set all filters")
    }

    // When button is pressed, convert times to proper format, then displays filtered rooms
    const handleClick = async () => {
        const { selectedDate, selectedStarttime, selectedEndtime } = dateTimeFilters;

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
                <FloorFilter
                value={selectedFloor}
                onChange={setSelectedFloor}/>

                <DateFilter
                value={dateTimeFilters}
                onChange={setDateTimeFilters}/>

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