import { useState } from "react";
import type { Event } from "../../components/EventDrawer/types";
import { DrawerOverlay } from "../../components/EventDrawer/DrawerOverlay";
import { DrawerContent } from "../../components/EventDrawer/DrawerContent";
import "./DashboardPage.css";

import {
  IoHomeOutline,
  IoBusinessOutline,
  IoCalendarClearOutline,
  IoMenu,
  IoClose,
} from "react-icons/io5";

/*embedded calendar hook temporarily embedded, move to seperate hook file*/
function useCalendar(initialDate = new Date()) {
  const [date, setDate] = useState(initialDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const calendarDays = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const nextMonth = () => setDate(new Date(year, month + 1, 1));
  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const monthName = date.toLocaleDateString("default", { month: "long" });
  return {
    date,
    year,
    month,
    monthName,
    calendarDays,
    nextMonth,
    prevMonth,
  };
}
/*hook ends here*/
export default function DashboardPage() {
  /* sidebar */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  /*timetable dropdown calendar state */
  const [isTimetableCalendarOpen, setIsTimetableCalendarOpen] = useState(false);
  const dropdownCal = useCalendar(); //timetable calendar
  const fullCal = useCalendar(); //month calendar
  const today = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  /* event drawer state */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [copied, setCopied] = useState(false);

  const events: Event[] = [
    {
      title: "Meeting with the team",
      description: "Weekly team sync",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
      startDate: `${today.toISOString().split("T")[0]}T10:00:00`,
      endDate: `${today.toISOString().split("T")[0]}T11:00:00`,
      attendees: [],
    },
    {
      title: "Sprint review",
      description: "Review completed sprint tasks",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
      startDate: `${today.toISOString().split("T")[0]}T13:00:00`,
      endDate: `${today.toISOString().split("T")[0]}T14:00:00`,
      attendees: [],
    },
    {
      title: "Collab event",
      description: "Cross-team collaboration",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
      startDate: `${today.toISOString().split("T")[0]}T16:00:00`,
      endDate: `${today.toISOString().split("T")[0]}T17:30:00`,
      attendees: [],
    }
  ]
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const userName = "Elena";
  /*handlers */
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };
  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  /*render*/
  return (
    <div className="dashboard-layout">
      {/*sidebar*/}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <IoClose /> : <IoMenu />}
        </button>
        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${activeItem === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveItem("dashboard")}
          >
            <span className="icon">
              <IoHomeOutline />
            </span>
            {sidebarOpen && <span className="label">Dashboard</span>}
          </li>
          <li
            className={`sidebar-item ${activeItem === "rooms" ? "active" : ""}`}
            onClick={() => setActiveItem("rooms")}
          >
            <span className="icon"><IoBusinessOutline /></span>
            {sidebarOpen && <span className="label">Rooms</span>}
          </li>
          <li
            className={`sidebar-item ${activeItem === "events" ? "active" : ""}`}
            onClick={() => setActiveItem("events")}
          >
            <span className="icon">
              <IoCalendarClearOutline />
            </span>
            {sidebarOpen && <span className="label">Events</span>}
          </li>
        </ul>
      </aside>
      {/*main content */}
      <div className={`main-content-area ${sidebarOpen ? "shift" : ""}`}>
        {/*top banner*/}
        <div className="dashboard-banner">
          <header className="user-greeting">
            <h1>
              Hello, <span className="username">{userName}!</span>
            </h1>
          </header>
        </div>
        <div className="dashboard-grid">
          <div className="main-content">
            {/*timetable*/}
            <section className="timetable-box">
              <div className="timetable-header">
                <div className="timetable-header-left">
                  <h2>Timetable</h2>
                  <p>
                    {dayName}, {formattedDate}
                  </p>
                </div>
                <button
                  className="timetable-date-button"
                  onClick={() => setIsTimetableCalendarOpen(!isTimetableCalendarOpen)}
                >
                  {today.toLocaleDateString("en-GB")} 📅
                </button>
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
                          {daysOfWeek.map((day) => (
                            <div key={day} className="calendar-header-day">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="calendar-grid">
                          {dropdownCal.calendarDays.map((day, index) => {
                            const isToday =
                              day === today.getDate() &&
                              dropdownCal.month === today.getMonth() &&
                              dropdownCal.year === today.getFullYear();
                            return (
                              <div
                                key={index}
                                className={`calendar-day ${isToday ? "today" : day === null ? "empty" : ""
                                  }`}
                              >
                                {day ?? ""}
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
                    const startTime = new Date(event.startDate);
                    return startTime.getHours() === hour;
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
            </section>
            {/*full month calendar*/}
            <div className="calendar-column">
              <section className="events-box">
                <h3>Upcoming Events!</h3>
              </section>
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
                      {fullCal.calendarDays.map((day, index) => {
                        const isToday =
                          day === today.getDate() &&
                          fullCal.month === today.getMonth() &&
                          fullCal.year === today.getFullYear();
                        return (
                          <div
                            key={index}
                            className={`calendar-day ${isToday ? "today" : day === null ? "empty" : ""
                              }`}
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
          {/*right panel*/}
          <aside className="right-panel">
            <div className="profile-box"></div>
            <header className="profile-name">
              <h1>{userName}!</h1>
            </header>
            <div className="notification-box">
              <h1>Notifications!</h1>
            </div>
          </aside>
        </div>
        {/*event drawer*/}
        {selectedEvent && (
          <>
            <DrawerOverlay isOpen={isDrawerOpen} onClose={handleCloseDrawer} />
            <DrawerContent
              isOpen={isDrawerOpen}
              event={selectedEvent}
              copied={copied}
              onClose={handleCloseDrawer}
              onCopyUrl={handleCopyUrl}
            />
          </>
        )}
      </div>
    </div>
  );
}
