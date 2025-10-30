import "./DashboardPage.css";

export default function DashboardPage() {
  const today = new Date();
  const currentDay = today.getDate();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let startDay = new Date(year, month, 1).getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

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

  const userName = "Elena"; /*placeholder*/
  return (
    <div className="dashboard-page">
      {/* NOTE: hier changes */}
      <div className="dashboard-banner">
        <div className="calendly-label">Calendly</div>
        <header className="user-greeting">
          <h1>Hello, {userName}!</h1>
        </header>
      </div>

      <div className="dashboard-grid">
        <aside className="left-panel-container">
          <div className="left-panel-wrapper">
            {/*NOTE: Hier een nieuwe left-panel-wrapper toegevoegd voor vertical alignment */}
            <button className="sidepanel-button">Dashboard</button>
            <button className="sidepanel-button">Book Room</button>
            <button className="sidepanel-button">Events</button>
          </div>
        </aside>

        <div className="main-content">
          <div className="content-row">
            <section className="timetable-box">
              <h3 className="timetable-title"></h3><h3>Today's Timetable</h3>
              <div className="timetable-list">
                {notifications.map((note, index) => {
                  const [title, time] = note.split(" at ");
                  return (
                    <div key={index} className="timetable-item">
                      <p>{title}</p>
                      <span>{time}</span>
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
                <h2 className="calendar-title">
                  {monthName} {year}
                </h2>
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
                        return (
                          <div
                            key={index}
                            className={`calendar-day ${isToday ? "today" : ""}`}
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
