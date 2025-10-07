public class EventCheckin
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int EventId { get; set; }
        public string QrCodeUsed { get; set; } = string.Empty;
        public int CoinsEarned { get; set; }
        public DateTime CheckinTime { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Employee? Employee { get; set; }
        public Event? Event { get; set; }
    }