using Microsoft.EntityFrameworkCore;

// Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<UserDb>(opt =>
    opt.UseSqlite("Data Source=calendly.db"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "TodoAPI";
    config.Title = "TodoAPI v1";
    config.Version = "v1";
});



var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "TodoAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}

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
