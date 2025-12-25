// elena
namespace TodoApi.Models
{
    ///<summary>
    /// User review for an event 
    /// </summary>
    public class Review
    {
        public long Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public long EventId { get; set; }
        public long EmployeeId { get; set; }
        public Event Event { get; set; } = null!;
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeEmail { get; set; } = string.Empty;
    }
}
