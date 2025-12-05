import { useEffect, useState } from "react";
import type { Event } from "../../components/EventDrawer/types";
import { DrawerOverlay } from "../../components/EventDrawer/DrawerOverlay";
import { DrawerContent } from "../../components/EventDrawer/DrawerContent";
import "./DashboardPage.css";
import { useNavigate } from "react-router-dom";

import {
  IoHomeOutline,
  IoBusinessOutline,
  IoCalendarClearOutline,
  IoMenu,
  IoClose,
  IoPersonOutline,
  IoBookmarksOutline,
} from "react-icons/io5";

/*helper function*/
function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/*returns true if the day contains an event*/
function hasEventsOnDate(events: Event[], year: number, month: number, day: number) {
  return events.some(event => {
    if (!event.startDate) return false;
    const d = new Date(event.startDate);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day
    );
  });
}




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
  /*handle item event */
  const handleAddEvent = () => {
    if (!newEventTitle || !newEventTime) return;
    const [hour, minute] = newEventTime.split(":");
    const startDate = new Date(selectedDate);
    startDate.setHours(Number(hour), Number(minute), 0);
    const newEvent: Event = {
      title: newEventTitle,
      description: "",
      image: "",
      startDate: startDate.toISOString(),
      endDate: new Date(startDate.getTime() + 60 * 60 * 1000).toISOString(),
      attendees: [],
    };
    setEvents((prev) => [...prev, newEvent]);
    setNewEventTitle("");
    setNewEventTime("");
    setShowAddEventModal(false);
  };
  /* sidebar */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  /*timetable dropdown calendar state */
  const [isTimetableCalendarOpen, setIsTimetableCalendarOpen] = useState(false);
  const dropdownCal = useCalendar(); //timetable calendar
  const fullCal = useCalendar(); //month calendar
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  /* event drawer state */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [copied, setCopied] = useState(false);

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem("timetableEvents");
    return saved ? JSON.parse(saved) : [];
  });
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);
  const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const userName = "Elena";
  /*add event to timetable*/
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
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
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("timetableEvents", JSON.stringify(events));
  }, [events]);
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
            onClick={() => {
              setActiveItem("rooms");
              navigate("/booking");
            }}
          >
            <span className="icon"><IoBusinessOutline /></span>
            {sidebarOpen && <span className="label">Rooms</span>}
          </li>
          <li
            className={`sidebar-item ${activeItem === "my-bookings" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("my-bookings");
              navigate("/my-bookings");
            }}
          >
            <span className="icon">
              <IoBookmarksOutline />
            </span>
            {sidebarOpen && <span className="label">My Bookings</span>}
          </li>
          <li
            className={`sidebar-item ${activeItem === "events" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("events");
              navigate("/events/:event");
            }}
          >
            <span className="icon">
              <IoCalendarClearOutline />
            </span>
            {sidebarOpen && <span className="label">Events</span>}
          </li>
        </ul>
        <div
          className={`sidebar-item ${activeItem === "profile" ? "active" : ""}`}
          onClick={() => setActiveItem("profile")}
        >
          <span className="icon"><IoPersonOutline /></span>
          {sidebarOpen && <span className="label">Profile</span>}
        </div>
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
                          {daysOfWeek.map((day) => (
                            <div key={day} className="calendar-header-day">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="calendar-grid">
                          {dropdownCal.calendarDays.map((day, index) => {
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
                        if (day === null) {
                          return <div key={index} className="calendar-day empty"></div>;
                        }
                        const isToday =
                          day === today.getDate() &&
                          fullCal.month === today.getMonth() &&
                          fullCal.year === today.getFullYear();
                        const hasEvent = hasEventsOnDate(events, fullCal.year, fullCal.month, day);
                        return (
                          <div
                            key={index}
                            className={`calendar-day ${isToday ? "today" : ""} ${hasEvent ? "has-event" : ""
                              }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </main>
            </div>
            {showAddEventModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Add Item for {selectedDate.toLocaleDateString()}</h3>
                  <input
                    type="text"
                    placeholder="Item title"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                  />
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                  />
                  <div className="modal-buttons">
                    <button onClick={handleAddEvent}>Add</button>
                    <button onClick={() => setShowAddEventModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
