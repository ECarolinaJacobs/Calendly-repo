using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Context;

namespace TodoApi.Controllers;
//controller for admin operations
[Route("api/[controller]")]
[ApiController]

public class AdminController : ControllerBase
{
    private readonly ProjectContext _context;
    private readonly ILogger<AdminController> _logger;
    //dependency injection
    public AdminController(ProjectContext context, ILogger<AdminController> logger)
    {
        _context = context;
        _logger = logger;
    }
    //gets all employees in the system and returns a list of employees
    [HttpGet("employees")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAllEmployees()
    {
        try
        {
            _logger.LogInformation("Admin requesting all employees");
            //asynchornous data fetching
            var employees = await _context.Employees
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Email = e.Email,
                    IsAdmin = e.IsAdmin,
                    Coins = e.Coins
                })
                .ToListAsync();
            _logger.LogInformation("Retrieved {Count} employees", employees.Count);
            return Ok(employees); //HTTP status code 200
        }
        catch (Exception ex)
        {
            //error handling and logging
            _logger.LogError(ex, "Error retrieving employees");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
    //delete an employee by ID, param name = "id" == the employee id to delete, returns status succes or fail
    [HttpDelete("employees/{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        try
        {
            _logger.LogInformation("Attempting to delete employee with ID: {EmployeeId}, id");
            //asynchronous operation
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                _logger.LogWarning("Employee with ID {EmployeeId} not found", id);
                return NotFound(new { message = "Employee not found" }); // http statuscode 404
            }
            //database removal employee
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Successfully deleted employee {EmployeeId}", id);
            return NoContent(); // http statuscode 204
        }
        catch (Exception ex)
        {
            // error handling and logging
            _logger.LogError(ex, "Error deleting employee {EmployeeId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
    // updates employees status to admin
    [HttpPut("employees/{id}/admin")]
    public async Task<IActionResult> UpdateAdminStatus(int id, UpdateAdminRequest request)
    {
        try
        {
            _logger.LogInformation("Updating admin status for employee {EmployeeId}", id);
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound(new { message = "Employee not found" }); // http statuscode 404
            }
            employee.IsAdmin = request.IsAdmin;
            await _context.SaveChangesAsync();
            _logger.LogInformation("Updated employee {EmployeeId} admin status to {IsAdmin}", id, request.IsAdmin);
            return NoContent(); //http 204
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating admin status for employee {EmployeeId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
    public record UpdateAdminRequest(bool IsAdmin);
}

// data transfer object (DTO) for employee information
public record EmployeeDto
{
    public long Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public bool IsAdmin { get; init; }
    public int Coins { get; init; }
    // no password field for security purposes
}

