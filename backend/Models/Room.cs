namespace TodoApi.Models;

public class Room
{
    public long Id { get; set; }
    public string Name { get; set; }
    public string Floor { get; set; }
    public int Capacity { get; set; }

    public List<RoomBooking> RoomBookings { get; set; }
}