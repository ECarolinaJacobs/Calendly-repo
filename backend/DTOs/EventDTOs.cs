namespace TodoApi.DTOs
{
    public record EventCreateRequest(
        string Title,
        string Description,
        string? Image,
        DateTime? StartDate,
        DateTime? EndDate,
        ICollection<Models.Attendee>? Attendees
    );

    public record JoinEventRequest(
        long EmployeeId,
        string? Avatar
    );

    public record AttendeeDto(
        long Id,
        string Name,
        string? Avatar,
        long? EmployeeId
    );

    public record EventDto(
        long Id,
        string Title,
        string Description,
        string? Image,
        DateTime? StartDate,
        DateTime? EndDate,
        ICollection<AttendeeDto>? Attendees
    );
}
