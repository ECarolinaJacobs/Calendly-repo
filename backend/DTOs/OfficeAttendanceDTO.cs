namespace TodoApi.DTOs;
///<summary>
/// dto for attendance information
/// used for get requests (returning attendance to frontend)
/// </summary>
public record OfficeAttendanceDto
{
    public long Id { get; init; }
    public long EmployeeId { get; init; }
    public string EmployeeName { get; init; } = string.Empty;
    public DateTime Date { get; init; }
}
