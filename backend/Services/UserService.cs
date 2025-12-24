namespace TodoApi.Context;

using Microsoft.EntityFrameworkCore;
using TodoApi.DTOs;


public class UserService
{
    private readonly ProjectContext _context;
    private readonly ILogger<UserService> _logger;

    public UserService(ProjectContext context, ILogger<UserService> logger)
    {
        _context = context;
        _logger = logger;

    }


    public async Task<IEnumerable<object>> GetUserBookings(int userId)
    {
        _logger.LogInformation("Retrieving booking information for user Id: {userId}", userId);
        var bookings = await _context.RoomBookings
            .Where(rb => rb.EmployeeId == userId)
            .Include(rb => rb.Room)
            .OrderByDescending(rb => rb.StartTime)
            .ToListAsync();


        var bookingResults = bookings.Select(b => new
        {
            b.Id,
            RoomName = b.Room?.Name,
            b.StartTime,
            b.EndTime
        }).ToList();

        return bookingResults;
    }

    public async Task<UserDTO?> GetUserInformation(long id)
    {
        var employee = await _context.Employees
            .Where(e => e.Id == id)
            .Select(e => new UserDTO
            {
                Id = e.Id,
                Name = e.Name,
                Email = e.Email,
                Coins = e.Coins,
                IsAdmin = e.IsAdmin
            }).FirstOrDefaultAsync();

        if (employee != null)
        {
            _logger.LogInformation("Retrieved {employee} information", employee.Name);
        }

        return employee;
    }


    public async Task<bool> UpdateUserInformation(long id, UpdateUserDTO UpdatedUserInfo)
    {

        _logger.LogInformation("updating user information for Id: {UserId}", id);
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
        {
            _logger.LogWarning("Employee with ID {EmployeeId} not found", id);
            return false;

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
                throw new ArgumentException("New password must be provided");
            }

            _logger.LogInformation("Updating password for user Id: {UserId}", id);
            var IsMatch = BCrypt.Net.BCrypt.Verify(UpdatedUserInfo.Password, employee.Password);
            if (IsMatch == false)
            {
                _logger.LogWarning("Password mismatch for user Id: {UserId}", id);
                throw new UnauthorizedAccessException("Current password does not match");
            }

            employee.Password = BCrypt.Net.BCrypt.HashPassword(UpdatedUserInfo.NewPassword);
            _logger.LogInformation("Password verified and updated for user Id: {UserId}", id);


        }
        await _context.SaveChangesAsync();
        return true;


    }
}