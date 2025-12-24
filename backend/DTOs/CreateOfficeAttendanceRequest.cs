namespace TodoApi.DTOs;
///<summary>
/// request object for creating new attendance
/// </summary>
public record CreateOfficeAttendanceRequest
{
    public DateTime Date {get; init;}

}