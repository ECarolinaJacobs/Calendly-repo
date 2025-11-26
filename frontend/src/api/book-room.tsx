type BookingParams = {
    RoomId: number;
    EmployeeId: number;
    BookingDate: string;
    StartTime: string;
    EndTime: string;
};

export default async function BookRoom({
    RoomId,
    EmployeeId,
    BookingDate,
    StartTime,
    EndTime
}: BookingParams) {
    const url = "http://localhost:5167/api/bookings/start";
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                RoomId,
                EmployeeId,
                BookingDate,
                StartTime,
                EndTime
            }),
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (error: any) {
        console.error(error.message);
    }
}