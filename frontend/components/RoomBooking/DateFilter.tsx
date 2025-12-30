import { startTimes } from "../../src/constants/booking";
import type { DateTimeFilter, DateTimeValueChanger } from "./bookingTypes";

const DateFilter = ({ value, onChange} : DateTimeValueChanger) => {
    const handleDateSelect = (targetValue : any) => {
        const dateInput = targetValue;
        const minDate = new Date().toISOString().split("T")[0]

        if (dateInput >= minDate) {
            onChange((prev: DateTimeFilter) => ({
                ...prev,
                selectedDate: dateInput
            }))
        }
        else {
            onChange((prev: DateTimeFilter) => ({
                ...prev,
                selectedDate: minDate
            }))
        }
    }

    const EndTimeLimiter = () => {
        let startTimesCopy = Array.from(startTimes);
        const startTimeIndex = startTimesCopy.indexOf(value.selectedStarttime);
        startTimesCopy.shift();
        let endTimes = startTimesCopy;
        return endTimes.splice(startTimeIndex);
    }

    return (
        <div className="date-filters">
            <input type="date"
                className="date-select"
                value={value.selectedDate}
                min= {new Date().toISOString().split("T")[0]}
                max="2027-01-01" 
                onChange={(e : any) => {handleDateSelect(e.target.value)}}/>

            <select
                className="starttime-select"
                value={value.selectedStarttime}
                onChange={(e : any) => onChange((prev: DateTimeFilter) => ({
                    ...prev,
                    selectedStarttime: e.target.value
                }))}>
                <option>Select start time</option>
                {startTimes.map((time) => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>

            <select
                className="endtime-select"
                value={value.selectedEndtime}
                onChange={(e : any) => onChange((prev: DateTimeFilter) => ({
                    ...prev,
                    selectedEndtime: e.target.value
                }))}>
                <option value="">Select end time</option>
                {EndTimeLimiter().map((time) => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>
        </div>
    )
}

export default DateFilter;