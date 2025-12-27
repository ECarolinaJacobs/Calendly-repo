import type { Event } from "../../components/Events/EventDrawer/types";
import type { Attendance } from "../api/OfficeAttendance";

export interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    activeItem: string;
    setActiveItem: (item: string) => void;
    navigate: (path: string) => void;
}

export interface DashboardBannerProps {
    userName: string;
}

export interface TimetableProps {
    dayName: string;
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    isTimetableCalendarOpen: boolean;
    setIsTimetableCalendarOpen: (open: boolean) => void;
    setShowAddEventModal: (show: boolean) => void;
    dropdownCal: any;
    today: Date;
    daysOfWeek: string[];
    isSameDay: (d1: Date, d2: Date) => boolean;
    hours: number[];
    events: Event[],
    handleEventClick: (event: Event) => void;
}

export interface OfficeAttendanceProps {
  attendances: Attendance[];
  setShowAttendanceModal: (show: boolean) => void;
  openEditModal: (attendance: Attendance) => void;
  handleDeleteAttendance: (id: number) => void;
}

export interface MonthCalendarProps {
    fullCal: any;
    daysOfWeek: string[];
    today: Date;
    events: Event[];
    hasEventsOnDate: (events: Event[], year: number, month: number, day: number) => boolean;
}

export interface AddEventModalProps {
    selectedDate: Date;
    newEventTitle: string;
    setNewEventTitle: (title: string) => void;
    newEventTime: string;
    setNewEventTime: (time: string) => void;
    handleAddEvent: () => void;
    setShowAddEventModal: (show: boolean) => void;
}

export interface AttendanceModalProps {
    editingAttendance: Attendance | null;
    newAttendanceDate: string;
    setNewAttendanceDate: (date: string) => void;
    handleUpdateAttendance: () => void;
    handleAddAttendance: () => void;
    closeAttendanceModal: () => void;
}