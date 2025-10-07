public class Skin
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Price { get; set; }
        public string? ImageUrl { get; set; }
        
        // Navigation properties
        public ICollection<EmployeeSkin> OwnedBy { get; set; } = new List<EmployeeSkin>();
    }