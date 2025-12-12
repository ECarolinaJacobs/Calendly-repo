type Room = {
    id: number,
    name: string,
    floor: string,
    capacity: number,
    availability: string
}

const ResetFiltersButton = ({setRooms, setSelectedFloor, setSelectedDate, setSelectedStarttime, setSelectedEndtime} : any) => {

    return (
        <button className="reset-filters-button"
        onClick={async () => {
            const rooms : Room[] = [];
            setRooms(rooms);

            setSelectedDate("");
            setSelectedFloor("Select floor");
            setSelectedStarttime("Set start time")
            setSelectedEndtime("Set end time")
        }}>
            <img className='refresh-icon' src="public/refresh-icon.png" alt="refresh icon" />
        </button>
    )
}

export default ResetFiltersButton;