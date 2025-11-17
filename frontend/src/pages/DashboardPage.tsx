import "./DashboardPage.css";

export default function DashboardPage() {
  const today = new Date();
  const currentDay = today.getDate();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let startDay = new Date(year, month, 1).getDay();

  const calendarDays = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthName = today.toLocaleDateString("default", { month: "long" });
  const notifications = [
    "Meeting with the team at 10:00",
    "Sprint review at 13:00",
    "Collab event at 16:00",
  ];

  const hours = Array.from({ length: 11 }, (_, i) => i + 8);
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const userName = "Elena"; /*placeholder*/
  return (
    <div className="dashboard-page">
      <div className="dashboard-banner">
        <div className="calendly-label">Calendly</div>
        <header className="user-greeting">
          <h1>Hello, {userName}!</h1>
        </header>
      </div>

      <div className="dashboard-grid">
        <aside className="left-panel-container">
          <div className="left-panel-wrapper">
            <button className="sidepanel-button">Dashboard</button>
            <button className="sidepanel-button">Book Room</button>
            <button className="sidepanel-button">Events</button>
          </div>
        </aside>
        <div className="main-content">
          <section className="timetable-box">
            <h3 className="timetable-title">{dayName}, {formattedDate}</h3>
            <div className="timetable-hours">
              {hours.map((hour) => {
                const timeStr = `${hour}:00`;
                const event = notifications.find(note => note.includes(timeStr));
                const eventTitle = event ? event.split(" at ")[0] : null;
                return (
                  <div key={hour} className="timetable-hour-row">
                    <div className="hour-label">{timeStr}</div>
                    <div className="hour-content">
                      {eventTitle && (
                        <div className="hour-event">{eventTitle}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <div className="calendar-column">
            <section className="events-box">
              <h3>Upcoming Events!</h3>
            </section>
            <main className="calendar-container-month">
              <div className="calendar-title-wrapper">
                <h2 className="calendar-title">
                  {monthName} {year}
                </h2>
                <div className="calendar-nav">
                  <button className="calendar-nav-button"></button>
                  <button className="calendar-nav-button"></button>
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
                    {calendarDays.map((day, index) => {
                      const isToday = day === currentDay;
                      const isEmpty = day === null;
                      return (
                        <div
                          key={index}
                          className={`calendar-day ${isToday ? "today" : ""} ${isEmpty ? "empty" : ""}`}
                        >
                          {day ?? ""}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <aside className="right-panel">
          <div className="profile-box"></div>
          <header className="profile-name">
            <h1>{userName}</h1>
          </header>
          <div className="notification-box">
            <h1>Notifications!</h1>
          </div>
        </aside>
      </div>
    </div>
  );
}

