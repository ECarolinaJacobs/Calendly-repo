import { useState } from "react";

export function useCalendar(initialDate = new Date()) {
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
