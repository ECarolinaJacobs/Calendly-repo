namespace TodoApi.DTOs;
//elena
///<summary>
/// request object for creating new attendance
/// </summary>
public record CreateOfficeAttendanceRequest
{
    public DateTime Date {get; init;}

}