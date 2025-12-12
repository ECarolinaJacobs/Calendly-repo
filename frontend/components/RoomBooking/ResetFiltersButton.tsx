type Room = {
    id: number,
    name: string,
    floor: string,
    location: string,
    description: string
}

const ResetFiltersButton = ({setRooms, setSelectedFloor, setSelectedDate, setSelectedStarttime, setSelectedEndtime, setErrorMessage} : any) => {

    return (
        <button className="reset-filters-button"
        onClick={async () => {
            const rooms : Room[] = [];
            setRooms(rooms);

            setSelectedDate("");
            setSelectedFloor("Select floor");
            setSelectedStarttime("Set start time")
            setSelectedEndtime("Set end time")
            setErrorMessage("Please set all filters")
        }}>
            <img className='refresh-icon' src="public/refresh-icon.png" alt="refresh icon" />
        </button>
    )
}

export default ResetFiltersButton;