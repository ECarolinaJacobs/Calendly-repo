namespace TodoApi.Models;

public class Room
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Floor { get; set; }
    public string Location { get; set; }
    public string Description { get; set; }

    public List<RoomBooking> RoomBookings { get; set; } = new List<RoomBooking>();
}