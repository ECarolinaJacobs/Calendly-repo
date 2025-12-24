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

    public async Task<AdminStatsDto> GetStatistics()
    {
        _logger.LogInformation("Calculating statistics");
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
        return stats;
    }
}

