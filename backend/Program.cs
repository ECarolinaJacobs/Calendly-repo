using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Context;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Services;


var builder = WebApplication.CreateBuilder(args);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});


// Add Controllers and API Explorer for Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure In-Memory Databases
builder.Services.AddDbContext<ProjectContext>(opt =>
    opt.UseInMemoryDatabase("ProjectDB"));

builder.Services.AddDbContext<EventContext>(opt =>
    opt.UseInMemoryDatabase("EventDB"));

// Add Application Services
builder.Services.AddScoped<RoomBookingService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<TodoApi.Services.PointsService>();
builder.Services.AddScoped<TodoApi.Services.EventService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<OfficeAttendanceService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ReviewService>();

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? string.Empty))
        };
    });

var app = builder.Build();


// Database Seeding
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ProjectContext>();
    var eventContext = scope.ServiceProvider.GetRequiredService<EventContext>();

    // add admin and employees
    context.Employees.Add(new Employee
    {
        Id = 2,
        Name = "Admin",
        Email = "admin@test.com",
        Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
        IsAdmin = true,
        Coins = 0
    });

    context.Employees.Add(new Employee { Id = 1, Name = "Alice", Email = "test", Password = "test" });
    context.Employees.Add(new Employee { Id = 3, Name = "Bob", Email = "bob@bob.com", Password = BCrypt.Net.BCrypt.HashPassword("test"), IsAdmin = false, Coins = 0 });

    context.Rooms.Add(new Room { Id = 1, Name = "Meeting room 1", Floor = "Floor 1", Location = "West Building", Description = "Includes smartboard" });
    context.Rooms.Add(new Room { Id = 2, Name = "Meeting room 2", Floor = "Floor 1", Location = "South Building", Description = "Whiteboard and conference phone" });
    context.Rooms.Add(new Room { Id = 3, Name = "Meeting room 3", Floor = "Floor 1", Location = "North Building", Description = "Natural light and seating for 6" });
    context.Rooms.Add(new Room { Id = 4, Name = "Conference room A", Floor = "Floor 2", Location = "North Building", Description = "Projector and large table" });
    context.Rooms.Add(new Room { Id = 5, Name = "Conference room B", Floor = "Floor 2", Location = "West Building", Description = "Video conferencing ready" });
    context.Rooms.Add(new Room { Id = 6, Name = "Training room 1", Floor = "Floor 3", Location = "East Building", Description = "Multiple desks and monitors" });
    context.Rooms.Add(new Room { Id = 7, Name = "Training room 2", Floor = "Floor 3", Location = "South Building", Description = "Workshop-ready with whiteboard" });
    context.Rooms.Add(new Room { Id = 8, Name = "Huddle room 1", Floor = "Floor 3", Location = "West Building", Description = "Compact space with screen" });
    context.Rooms.Add(new Room { Id = 9, Name = "Huddle room 2", Floor = "Floor 2", Location = "North Building", Description = "Quick meeting setup" });
    context.Rooms.Add(new Room { Id = 10, Name = "Executive meeting room", Floor = "Floor 1", Location = "East Building", Description = "Includes smartboard and projector" });

    context.RoomBookings.Add(new RoomBooking { Id = 1, RoomId = 1, EmployeeId = 1, StartTime = "2025-12-30T09:00:00.000Z", EndTime = "2025-12-12T17:00:00.000Z" });
    context.RoomBookings.Add(new RoomBooking { Id = 2, RoomId = 2, EmployeeId = 1, StartTime = "2025-12-30T09:00:00.000Z", EndTime = "2025-12-12T17:00:00.000Z" });

    context.SaveChanges();

    var pastEvent = new Event
    {
        Id = 1,
        Title = "Past Event - Team building",
        Description = "Fun activities",
        Image = "",
        StartDate = DateTime.UtcNow.AddDays(-7),
        EndDate = DateTime.UtcNow.AddDays(-7).AddHours(2)
    };
    eventContext.Events.Add(pastEvent);
    eventContext.SaveChanges();
    var bobAttendee = new Attendee
    {
        Id = 1,
        Name = "Bob",
        Avatar = null,
        EmployeeId = 3,
        EventId = 1
    };
    eventContext.Attendees.Add(bobAttendee);
    eventContext.SaveChanges();
    Console.WriteLine("Database seeses with test past event");

    var futureEvent = new Event
    {
        Id = 2,
        Title = "Future Event - Team building",
        Description = "Fun activities",
        Image = "",
        StartDate = DateTime.UtcNow.AddDays(+7),
        EndDate = DateTime.UtcNow.AddDays(+7).AddHours(2)
    };
    eventContext.Events.Add(futureEvent);
    eventContext.SaveChanges();
    var bobAttendeeFuture = new Attendee
    {
        Id = 2,
        Name = "Bob",
        Avatar = null,
        EmployeeId = 3,
        EventId = 2
    };
    eventContext.Attendees.Add(bobAttendeeFuture);
    eventContext.SaveChanges();
    Console.WriteLine("Database seeses with test future event");
}

// Configure the HTTP request pipeline.
app.UseCors("CorsPolicy");

if (app.Environment.IsDevelopment())
{
    // Use the standard Swagger configuration
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();