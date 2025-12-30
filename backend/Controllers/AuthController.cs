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
    private readonly AuthService _authService;

    public AuthController(ProjectContext context, IConfiguration configuration, PointsService pointsService, AuthService authService)
    {
        _context = context;
        _configuration = configuration;
        _pointsService = pointsService;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<Employee>> Register(RegisterRequest request)
    {
        // Avoid returning the full employee object which includes the password hash
        try
        {
            var createdEmployee = await _authService.Register(request);
            return CreatedAtAction(
            "Register",
            new { id = createdEmployee.Id, name = createdEmployee.Name, email = createdEmployee.Email, coins = createdEmployee.Coins });
        }
        catch (MissingFieldsException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (EmailInUseException ex)
        {
            return Conflict(ex.Message);
        }
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
                new Claim(ClaimTypes.Role, employee.IsAdmin ? "Admin" : "User")
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
