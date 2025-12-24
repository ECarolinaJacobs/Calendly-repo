using Microsoft.AspNetCore.Mvc;
using TodoApi.Services;
using TodoApi.DTOs;

/* controller summary:
- handles all HTTP requests from the frontend related to admin operations, consists of 5 endpoints
- essentially the middleman between the frontend and the database

uses context for database access and uses employee model for database table 
returns employeeDTO, AdminStatsDTO 
called by: admin.tsx (frontend api service)
*/

namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]

public class AdminController : ControllerBase
{
    //dependency injection : injects context and logger into admin controller when called upon
    private readonly AdminService _adminService;
    private readonly ILogger<AdminController> _logger;
    public AdminController(AdminService adminService, ILogger<AdminController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all employees in system
    /// frontend calls -> method execution -> queries db -> converts to dto -> returns json -> frontend displays
    /// <summary>
    [HttpGet("employees")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAllEmployees()
    {
        try
        {
            var employees = await _adminService.GetAllEmployees();
            return Ok(employees);
        }
        catch (Exception ex)
        {
            //error handling and logging
            _logger.LogError(ex, "Error retrieving employees");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// Deletes an employee by Id
    /// frontend confirms delete -> calls this endpoint -> db removes employee -> returns success -> frontend reloads data
    /// <summary>
    [HttpDelete("employees/{id}")]
    public async Task<IActionResult> DeleteEmployee(long id)
    {
        try
        {
            var success = await _adminService.DeleteEmployee(id);
            if (!success)
            {
                return NotFound(new { message = "Employee not found" });
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting employee {EmployeeId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    /// <summary>
    /// searched employees by name or email (case-insensitive)
    /// user presses enter -> frontend calls this endpoint -> db filters result -> returns matching emps or empty arr
    /// <summary>
    /// <param name="id">Employee Id from url</param>
    /// <param name=""request">Request body with new admin status</param>
    [HttpPut("employees/{id}/admin")]
    public async Task<IActionResult> UpdateAdminStatus(long id, UpdateAdminRequest request)
    {
        try
        {
            var success = await _adminService.UpdateAdminStatus(id, request.IsAdmin);
            if (!success)
            {
                return NotFound(new { message = "Employee not found" });
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating admin status for employee {EmployeeId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
    public record UpdateAdminRequest(bool IsAdmin);



    /// <summary> 
    /// Used input search term to filter and returns list of employees who satisfy the requirement
    /// <summary>
    /// <param name="searchTerm"> Search term to filter by </param>
    /// <returns>Filtered list of employees </returns> 
    [HttpGet("employees/search")]
    public async Task<ActionResult<List<EmployeeDto>>> SearchEmployees([FromQuery] string searchTerm)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest(new { message = "Search term is required" });
            }
            var employees = await _adminService.SearchEmployees(searchTerm);
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
            var stats = await _adminService.GetStatistics();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving statistics");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}

