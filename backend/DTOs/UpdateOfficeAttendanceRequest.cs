namespace TodoApi.DTOs;
///<summary>
/// request object for updating existing attendance
/// </summary>
public record UpdateOfficeAttendanceRequest
{
    public DateTime? Date { get; init; }

}
