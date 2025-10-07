public class EmployeeSkin
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int SkinId { get; set; }
        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public Employee? Employee { get; set; }
        public Skin? Skin { get; set; }
    }