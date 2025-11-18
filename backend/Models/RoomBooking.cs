namespace TodoApi;

public class RoomBooking 
{
    public long RoomId { get; set; }
    // public long UserId { get; set; }
    public DateOnly BookingDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
}