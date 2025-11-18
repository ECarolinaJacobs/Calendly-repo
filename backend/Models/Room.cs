namespace TodoApi.Models;

public class Room
{
    public long Id { get; set; }
    public string RoomName { get; set; }
    public int Capacity { get; set; }
    public string IsBooked { get; set; }
}