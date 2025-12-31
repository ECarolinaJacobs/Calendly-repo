namespace TodoApi.DTOs;
//elena
///<summary>
/// request object for updating existing attendance
/// </summary>
public record UpdateOfficeAttendanceRequest
{
    public DateTime? Date { get; init; }

}
