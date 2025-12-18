namespace TodoApi.Models;

public class Room
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required string Floor { get; set; }
    public int Capacity { get; set; }
    public bool IsBooked { get; set; }

    public List<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();
}