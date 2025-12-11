using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

using TodoApi.Models;
using TodoApi.Context;
using TodoApi.Services;

namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ProjectContext _context;
    private readonly IConfiguration _configuration;
    private readonly PointsService _pointsService;
    public record RegisterRequest(string Name, string Email, string Password);
    public record LoginRequest(string Email, string Password);

    public AuthController(ProjectContext context, IConfiguration configuration, PointsService pointsService)
    {
        _context = context;
        _configuration = configuration;
        _pointsService = pointsService;
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

        // Award registration points
        await _pointsService.AwardRegistrationPointsAsync(employee.Id);

        // Avoid returning the full employee object which includes the password hash
        return CreatedAtAction(
            "Register",
            new { id = employee.Id, name = employee.Name, email = employee.Email, coins = employee.Coins });
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginRequest request)
    {
        Employee? employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Email == request.Email);

        if (employee == null || !BCrypt.Net.BCrypt.Verify(request.Password, employee.Password))
        {
            return Unauthorized("Invalid email or password.");
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? string.Empty);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
                new Claim(ClaimTypes.Name, employee.Name),
                new Claim(ClaimTypes.Email, employee.Email),
                new Claim("isAdmin", employee.IsAdmin.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);
        //added more info to the response, so the frontend can read if user is an admin or not 
        return Ok(new { 
            token = tokenString,
            userId = employee.Id,
            name = employee.Id,
            email = employee.Email,
            isAdmin = employee.IsAdmin  // FIXME: temporary isAdmin, for security reasons this should be changed later, assignee: Elena
        });
    }
}
