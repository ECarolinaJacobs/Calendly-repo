using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using BCrypt.Net;


using TodoApi.Models;
using TodoApi.Context;
using Microsoft.AspNetCore.Identity;
namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthContext _context;
    public record RegisterRequest(string Name, string Email, string Password);
    public record LoginRequest(string Email, string Password);

    public AuthController(AuthContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult<Employee>> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Name, email, and password are required.");
        }

        if (await _context.Employees.AnyAsync(e => e.Email == request.Email))
        {
            return Conflict("Email already in use.");
        }

        Employee employee = new()
        {
            Name = request.Name,
            Email = request.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Coins = 0,
            IsAdmin = false
        };
        _context.Employees.Add(employee);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            "register",
            employee);
    }

    [HttpPost("login")]
    public async Task<ActionResult<Employee>> Login(LoginRequest request)
    {
        Employee? employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == request.Email);

        if (employee == null || !BCrypt.Net.BCrypt.Verify(request.Password, employee.Password))
        {
            return Unauthorized("Invalid email or password.");
        }

        Guid authToken = Guid.CreateVersion7();


        return Ok(authToken);
    }


}