import { useEffect, useState } from "react";
import type { Event } from "../../components/EventDrawer/types";
import { DrawerOverlay } from "../../components/EventDrawer/DrawerOverlay";
import { DrawerContent } from "../../components/EventDrawer/DrawerContent";
import "./DashboardPage.css";
import { useNavigate } from "react-router-dom";
import type { Attendance } from "../api/OfficeAttendance";
import { createAttendance, deleteAttendance, getMyAttendance, updateAttendance } from "../api/OfficeAttendance";
import { useCalendar } from "../../hooks/useCalendarHook";
import { Sidebar } from "../../components/Dashboard/Sidebar";
import { DashboardBanner } from "../../components/Dashboard/Dashboard-banner";
import { Timetable } from "../../components/Dashboard/Timetable";
import { OfficeAttendance } from "../../components/Dashboard/Office-attendance";
import { MonthCalendar } from "../../components/Dashboard/Month-calendar";
import { AttendanceModal } from "../../components/Dashboard/AttendanceModal";
import { AddEventModal } from "../../components/Dashboard/AddEventsModal";

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

export default function DashboardPage() {
  /*handle office attendance booking */
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [newAttendanceDate, setNewAttendanceDate] = useState("");
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);

  useEffect(() => {
    loadAttendances();
  }, []);

  const loadAttendances = async () => {
    try {
      const data = await getMyAttendance();
      setAttendances(data);
    } catch (error) {
      console.error("Failed to load attendances: ", error);
    }
  };

  const handleAddAttendance = async () => {
    if (!newAttendanceDate) return;
    try {
      await createAttendance({ date: newAttendanceDate });
      setNewAttendanceDate("");
      setShowAttendanceModal(false);
      loadAttendances();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create attendance");
    }
  };

  const handleUpdateAttendance = async () => {
    if (!newAttendanceDate || !editingAttendance) return;
    try {
      await updateAttendance(editingAttendance.id, { date: newAttendanceDate });
      setNewAttendanceDate("");
      setEditingAttendance(null);
      setShowAttendanceModal(false);
      loadAttendances();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update attendance");
    }
  };

  const handleDeleteAttendance = async (id: number) => {
    if (
      !confirm("Delete this attendance booking?")
    ) return;
    const success = await deleteAttendance(id);
    if (success) loadAttendances();
  };

  const openEditModal = (attendance: Attendance) => {
    setEditingAttendance(attendance);
    setNewAttendanceDate(attendance.date.split('T')[0]); //only get date not time
    setShowAttendanceModal(true);
  };

  const closeAttendanceModal = () => {
    setShowAttendanceModal(false);
    setEditingAttendance(null);
    setNewAttendanceDate("");
  };

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
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        navigate={navigate}
      />
      {/*main content */}
      <div className={`main-content-area ${sidebarOpen ? "shift" : ""}`}>
        <DashboardBanner userName={userName} />
        <div className="dashboard-grid">
          <div className="main-content">
            <Timetable
              dayName={dayName}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              isTimetableCalendarOpen={isTimetableCalendarOpen}
              setIsTimetableCalendarOpen={setIsTimetableCalendarOpen}
              setShowAddEventModal={setShowAddEventModal}
              dropdownCal={dropdownCal}
              today={today}
              daysOfWeek={daysOfWeek}
              isSameDay={isSameDay}
              hours={hours}
              events={events}
              handleEventClick={handleEventClick}
            />
            {/*full month calendar*/}
            <div className="calendar-column">
              <OfficeAttendance
                attendances={attendances}
                setShowAttendanceModal={setShowAttendanceModal}
                openEditModal={openEditModal}
                handleDeleteAttendance={handleDeleteAttendance}
              />
              <MonthCalendar
                fullCal={fullCal}
                daysOfWeek={daysOfWeek}
                today={today}
                events={events}
                hasEventsOnDate={hasEventsOnDate}
              />
            </div>
            {showAddEventModal && (
              <AddEventModal
                selectedDate={selectedDate}
                newEventTitle={newEventTitle}
                setNewEventTitle={setNewEventTitle}
                newEventTime={newEventTime}
                setNewEventTime={setNewEventTime}
                handleAddEvent={handleAddEvent}
                setShowAddEventModal={setShowAddEventModal}
              />
            )}
          </div>
        </div>
        {/*attendance model needs to be rewritten*/}
        {showAttendanceModal && (
          <AttendanceModal
            editingAttendance={editingAttendance}
            newAttendanceDate={newAttendanceDate}
            setNewAttendanceDate={setNewAttendanceDate}
            handleUpdateAttendance={handleUpdateAttendance}
            handleAddAttendance={handleAddAttendance}
            closeAttendanceModal={closeAttendanceModal}
          />
        )}
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
      </div >
    </div >
  );
}

