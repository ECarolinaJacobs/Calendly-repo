import type { TimetableProps } from "../../src/types/dashboard.types";

export function Timetable({ dayName, selectedDate, setSelectedDate, isTimetableCalendarOpen, setIsTimetableCalendarOpen, setShowAddEventModal,
    dropdownCal, today, daysOfWeek, isSameDay, hours, events, handleEventClick
}: TimetableProps) {
    return (
        <section className="timetable-box" >
            <div className="timetable-header">
                <div className="timetable-header-left">
                    <h2>Timetable</h2>
                    <p>
                        {dayName}
                    </p>
                </div>
                <button
                    className="timetable-date-button"
                    onClick={() => setIsTimetableCalendarOpen(!isTimetableCalendarOpen)}
                >
                    {selectedDate.toLocaleDateString("en-GB")} 📅
                </button>
                <button className="add-event-button" onClick={() => setShowAddEventModal(true)}>+</button>
                {isTimetableCalendarOpen && (
                    <div className="timetable-calendar-dropdown">
                        <div className="calendar-title-wrapper">
                            <h2 className="calendar-title">
                                {dropdownCal.monthName} {dropdownCal.year}
                            </h2>
                            <div className="calendar-nav">
                                <button onClick={dropdownCal.prevMonth} className="calendar-nav-button">
                                    ‹
                                </button>
                                <button onClick={dropdownCal.nextMonth} className="calendar-nav-button">
                                    ›
                                </button>
                            </div>
                        </div>
                        <div className="calendar-box">
                            <div className="calendar">
                                <div className="calendar-header">
                                    {daysOfWeek.map((day: string) => (
                                        <div key={day} className="calendar-header-day">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="calendar-grid">
                                    {dropdownCal.calendarDays.map((day: number, index: number) => {
                                        if (day === null) {
                                            return <div key={index} className="calendar-day empty"></div>;
                                        }
                                        const dateObj = new Date(dropdownCal.year, dropdownCal.month, day);
                                        const isToday = isSameDay(dateObj, today);
                                        const isSelected = isSameDay(dateObj, selectedDate);

                                        return (
                                            <div
                                                key={index}
                                                className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                                                onClick={() => {
                                                    setSelectedDate(dateObj);
                                                    setIsTimetableCalendarOpen(false);
                                                }}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/*timetable hours*/}
            <div className="timetable-hours">
                {hours.map((hour) => {
                    const timeStr = `${hour}:00`;
                    const hourEvents = events.filter((event) => {
                        if (!event.startDate) return false;
                        const startTime = new Date(event.startDate);
                        return (
                            startTime.toDateString() === selectedDate.toDateString() &&
                            startTime.getHours() === hour
                        );
                    });
                    return (
                        <div key={hour} className="timetable-hour-row">
                            <div className="hour-label">{timeStr}</div>
                            <div className="hour-content">
                                {hourEvents.map((event, idx) => (
                                    <div
                                        key={idx}
                                        className="hour-event"
                                        onClick={() => handleEventClick(event)}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section >
    )
}


