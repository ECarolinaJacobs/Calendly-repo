//elena
/// <summary>
/// service layer for admin operations: retrieve, delete, update status, search and stats calculations of employees
/// </summary>
using Microsoft.EntityFrameworkCore;
using TodoApi.Context;
using TodoApi.DTOs;

namespace TodoApi.Services;

public class AdminService
{
    private readonly ProjectContext _context;
    private readonly ILogger<AdminService> _logger;
    public AdminService(ProjectContext context, ILogger<AdminService> logger)
    {
        _context = context;
        _logger = logger;
    }

    ///<summary>
    /// retrieves all employees from the db
    /// </summary>
    /// <returns> List of employee DTOs </returns> 
    public async Task<List<EmployeeDto>> GetAllEmployees()
    {
        _logger.LogInformation("Fetching all employees");
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
        return employees;
    }

    ///<summary>
    /// deletes an employee by Id
    /// </summary>
    /// <param name="id"> employee id to delete </param>
    /// <returns> true if deletes successfully, false if not found </returns> 
    public async Task<bool> DeleteEmployee(long id)
    {
        _logger.LogInformation("Attempting to delete employee: {EmployeeId}", id);
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
        {
            _logger.LogWarning("Employee {EmployeeId} not found", id);
            return false;
        }
        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Successfully deleted employee {EmployeeId}", id);
        return true;
    }

    /// <summary>
    /// updates the admin status of an employee
    /// </summary>
    /// <param name="id"> employee id </param>
    /// <param name="isAdmin"> new admin status </param>
    /// <returns> true if updated successfully, false if employee not found</returns>
    public async Task<bool> UpdateAdminStatus(long id, bool isAdmin)
    {
        _logger.LogInformation("Updating admin status for employee {EmployeeId}", id);
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
        {
            _logger.LogWarning("Employee {EmployeeId} not found", id);
            return false;
        }
        employee.IsAdmin = isAdmin;
        await _context.SaveChangesAsync();
        _logger.LogInformation("Updated employee {EmployeeId} admin status to {IsAdmin}", id, isAdmin);
        return true;
    }


    /// <summary>
    /// searches employees by name or email
    /// <paramref name="searchTerm"> search term to filter employees by </param>
    /// <returns> list of matching employee dtos</returns> 
    public async Task<List<EmployeeDto>> SearchEmployees(string searchTerm)
    {
        _logger.LogInformation("Searching employees containing: {SearchTerm}", searchTerm);
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
        return employees;
    }

    /// <summary>
    /// calculates stats in database instead of loading all of the employees into memory for faster execution
    /// </summary>
    /// <returns>statistics dto with employee stats </returns>
    public async Task<AdminStatsDto> GetStatistics()
    {
        _logger.LogInformation("Calculating statistics");
        var stats = new AdminStatsDto
        {
            TotalEmployees = await _context.Employees.CountAsync(),
            TotalAdmins = await _context.Employees.CountAsync(e => e.IsAdmin),
            TotalRegularUsers = await _context.Employees.CountAsync(e => !e.IsAdmin),
            TotalCoins = await _context.Employees.SumAsync(e => e.Coins),
            AverageCoinsPerUser = await _context.Employees.AnyAsync()
                ? await _context.Employees.AverageAsync(e => e.Coins)
                : 0
        };
        _logger.LogInformation("Statistics: {TotalEmployees} total employees, {TotalAdmins} admins",
            stats.TotalEmployees, stats.TotalAdmins);
        return stats;
    }
}
