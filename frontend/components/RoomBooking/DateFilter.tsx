import { startTimes } from "../../src/constants/booking";

const DateFilter = ({selectedDate, setSelectedDate, selectedStarttime, setSelectedStarttime, selectedEndtime, setSelectedEndtime} : any) => {

    const handleDateSelect = (targetValue : any) => {
        const dateInput = targetValue;
        const minDate = new Date().toISOString().split("T")[0]

        if (dateInput >= minDate) {
            setSelectedDate(dateInput);
        }
        else {
            setSelectedDate(minDate);
        }
    }

    const EndTimeLimiter = () => {
        let startTimesCopy = Array.from(startTimes);
        const startTimeIndex = startTimesCopy.indexOf(selectedStarttime);
        startTimesCopy.shift();
        let endTimes = startTimesCopy;
        return endTimes.splice(startTimeIndex);
    }

    return (
        <div className="date-filters">
            <input type="date"
                className="date-select"
                value={selectedDate}
                min= {new Date().toISOString().split("T")[0]}
                max="2026-01-01" 
                onChange={(e : any) => {handleDateSelect(e.target.value)}}/>

            <select
                className="starttime-select"
                value={selectedStarttime}
                onChange={(e : any) => setSelectedStarttime(e.target.value)}>
                <option>Select start time</option>
                {startTimes.map((time) => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>

            <select
                className="endtime-select"
                value={selectedEndtime}
                onChange={(e : any) => setSelectedEndtime(e.target.value)}>
                <option value="">Select end time</option>
                {EndTimeLimiter().map((time) => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>
        </div>
    )
}

export default DateFilter;