using TodoApi.Models;

namespace TodoApi;

public class RoomBooking 
{
    public long Id { get; set; }

    public long RoomId { get; set; }
    public long EmployeeId { get; set; }
    public Room? Room { get; set; }
    public Employee? Employee { get; set; }

    public string BookingDate { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
}