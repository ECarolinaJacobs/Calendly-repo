//elena
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApi.DTOs;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers;
/// <summary>
/// manages employee office attendance bookings
/// employees can only modify their own attendance
/// prevents double booking per employee per date
/// prevents booking dates in the past
/// </summary>
[ApiController]
[Route("api/attendance")]
[Microsoft.AspNetCore.Authorization.Authorize] // must be logged in as said user
public class OfficeAttendanceController : ControllerBase
{
    private readonly OfficeAttendanceService _attendanceService;
    private readonly ILogger<OfficeAttendanceController> _logger;
    public OfficeAttendanceController(OfficeAttendanceService attendanceService, ILogger<OfficeAttendanceController> logger)
    {
        _attendanceService = attendanceService;
        _logger = logger;
    }
    ///<summary>
    /// gets users employee id from jwt token 
    /// </summary>
    private long GetCurrentEmployeeId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User id not found");
        }
        return long.Parse(userIdClaim);
    }
    /// <summary>
    /// get all attendance records for logged in user
    /// </summary>
    /// <returns>array of attendance records of current user</returns>
    [HttpGet]
    public async Task<ActionResult<List<OfficeAttendanceDto>>> GetMyAttendance()
    {
        try
        {
            var employeeId = GetCurrentEmployeeId();
            var attendances = await _attendanceService.GetMyAttendance(employeeId);
            return Ok(attendances);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving attendance");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    ///<summary>
    /// books office attendance for specific date
    /// request: post /api/attendance
    /// validation: date cannot be in the past 
    /// employee cannot book same date twice
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<OfficeAttendanceDto>> CreateAttendance(CreateOfficeAttendanceRequest request)
    {
        try
        {
            var employeeId = GetCurrentEmployeeId();
            var (success, errorMessage, result) = await _attendanceService.CreateAttendance(employeeId, request.Date);
            if (!success)
            {
                if (errorMessage?.Contains("past dates") == true)
                {
                    return BadRequest(new { message = errorMessage });
                }
                return Conflict(new { message = errorMessage });
            }
            return CreatedAtAction(nameof(GetMyAttendance), result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating attendance for the office");

            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    ///<summary>
    /// update existing booking
    /// request: put /api/attendance/{id}
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAttendance(long id, UpdateOfficeAttendanceRequest request)
    {

        try
        {
            var employeeId = GetCurrentEmployeeId();
            var (success, errorMessage, isOwner) = await _attendanceService.UpdateAttendance(id, employeeId, request.Date);
            if (!success)
            {
                if (errorMessage == "Attendance booking not found")
                {
                    return NotFound(new { message = errorMessage });
                }
                if (!isOwner)
                {
                    return StatusCode(403, new {message = "You can only modify your own attendance bookings"});
                }
                if (errorMessage == "Forbidden")
                {
                    return Forbid();
                }
                if (errorMessage?.Contains("past") == true)
                {
                    return BadRequest(new { message = errorMessage });
                }
                return Conflict(new { message = errorMessage });
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating attendance {AttendanceId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    ///<summary>
    /// deletes an attendance booking
    /// request: DELETE /api/attendance/{id}
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAttendance(long id)
    {
        try
        {
            var employeeId = GetCurrentEmployeeId();
            var (success, errorMessage, isOwner) = await _attendanceService.DeleteAttendance(id, employeeId);
            if (!success)
            {
                if (errorMessage == "Attendance booking not found")
                {
                    return NotFound(new { message = errorMessage });
                }
                if (!isOwner)
                {
                    return StatusCode(403, new {message = "You can only delete your own attendance booking"});
                }
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting attendance {AttendanceId}", id);
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}
