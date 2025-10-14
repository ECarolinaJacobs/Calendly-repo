using Microsoft.EntityFrameworkCore;
using YourApp.Models;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SQLite EF Core setup
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

var app = builder.Build();

// In-memory session storage (for production, use Redis or database)
var activeSessions = new Dictionary<string, SessionData>();

// Automatically create database if not exists
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();


    if (!db.Employees.Any(e => e.IsAdmin))
    {
        var admin = new Employee
        {
            Name = "Admin",
            Email = "admin@example.com",
            PasswordHash = HashPassword("admin123"),
            IsAdmin = true,
            Coins = 0
        };
        db.Employees.Add(admin);
        db.SaveChanges();
    }
}


// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Helper method for password hashing
string HashPassword(string password)
{
    using var sha256 = SHA256.Create();
    var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
    return Convert.ToBase64String(bytes);
}

// Helper method to generate session token
string GenerateSessionToken()
{
    var bytes = new byte[32];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(bytes);
    return Convert.ToBase64String(bytes);
}

// Middleware to validate session token
async Task<IResult> ValidateSession(HttpContext context, AppDbContext db, Func<int, bool, Task<IResult>> handler)
{
    var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

    if (string.IsNullOrEmpty(token) || !activeSessions.ContainsKey(token))
    {
        return Results.Unauthorized();
    }

    var session = activeSessions[token];

    // Check if session is expired (24 hours)
    if (DateTime.UtcNow > session.ExpiresAt)
    {
        activeSessions.Remove(token);
        return Results.Unauthorized();
    }

    return await handler(session.EmployeeId, session.IsAdmin);
}

// Middleware to validate admin access
async Task<IResult> ValidateAdmin(HttpContext context, AppDbContext db, Func<int, Task<IResult>> handler)
{
    var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

    if (string.IsNullOrEmpty(token) || !activeSessions.ContainsKey(token))
    {
        return Results.Unauthorized();
    }

    var session = activeSessions[token];

    // Check if session is expired
    if (DateTime.UtcNow > session.ExpiresAt)
    {
        activeSessions.Remove(token);
        return Results.Unauthorized();
    }

    // Check if user is admin
    if (!session.IsAdmin)
    {
        return Results.Json(new { error = "Admin access required" }, statusCode: 403);
    }

    return await handler(session.EmployeeId);
}

// -------------------------------
// 🔐 AUTHENTICATION
// -------------------------------
app.MapPost("/auth/register", async (RegisterRequest request, AppDbContext db) =>
{
    // Validate input
    if (string.IsNullOrWhiteSpace(request.Name) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest("Name, email, and password are required.");
    }

    // Check if email already exists
    var existingUser = await db.Employees.FirstOrDefaultAsync(e => e.Email == request.Email);
    if (existingUser != null)
    {
        return Results.BadRequest("Email already registered.");
    }

    // Create new employee
    var employee = new Employee
    {
        Name = request.Name,
        Email = request.Email,
        PasswordHash = HashPassword(request.Password),
        Coins = 0,
        IsAdmin = false // Default to non-admin
    };

    db.Employees.Add(employee);
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        id = employee.Id,
        name = employee.Name,
        email = employee.Email,
        coins = employee.Coins,
        isAdmin = employee.IsAdmin,
        message = "Registration successful! Please login."
    });
});

app.MapPost("/auth/login", async (LoginRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest("Email and password are required.");
    }

    var employee = await db.Employees
        .Include(e => e.CurrentSkin)
        .FirstOrDefaultAsync(e => e.Email == request.Email);

    if (employee == null)
    {
        return Results.Unauthorized();
    }

    var hashedPassword = HashPassword(request.Password);
    if (employee.PasswordHash != hashedPassword)
    {
        return Results.Unauthorized();
    }

    // Generate session token
    var token = GenerateSessionToken();
    activeSessions[token] = new SessionData
    {
        EmployeeId = employee.Id,
        Email = employee.Email,
        IsAdmin = employee.IsAdmin,
        ExpiresAt = DateTime.UtcNow.AddHours(24)
    };

    return Results.Ok(new
    {
        token,
        employee = new
        {
            id = employee.Id,
            name = employee.Name,
            email = employee.Email,
            coins = employee.Coins,
            isAdmin = employee.IsAdmin,
            currentSkinId = employee.CurrentSkinId,
            currentSkin = employee.CurrentSkin
        },
        expiresAt = activeSessions[token].ExpiresAt,
        message = "Login successful!"
    });
});

app.MapPost("/auth/logout", (HttpContext context) =>
{
    var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");

    if (!string.IsNullOrEmpty(token) && activeSessions.ContainsKey(token))
    {
        activeSessions.Remove(token);
        return Results.Ok(new { message = "Logged out successfully." });
    }

    return Results.BadRequest("Invalid session.");
});

// -------------------------------
// 👤 EMPLOYEES (Protected)
// -------------------------------
app.MapGet("/employees", async (HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        // Only admins can view all employees
        if (!isAdmin)
            return Results.Json(new { error = "Admin access required" }, statusCode: 403);

        return Results.Ok(await db.Employees.Include(e => e.CurrentSkin).ToListAsync());
    }));

app.MapGet("/employees/{id}", async (int id, HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        // Users can view their own profile, admins can view any profile
        if (!isAdmin && employeeId != id)
            return Results.Json(new { error = "Access denied" }, statusCode: 403);

        return await db.Employees.FindAsync(id) is Employee e ? Results.Ok(e) : Results.NotFound();
    }));

app.MapPut("/employees/{id}", async (int id, Employee update, HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        // Only allow users to update their own profile or admins to update any
        if (!isAdmin && employeeId != id)
            return Results.Json(new { error = "Access denied" }, statusCode: 403);

        var emp = await db.Employees.FindAsync(id);
        if (emp is null) return Results.NotFound();

        emp.Name = update.Name;
        emp.Email = update.Email;
        if (!string.IsNullOrEmpty(update.PasswordHash))
            emp.PasswordHash = update.PasswordHash;
        emp.CurrentSkinId = update.CurrentSkinId;

        // Only admins can change admin status and coins
        if (isAdmin)
        {
            emp.IsAdmin = update.IsAdmin;
            emp.Coins = update.Coins;
        }

        await db.SaveChangesAsync();
        return Results.Ok(emp);
    }));

app.MapDelete("/employees/{id}", async (int id, HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        // Only admins can delete accounts
        if (!isAdmin)
            return Results.Json(new { error = "Admin access required" }, statusCode: 403);

        var emp = await db.Employees.FindAsync(id);
        if (emp is null) return Results.NotFound();
        db.Employees.Remove(emp);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }));

// Get current user profile
app.MapGet("/auth/me", async (HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        var emp = await db.Employees
            .Include(e => e.CurrentSkin)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        return emp != null ? Results.Ok(emp) : Results.NotFound();
    }));

// Admin: Make user an admin
app.MapPost("/admin/promote/{userId}", async (int userId, HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        var user = await db.Employees.FindAsync(userId);
        if (user == null) return Results.NotFound();

        user.IsAdmin = true;
        await db.SaveChangesAsync();
        return Results.Ok(new { message = $"{user.Name} is now an admin." });
    }));

// Admin: Grant coins to user
app.MapPost("/admin/grant-coins", async (GrantCoinsRequest request, HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        var user = await db.Employees.FindAsync(request.EmployeeId);
        if (user == null) return Results.NotFound();

        user.Coins += request.Amount;

        db.Transactions.Add(new Transaction
        {
            EmployeeId = request.EmployeeId,
            Amount = request.Amount,
            Type = "earn",
            Reason = $"Admin grant: {request.Reason}"
        });

        await db.SaveChangesAsync();
        return Results.Ok(new { message = $"Granted {request.Amount} coins to {user.Name}", totalCoins = user.Coins });
    }));

// -------------------------------
// 🎉 EVENTS (Public read, Admin write)
// -------------------------------
app.MapGet("/events", async (AppDbContext db) =>
    await db.Events.ToListAsync());

app.MapGet("/events/{id}", async (int id, AppDbContext db) =>
    await db.Events.FindAsync(id) is Event e ? Results.Ok(e) : Results.NotFound());

app.MapPost("/events", async (Event ev, HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        db.Events.Add(ev);
        await db.SaveChangesAsync();
        return Results.Created($"/events/{ev.Id}", ev);
    }));

app.MapPut("/events/{id}", async (int id, Event update, HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        var ev = await db.Events.FindAsync(id);
        if (ev == null) return Results.NotFound();

        ev.Name = update.Name;
        ev.Description = update.Description;
        ev.Date = update.Date;
        ev.QrCode = update.QrCode;

        await db.SaveChangesAsync();
        return Results.Ok(ev);
    }));

app.MapDelete("/events/{id}", async (int id, HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        var ev = await db.Events.FindAsync(id);
        if (ev == null) return Results.NotFound();

        db.Events.Remove(ev);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }));

// -------------------------------
// ✅ EVENT CHECKINS (Protected)
// -------------------------------
app.MapPost("/events/{eventId}/checkin", async (int eventId, CheckinRequest request, HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        var ev = await db.Events.FindAsync(eventId);
        var emp = await db.Employees.FindAsync(employeeId);

        if (ev is null || emp is null) return Results.NotFound("Event or Employee not found.");
        if (ev.QrCode != request.QrCode) return Results.BadRequest("Invalid QR code.");

        var exists = await db.EventCheckins.FirstOrDefaultAsync(c => c.EmployeeId == employeeId && c.EventId == eventId);
        if (exists != null) return Results.BadRequest("Already checked in.");

        var checkin = new EventCheckin
        {
            EmployeeId = employeeId,
            EventId = eventId,
            QrCodeUsed = request.QrCode,
            CoinsEarned = 10
        };

        emp.Coins += 10;
        db.EventCheckins.Add(checkin);

        db.Transactions.Add(new Transaction
        {
            EmployeeId = employeeId,
            Amount = 10,
            Type = "earn",
            Reason = $"Checked in to event: {ev.Name}"
        });

        await db.SaveChangesAsync();

        return Results.Ok(new { message = "Checked in successfully!", coinsEarned = 10, totalCoins = emp.Coins });
    }));

// Admin: View all checkins
app.MapGet("/admin/checkins", async (HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        var checkins = await db.EventCheckins
            .Include(c => c.Employee)
            .Include(c => c.Event)
            .OrderByDescending(c => c.CheckinTime)
            .ToListAsync();
        return Results.Ok(checkins);
    }));

// -------------------------------
// 💬 FRIEND REQUESTS (Protected)
// -------------------------------
app.MapPost("/friends/request", async (FriendRequest request, HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        if (employeeId == request.ReceiverId)
            return Results.BadRequest("Cannot friend yourself.");

        var exists = await db.EmployeeFriends
            .FirstOrDefaultAsync(f => (f.EmployeeId == employeeId && f.FriendId == request.ReceiverId)
                                   || (f.EmployeeId == request.ReceiverId && f.FriendId == employeeId));

        if (exists != null)
            return Results.BadRequest("Friend request already exists.");

        var friendRequest = new EmployeeFriend
        {
            EmployeeId = employeeId,
            FriendId = request.ReceiverId,
            Status = "pending"
        };

        db.EmployeeFriends.Add(friendRequest);
        await db.SaveChangesAsync();
        return Results.Ok(friendRequest);
    }));

app.MapPost("/friends/accept/{requestId}", async (int requestId, HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        var req = await db.EmployeeFriends.FindAsync(requestId);
        if (req == null) return Results.NotFound();

        // Only the receiver can accept
        if (req.FriendId != employeeId)
            return Results.Json(new { error = "Access denied" }, statusCode: 403);

        req.Status = "accepted";
        await db.SaveChangesAsync();
        return Results.Ok(req);
    }));

app.MapGet("/friends", async (HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        var friends = await db.EmployeeFriends
            .Where(f => (f.EmployeeId == employeeId || f.FriendId == employeeId) && f.Status == "accepted")
            .ToListAsync();

        return Results.Ok(friends);
    }));

// -------------------------------
// 🧥 SKINS (Protected)
// -------------------------------
app.MapGet("/skins", async (HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
        Results.Ok(await db.Skins.ToListAsync())));

app.MapPost("/skins", async (Skin skin, HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        db.Skins.Add(skin);
        await db.SaveChangesAsync();
        return Results.Created($"/skins/{skin.Id}", skin);
    }));

app.MapPut("/skins/{id}", async (int id, Skin update, HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        var skin = await db.Skins.FindAsync(id);
        if (skin == null) return Results.NotFound();

        skin.Name = update.Name;
        skin.Description = update.Description;
        skin.Price = update.Price;
        skin.ImageUrl = update.ImageUrl;

        await db.SaveChangesAsync();
        return Results.Ok(skin);
    }));

app.MapDelete("/skins/{id}", async (int id, HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        var skin = await db.Skins.FindAsync(id);
        if (skin == null) return Results.NotFound();

        db.Skins.Remove(skin);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }));

app.MapGet("/skins/owned", async (HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        var ownedSkins = await db.EmployeeSkins
            .Where(es => es.EmployeeId == employeeId)
            .Include(es => es.Skin)
            .Select(es => es.Skin)
            .ToListAsync();

        return Results.Ok(ownedSkins);
    }));

app.MapPost("/skins/buy", async (BuySkinRequest request, HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        var emp = await db.Employees.FindAsync(employeeId);
        var skin = await db.Skins.FindAsync(request.SkinId);

        if (emp == null || skin == null) return Results.NotFound();
        if (emp.Coins < skin.Price) return Results.BadRequest("Not enough coins.");

        var owned = await db.EmployeeSkins.FirstOrDefaultAsync(es => es.EmployeeId == employeeId && es.SkinId == request.SkinId);
        if (owned != null) return Results.BadRequest("Already owned.");

        emp.Coins -= skin.Price;
        db.EmployeeSkins.Add(new EmployeeSkin { EmployeeId = employeeId, SkinId = request.SkinId });
        db.Transactions.Add(new Transaction
        {
            EmployeeId = employeeId,
            Amount = -skin.Price,
            Type = "spend",
            Reason = $"Bought skin: {skin.Name}"
        });

        await db.SaveChangesAsync();
        return Results.Ok(new { message = "Skin purchased!", remainingCoins = emp.Coins });
    }));

app.MapPost("/skins/equip", async (EquipSkinRequest request, HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
    {
        var emp = await db.Employees.FindAsync(employeeId);
        if (emp == null) return Results.NotFound("Employee not found.");

        var owned = await db.EmployeeSkins.FirstOrDefaultAsync(es => es.EmployeeId == employeeId && es.SkinId == request.SkinId);
        if (owned == null) return Results.BadRequest("You don't own this skin.");

        emp.CurrentSkinId = request.SkinId;
        await db.SaveChangesAsync();

        return Results.Ok(new { message = "Skin equipped!", currentSkinId = request.SkinId });
    }));

// -------------------------------
// 💰 TRANSACTIONS (Protected)
// -------------------------------
app.MapGet("/transactions", async (HttpContext context, AppDbContext db) =>
    await ValidateSession(context, db, async (employeeId, isAdmin) =>
        Results.Ok(await db.Transactions
            .Where(t => t.EmployeeId == employeeId)
            .OrderByDescending(t => t.Date)
            .ToListAsync())));

// Admin: View all transactions
app.MapGet("/admin/transactions", async (HttpContext context, AppDbContext db) =>
    await ValidateAdmin(context, db, async (adminId) =>
    {
        var transactions = await db.Transactions
            .Include(t => t.Employee)
            .OrderByDescending(t => t.Date)
            .ToListAsync();
        return Results.Ok(transactions);
    }));

app.Run();

// DTOs
public record RegisterRequest(string Name, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record CheckinRequest(string QrCode);
public record FriendRequest(int ReceiverId);
public record BuySkinRequest(int SkinId);
public record EquipSkinRequest(int SkinId);
public record GrantCoinsRequest(int EmployeeId, int Amount, string Reason);

// Session data
public class SessionData
{
    public int EmployeeId { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }
    public DateTime ExpiresAt { get; set; }
}