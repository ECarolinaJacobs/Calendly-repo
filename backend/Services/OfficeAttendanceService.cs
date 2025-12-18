using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Context;
using TodoApi.DTOs;

namespace TodoApi.Services;

public class OfficeAttendanceService
{
    private readonly ProjectContext _context;
    private readonly ILogger<OfficeAttendanceService> _logger;
    public OfficeAttendanceService(ProjectContext context, ILogger<OfficeAttendanceService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<OfficeAttendanceDto>> GetMyAttendance(long employeeId)
    {
        _logger.LogInformation("Fetching attendance for employee {EmployeeId}", employeeId);
        var attendances = await _context.OfficeAttendance
            .Where(a => a.EmployeeId == employeeId)
            .Include(a => a.Employee)
            .OrderBy(a => a.Date)
            .Select(a => new OfficeAttendanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee.Name,
                Date = a.Date
            })
            .ToListAsync();
        return attendances;
    }

    public async Task<(bool Success, string? ErrorMessage, OfficeAttendanceDto? Result)> CreateAttendance(long employeeId, DateTime date)
    {
        _logger.LogInformation("Employee {EmployeeId} booking attendance for {Date}", employeeId, date.Date);
        if (date.Date < DateTime.Today)
        {
            return (false, "Cannot book attendance for past date", null);
        }
        var existingAttendance = await _context.OfficeAttendance
            .FirstOrDefaultAsync(a =>
                a.EmployeeId == employeeId &&
                a.Date.Date == date.Date);

        if (existingAttendance != null)
        {
            return (false, "You already have an attendance booking for this day", null);
        }
        var attendance = new OfficeAttendance
        {
            EmployeeId = employeeId,
            Date = date.Date,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _context.OfficeAttendance.Add(attendance);
        await _context.SaveChangesAsync();
        var created = await _context.OfficeAttendance
            .Include(a => a.Employee)
            .FirstAsync(a => a.Id == attendance.Id);
        var dto = new OfficeAttendanceDto
        {
            Id = created.Id,
            EmployeeId = created.EmployeeId,
            EmployeeName = created.Employee.Name,
            Date = created.Date
        };
        _logger.LogInformation("Employee {EmployeeId} successfully booked attendance for {Date}", employeeId, date.Date);
        return (true, null, dto);
    }

    public async Task<(bool Success, string? ErrorMessage, bool IsOwner)> UpdateAttendance(long id, long employeeId, DateTime? newDate)
    {
        _logger.LogInformation("Employee {EmployeeId} updating attendance {AttendanceId}", employeeId, id);
        var attendance = await _context.OfficeAttendance.FindAsync(id);
        if (attendance == null)
        {
            return (false, "Attendance booking not found", false);
        }
        if (attendance.EmployeeId != employeeId)
        {
            _logger.LogWarning("Employee {EmployeeId} tried to update attendance {AttendanceId} belonging to employee {OwnerId}", employeeId, id, attendance.EmployeeId);
            return (false, "Forbidden", false); // http 403 forbidden
        }
        if (newDate.HasValue)
        {
            if (newDate.Value.Date < DateTime.Today)
            {
                return (false, "Cannot change to date in the past", true);
            }
            if (newDate.Value.Date != attendance.Date.Date)
            {
                var conflict = await _context.OfficeAttendance
                    .AnyAsync(a =>
                        a.EmployeeId == employeeId &&
                        a.Date.Date == newDate.Value.Date &&
                        a.Id != id);
                if (conflict)
                {
                    return (false, "You already have a booking for this date", true);
                }
            }
            attendance.Date = newDate.Value.Date;
        }
        attendance.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        _logger.LogInformation("Employee {EmployeeId} successfully updated attendance {AttendanceId}", employeeId, id);
        return (true, null, true); //http succes no body 204
    }

    public async Task<(bool Success, string? ErrorMessage, bool IsOwner)> DeleteAttendance(long id, long employeeId)
    {
        _logger.LogInformation("Employee {EmployeeId} deleting attendance {AttendanceId}", employeeId, id);
        var attendance = await _context.OfficeAttendance.FindAsync(id);
        if (attendance == null)
        {
            return (false, "Attendance record not found", false);
        }
        if (attendance.EmployeeId != employeeId)
        {
            _logger.LogWarning("Employee {EmployeeId} tried to delete attendance {AttendanceId} belonging to employee {OwnerId}", employeeId, id, attendance.EmployeeId);
            return (false, "Forbidden", false); // http 403 forbidden
        }
        _context.OfficeAttendance.Remove(attendance);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Employee {EmployeeId} successfully deleted attendance {AttendanceId}", employeeId, id);
        return (true, null, true); // http 204
    }
}
