namespace TodoApi.Models;

public class Attendee
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public string? Avatar { get; set; }
    public long? EmployeeId { get; set; }
    public Employee? Employee { get; set; }
    public int EventId { get; set; }
    public Event? Event { get; set; }
}