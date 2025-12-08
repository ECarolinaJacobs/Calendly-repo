using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Context;
using TodoApi.DTOs;

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
    // filter / search function for employees by name or email
    [HttpGet("employees/search")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> SearchEmployees([FromQuery] string searchTerm)
    {
        /// <summary> 
        /// Used input search term to filter and returns list of employees who satisfy the requirement
        /// <summary>
        /// <param name="searchTerm"> Search term to filter by </param>
        /// <returns>Filtered list of employees </returns> 
        try
        {
            _logger.LogInformation("Searching employees containing: {SearchTerm}", searchTerm);
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest(new { message = "Search term is required" });
            }
            var employees = await _context.Employees
                .Where(e => e.Name.ToLower().Contains(searchTerm.ToLower()) ||
                    e.Email.ToLower().Contains(searchTerm.ToLower()))
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Email = e.Email,
                    IsAdmin = e.IsAdmin,
                    Coins = e.Coins
                })
                .ToListAsync();
            _logger.LogInformation("Found {Count} employees matching '{SearchTerm}'", employees.Count, searchTerm);
            return Ok(employees);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching employees");
            return StatusCode(500, new { message = "internal server error" });
        }
    }
    ///<summary>
    /// gets stat overview of employees like the average amount of coins or how many employees there are
    /// </summary>
    /// <returns>Statistics about employees in the system </returns>
    [HttpGet("statistics")]
    public async Task<ActionResult<AdminStatsDto>> GetStatistics()
    {
        try
        {
            _logger.LogInformation("Admin requesting statistics");
            var employees = await _context.Employees.ToListAsync();
            var stats = new AdminStatsDto
            {
                TotalEmployees = employees.Count,
                TotalAdmins = employees.Count(e => e.IsAdmin),
                TotalRegularUsers = employees.Count(e => !e.IsAdmin),
                TotalCoins = employees.Sum(e => e.Coins),
                AverageCoinsPerUser = employees.Any() ? employees.Average(e => e.Coins) : 0
            };
            _logger.LogInformation("Statistics: {TotalEmployees} total employees, {TotalAdmins} admins",
                stats.TotalEmployees, stats.TotalAdmins);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving statistics");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

