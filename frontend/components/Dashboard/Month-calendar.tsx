import type { MonthCalendarProps } from "../../src/types/dashboard.types";

export function MonthCalendar({ fullCal, daysOfWeek, today, events, hasEventsOnDate }: MonthCalendarProps) {
    return (
        <main className="calendar-container-month">
            <div className="calendar-title-wrapper">
                <h2 className="calendar-title">
                    {fullCal.monthName} {fullCal.year}
                </h2>
                <div className="calendar-nav">
                    <button onClick={fullCal.prevMonth} className="calendar-nav-button">
                        ‹
                    </button>
                    <button onClick={fullCal.nextMonth} className="calendar-nav-button">
                        ›
                    </button>
                </div>
            </div>
            <div className="calendar-box">
                <div className="calendar">
                    <div className="calendar-header">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="calendar-header-day">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="calendar-grid">
                        {fullCal.calendarDays.map((day: number | null, index: number) => {
                            if (day === null) {
                                return <div key={index} className="calendar-day-empty"></div>;
                            }
                            const isToday =
                                day === today.getDate() &&
                                fullCal.month === today.getMonth() &&
                                fullCal.year === today.getFullYear();
                            const hasEvent = hasEventsOnDate(events, fullCal.year, fullCal.month, day);
                            return (
                                <div
                                    key={index}
                                    className={`calendar-day ${isToday ? "today" : ""} ${hasEvent ? "has-event" : ""}`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </main>
    );
}

