using Microsoft.EntityFrameworkCore;

namespace YourApp.Models
{
    public class AppDbContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventCheckin> EventCheckins { get; set; }
        public DbSet<EmployeeFriend> EmployeeFriends { get; set; }
        public DbSet<Skin> Skins { get; set; }
        public DbSet<EmployeeSkin> EmployeeSkins { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Employee-Friend relationship (self-referencing)
            modelBuilder.Entity<EmployeeFriend>()
                .HasOne(ef => ef.Employee)
                .WithMany(e => e.FriendsSent)
                .HasForeignKey(ef => ef.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<EmployeeFriend>()
                .HasOne<Employee>()
                .WithMany(e => e.FriendsReceived)
                .HasForeignKey(ef => ef.FriendId)
                .OnDelete(DeleteBehavior.Restrict);

            // Prevent duplicate friendships
            modelBuilder.Entity<EmployeeFriend>()
                .HasIndex(e => new { e.EmployeeId, e.FriendId })
                .IsUnique();

            // Configure Employee-EventCheckin relationship
            modelBuilder.Entity<EventCheckin>()
                .HasOne(ec => ec.Employee)
                .WithMany(e => e.EventCheckins)
                .HasForeignKey(ec => ec.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Event-EventCheckin relationship
            modelBuilder.Entity<EventCheckin>()
                .HasOne(ec => ec.Event)
                .WithMany(e => e.Checkins)
                .HasForeignKey(ec => ec.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prevent duplicate check-ins
            modelBuilder.Entity<EventCheckin>()
                .HasIndex(e => new { e.EmployeeId, e.EventId })
                .IsUnique();

            // Configure Employee-EmployeeSkin relationship
            modelBuilder.Entity<EmployeeSkin>()
                .HasOne(es => es.Employee)
                .WithMany(e => e.OwnedSkins)
                .HasForeignKey(es => es.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Skin-EmployeeSkin relationship
            modelBuilder.Entity<EmployeeSkin>()
                .HasOne(es => es.Skin)
                .WithMany(s => s.OwnedBy)
                .HasForeignKey(es => es.SkinId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prevent duplicate owned skins
            modelBuilder.Entity<EmployeeSkin>()
                .HasIndex(e => new { e.EmployeeId, e.SkinId })
                .IsUnique();

            // Configure Employee-Transaction relationship
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Employee)
                .WithMany(e => e.Transactions)
                .HasForeignKey(t => t.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Employee-CurrentSkin relationship (optional)
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.CurrentSkin)
                .WithMany()
                .HasForeignKey(e => e.CurrentSkinId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}