using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Context;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Services;


var builder = WebApplication.CreateBuilder(args);

// Configure CORS
builder.Services.AddCors(options => {
    options.AddPolicy("CorsPolicy", builder => {
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

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
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
using(var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<ProjectContext>();

// Adding Employees (including Admin and Bob)
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

// Adding Rooms
context.Rooms.Add(new Room { Id = 1, Name = "Meeting room 1", Floor = "Floor 1", Capacity = 12, IsBooked = false });
context.Rooms.Add(new Room { Id = 2, Name = "Meeting room 2", Floor = "Floor 1", Capacity = 9, IsBooked = false });
context.Rooms.Add(new Room { Id = 3, Name = "Meeting room 3", Floor = "Floor 1", Capacity = 6, IsBooked = false });
context.Rooms.Add(new Room { Id = 4, Name = "Conference room A", Floor = "Floor 2", Capacity = 20, IsBooked = false });
context.Rooms.Add(new Room { Id = 5, Name = "Conference room B", Floor = "Floor 2", Capacity = 18, IsBooked = false });
context.Rooms.Add(new Room { Id = 6, Name = "Training room 1", Floor = "Floor 3", Capacity = 25, IsBooked = false });
context.Rooms.Add(new Room { Id = 7, Name = "Training room 2", Floor = "Floor 3", Capacity = 22, IsBooked = false });
context.Rooms.Add(new Room { Id = 8, Name = "Huddle room 1", Floor = "Floor 3", Capacity = 4, IsBooked = false });
context.Rooms.Add(new Room { Id = 9, Name = "Huddle room 2", Floor = "Floor 2", Capacity = 4, IsBooked = false });
context.Rooms.Add(new Room { Id = 10, Name = "Executive meeting room", Floor = "Floor 1", Capacity = 14, IsBooked = false });
context.SaveChanges();
}

// Configure the HTTP request pipeline.
app.UseCors("CorsPolicy");

if (app.Environment.IsDevelopment()) {
    // Use the standard Swagger configuration
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();