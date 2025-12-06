
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TodoApi.Context;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly ProjectContext _context;

        public UserController(ProjectContext context)
        {
            _context = context;
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
    }
}
