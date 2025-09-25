using Microsoft.EntityFrameworkCore;

// Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<UserDb>(opt =>
    opt.UseSqlite("Data Source=calendly.db"));

var app = builder.Build();

// Ensure database and tables are created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<UserDb>();
    db.Database.EnsureCreated();
}

// API endpoints
app.MapGet("/users", async (UserDb db) =>
    await db.Users.ToListAsync());

app.MapPost("/register", async (User user, UserDb db) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/register/{user.Id}", user);
});

app.Run();
