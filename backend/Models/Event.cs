public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string QrCode { get; set; } = string.Empty;
        
        // Navigation properties
        public ICollection<EventCheckin> Checkins { get; set; } = new List<EventCheckin>();
    }