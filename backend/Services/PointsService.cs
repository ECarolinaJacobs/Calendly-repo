using TodoApi.Context;
using TodoApi.Models;
using Microsoft.EntityFrameworkCore;

namespace TodoApi.Services;

public class PointsService
{
    private readonly ProjectContext _context;
    
    // Point values for different actions
    public const int REGISTRATION_POINTS = 10;
    public const int ROOM_BOOKING_POINTS = 5;
    public const int EVENT_JOIN_POINTS = 3;

    public PointsService(ProjectContext context)
    {
        _context = context;
    }

    public async Task<bool> AwardPointsAsync(long employeeId, int points, string reason = "")
    {
        try
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return false;
            }

            employee.Coins += points;
            await _context.SaveChangesAsync();
            
            // Log the point award (could be extended to include a points history table)
            Console.WriteLine($"Awarded {points} points to employee {employee.Name} (ID: {employeeId}) for {reason}");
            
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error awarding points: {ex.Message}");
            return false;
        }
    }

    public async Task<bool> AwardRegistrationPointsAsync(long employeeId)
    {
        return await AwardPointsAsync(employeeId, REGISTRATION_POINTS, "user registration");
    }

    public async Task<bool> AwardRoomBookingPointsAsync(long employeeId)
    {
        return await AwardPointsAsync(employeeId, ROOM_BOOKING_POINTS, "room booking");
    }

    public async Task<bool> AwardEventJoinPointsAsync(long employeeId)
    {
        return await AwardPointsAsync(employeeId, EVENT_JOIN_POINTS, "event participation");
    }

    public async Task<int> GetEmployeePointsAsync(long employeeId)
    {
        var employee = await _context.Employees.FindAsync(employeeId);
        return employee?.Coins ?? 0;
    }
}