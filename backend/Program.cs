using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Context;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TodoApi;

var builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<ProjectContext>(opt =>
    opt.UseInMemoryDatabase("ProjectDB"));

builder.Services.AddScoped<RoomBookingService>();
builder.Services.AddScoped<RoomService>();

builder.Services.AddDbContext<EventContext>(opt =>
    opt.UseInMemoryDatabase("EventDB"));

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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ProjectContext>();
    //adding admin
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
    context.Employees.Add(new Employee { Id = 3, Name="Bob", Email="bob@bob.com", Password=BCrypt.Net.BCrypt.HashPassword("test"), IsAdmin=false, Coins=0});

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

    context.RoomBookings.Add(new RoomBooking {Id = 1, RoomId = 1, EmployeeId = 1, StartTime = "2025-12-30T09:00:00.000Z", EndTime = "2025-12-12T17:00:00.000Z"});
    context.RoomBookings.Add(new RoomBooking {Id = 2, RoomId = 2, EmployeeId = 1, StartTime = "2025-12-30T09:00:00.000Z", EndTime = "2025-12-12T17:00:00.000Z"});

    context.SaveChanges();
}

app.UseCors("CorsPolicy");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();