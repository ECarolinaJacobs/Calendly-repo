import './BookingPage.css';

export default function BookingLayout() {
    const rooms = [
        { name: "Meeting room 1", capacity: 12, availability: "12:00" },
        { name: "Meeting room 2", capacity: 8, availability: "11:00" }
    ];

    return (
        <div className="booking-page">
            <div className="booking-box">
                <h1 className="title">Book a room</h1>
                <div className="filters">
                    <select className="floor-select" name="floor" id="floor-id">
                        <option value="">Select floor</option>
                        <option value="Floor 1">Floor 1</option>
                        <option value="Floor 2">Floor 2</option>
                        <option value="Floor 3">Floor 3</option>
                    </select>
                    <input type="date"
                        className="date-select"
                        name="date-selector"
                        id="booking-date"
                        min="2025-01-01"
                        max="2026-01-01"/>
                    <button className="filter-button">Filter</button>
                </div>
                <div className="available-room-layout">
                    <table className="booking-table">
                        <tr>
                            <th>Rooms</th>
                            <th>Capacity</th>
                            <th>Availability</th>
                        </tr>
                        <tbody>
                        {rooms.map(room => (
                            <tr key={room.name}>
                            <td>{room.name}</td>
                            <td>{room.capacity} persons</td>
                            <td>{room.availability}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className='page-switcher'>
                        <button className="prev-button">Previous</button>
                        <button className="next-button">Next</button>
                    </div>
                    <p className="page-count">2/2</p>
                </div>
            </div>
        </div>
    )
}