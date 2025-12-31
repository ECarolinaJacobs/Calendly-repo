//elena
namespace TodoApi.Models;
///<summary>
/// shows employee's office attendance booking 
/// Office rule: an employee cannot book itsself for the same day twice
/// </summary>
/// 
public class OfficeAttendance
{
    public long Id { get; set; }
    public long EmployeeId { get; set; }
    public Employee Employee {get; set;} = null!;
    public DateTime Date { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

}
