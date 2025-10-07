public class EmployeeFriend
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int FriendId { get; set; }
        public string Status { get; set; } = "pending"; // pending, accepted, rejected
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Employee? Employee { get; set; }
    }