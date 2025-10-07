public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int Coins { get; set; } = 0;
        public bool IsAdmin { get; set; } = false; // Admin flag
        
        // Foreign key and navigation property for current skin
        public int? CurrentSkinId { get; set; }
        public Skin? CurrentSkin { get; set; }
        
        // Navigation properties (configured in OnModelCreating)
        public ICollection<EventCheckin> EventCheckins { get; set; } = new List<EventCheckin>();
        public ICollection<EmployeeFriend> FriendsSent { get; set; } = new List<EmployeeFriend>();
        public ICollection<EmployeeFriend> FriendsReceived { get; set; } = new List<EmployeeFriend>();
        public ICollection<EmployeeSkin> OwnedSkins { get; set; } = new List<EmployeeSkin>();
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
