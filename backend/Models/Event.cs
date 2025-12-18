namespace TodoApi.Models;

public class Event
{
    public long Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public string? Image { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public ICollection<Attendee> Attendees { get; set; } = new List<Attendee>();
}
