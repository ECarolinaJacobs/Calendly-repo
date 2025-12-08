
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TodoApi.Context;
using TodoApi.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly ProjectContext _context;
        private readonly PointsService _pointsService;

        public UserController(ProjectContext context, PointsService pointsService)
        {
            _context = context;
            _pointsService = pointsService;
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetUserBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var bookings = await _context.RoomBookings
                .Where(rb => rb.EmployeeId == int.Parse(userId))
                .Include(rb => rb.Room)
                .OrderByDescending(rb => rb.StartTime)
                .ToListAsync();

            if (bookings == null || !bookings.Any())
            {
                return NotFound("No bookings found for this user.");
            }

            var bookingResults = bookings.Select(b => new
            {
                b.Id,
                RoomName = b.Room?.Name,
                b.StartTime,
                b.EndTime
            }).ToList();

            return Ok(bookingResults);
        }

        [HttpGet("points")]
        public async Task<IActionResult> GetUserPoints()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var points = await _pointsService.GetEmployeePointsAsync(long.Parse(userId));
            return Ok(new { points = points });
        }
    }
}
