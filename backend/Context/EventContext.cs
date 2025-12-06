using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Context;

public class EventContext : DbContext
{
    public EventContext(DbContextOptions<EventContext> options)
        : base(options)
    {
    }

    public DbSet<Event> Events { get; set; } = null!;
    public DbSet<Attendee> Attendees { get; set; } = null!;
}
