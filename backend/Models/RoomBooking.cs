using System.Text.Json.Serialization;
using TodoApi.Models;

namespace TodoApi.Models;

public class RoomBooking 
{
    public long Id { get; set; }

    public long RoomId { get; set; }
    public long EmployeeId { get; set; }

    [JsonIgnore]
    public Room? Room { get; set; }
    [JsonIgnore]
    public Employee? Employee { get; set; }

    public string StartTime { get; set; }
    public string EndTime { get; set; }
}