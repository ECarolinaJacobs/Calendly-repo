import FetchRooms from '../src/api/fetch-rooms.tsx';

const ResetFiltersButton = ({setRooms, setSelectedFloor, setSelectedDate} : any) => {

    return (
        <button className="reset-filters-button"
        onClick={async () => {
            const rooms = await FetchRooms();
            setRooms(rooms);

            setSelectedDate("");
            setSelectedFloor("Select floor");
        }}>
            <img className='refresh-icon' src="public/refresh-icon.png" alt="refresh icon" />
        </button>
    )
}

export default ResetFiltersButton;