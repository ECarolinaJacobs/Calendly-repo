using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Context;
using TodoApi.Models;

namespace TodoApi.Services;

using TodoApi.DTOs;
using TodoApi.Models;

public class AuthService
{
    private readonly ProjectContext _context;
    private readonly IConfiguration _configuration;
    private readonly PointsService _pointsService;

    public AuthService(ProjectContext context, IConfiguration configuration, PointsService pointsService)
    {
        _context = context;
        _configuration = configuration;
        _pointsService = pointsService;
    }

    public async Task<Employee> Register(RegisterRequest request)
    {
        List<string> missingFields = new();
        if (string.IsNullOrWhiteSpace(request.Name)){missingFields.Add("Name");}
        if (string.IsNullOrWhiteSpace(request.Email)){missingFields.Add("Email");}
        if (string.IsNullOrWhiteSpace(request.Password)){missingFields.Add("Password");}

        if (missingFields.Any())
        {
            throw new MissingFieldsException(string.Join(",", missingFields));
        }

        if (await _context.Employees.AnyAsync(e => e.Email == request.Email))
        {
            throw new EmailInUseException();
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

        return employee;
    }

    public async Task<LoginResponse> Login(Employee employee)
    {
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
        return new LoginResponse{
            Token = tokenString,
            Id = employee.Id,
            Name = employee.Name,
            Email = employee.Email,
            IsAdmin = employee.IsAdmin  // FIXME: temporary isAdmin, for security reasons this should be changed later, assignee: Elena
        };
    }
}