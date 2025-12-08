namespace TodoApi.Models;

public class Attendee
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public string? Avatar { get; set; }
}