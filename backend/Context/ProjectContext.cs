using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Context;

public class ProjectContext : DbContext
{
    public ProjectContext(DbContextOptions<ProjectContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; } = null!;
    public DbSet<Room> Rooms { get; set; } = null!;
    public DbSet<RoomBooking> RoomBookings { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RoomBooking>()
        .HasOne(rb => rb.Room)
        .WithMany(rb => rb.RoomBookings)
        .HasForeignKey(rb => rb.RoomId);

        modelBuilder.Entity<RoomBooking>()
        .HasOne(rb => rb.Employee)
        .WithMany(rb => rb.RoomBookings)
        .HasForeignKey(rb => rb.EmployeeId);
    }
}