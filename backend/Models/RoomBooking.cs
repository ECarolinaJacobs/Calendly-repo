using TodoApi.Models;

namespace TodoApi;

public class RoomBooking 
{
    public long Id { get; set; }

    public long RoomId { get; set; }
    public long EmployeeId { get; set; }
    public Room? Room { get; set; }
    public Employee? Employee { get; set; }

    public required string BookingDate { get; set; }
    public required string StartTime { get; set; }
    public required string EndTime { get; set; }
}