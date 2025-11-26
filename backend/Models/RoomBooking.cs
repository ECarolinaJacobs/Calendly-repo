using TodoApi.Models;

namespace TodoApi;

public class RoomBooking 
{
    public long Id { get; set; }

    public long RoomId { get; set; }
    public long EmployeeId { get; set; }
    public Room Room { get; set; }
    public Employee Employee { get; set; }

    public DateOnly BookingDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}