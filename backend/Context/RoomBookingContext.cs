using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Context;

public class RoomBookingContext : DbContext
{
    public RoomBookingContext(DbContextOptions<RoomBookingContext> options)
        : base(options)
    {
    }
    
    public DbSet<RoomBooking> RoomBookings { get; set; } = null!;
}