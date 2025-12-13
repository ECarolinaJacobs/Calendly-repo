using TodoApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Context;
using Microsoft.IdentityModel.Tokens;


namespace TodoApi.Controllers;
//controller for profile operations
[Route("api/[controller]")]
[ApiController]


public class ProfileController : ControllerBase
{
    
    private readonly ProjectContext _context;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(ProjectContext context, ILogger<ProfileController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDTO>> GetUserInformation(long id)
    {
        try
        {
            _logger.LogInformation("Retrieving user information for Id: {UserId}",id);
            var employee = await _context.Employees
                .Where(e => e.Id == id)
                .Select(e => new UserDTO{
                    Id = e.Id,
                    Name = e.Name,
                    Email = e.Email,
                    Coins = e.Coins,
                    IsAdmin = e.IsAdmin
                }).FirstOrDefaultAsync();
            _logger.LogInformation("Retrieved {employee} information", employee.Name);
            if (employee == null)
            {
                _logger.LogWarning("Employee with ID {EmployeeId} not found", id);
                return NotFound(new { message = "Employee not found" }); 
            }
            _logger.LogInformation("Successfully retrieved user information for Id: {UserId}", id);
            return Ok(employee); 
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving user information for Id: {UserId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserDTO>> UpdateUserInformation(long id, UpdateUserDTO UpdatedUserInfo)
    {
        try
        {
            _logger.LogInformation("updating user information for Id: {UserId}", id);
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                _logger.LogWarning("Employee with ID {EmployeeId} not found", id);
                return NotFound(new { message = "Employee not found" }); // HTTP 404
    
            }
            if (!string.IsNullOrEmpty(UpdatedUserInfo.Name))
            {
                _logger.LogInformation("Updating name for user Id: {UserId}", id);
                employee.Name = UpdatedUserInfo.Name;
            }
            if (!string.IsNullOrEmpty(UpdatedUserInfo.Email))
            {
                _logger.LogInformation("Updating email for user Id: {UserId}", id);
                employee.Email = UpdatedUserInfo.Email;
            }
            if (!string.IsNullOrEmpty(UpdatedUserInfo.Password))
            {
                if (string.IsNullOrEmpty(UpdatedUserInfo.NewPassword))
                {
                    _logger.LogWarning("New password not provided for user Id: {UserId}", id);
                    return BadRequest(new { message = "New password must be provided" }); // HTTP 400
                }
                _logger.LogInformation("Updating password for user Id: {UserId}", id);
                var IsMatch = BCrypt.Net.BCrypt.Verify(UpdatedUserInfo.Password, employee.Password);
                if (IsMatch == false)
                {
                    _logger.LogWarning("Password mismatch for user Id: {UserId}", id);
                    return BadRequest(new { message = "Current password is incorrect" }); // HTTP 400
                }
                
                    _logger.LogInformation("Password verified for user Id: {UserId}", id);
                    employee.Password = BCrypt.Net.BCrypt.HashPassword(UpdatedUserInfo.NewPassword);
                
                
            }
            await _context.SaveChangesAsync();
            _logger.LogInformation("Updated user informtation for Id: {UserId}", id);
            return NoContent(); // HTTP 204
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user information for Id: {UserId}", id);
            return StatusCode(500, new { message = "Internal server error" }); // HTTP 500
        }
    }

}