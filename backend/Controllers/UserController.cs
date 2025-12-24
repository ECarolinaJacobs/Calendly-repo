
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TodoApi.Context;
using TodoApi.Services;
using TodoApi.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly PointsService _pointsService;

        private readonly UserService _userService;
        private readonly ILogger<UserController> _logger;


        public UserController(UserService userService, PointsService pointsService, ILogger<UserController> logger)
        {
            _userService = userService;
            _pointsService = pointsService;
            _logger = logger;
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetUserBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var bookings = await _userService.GetUserBookings(int.Parse(userId));

            if (bookings == null || !bookings.Any())
            {
                return NotFound("No bookings found for this user.");
            }

            return Ok(bookings);
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

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUserInformation(long id)
        {
            try
            {
                _logger.LogInformation("Retrieving user information for Id: {UserId}", id);

                var employee = await _userService.GetUserInformation(id);

                if (employee == null)
                {
                    _logger.LogWarning("Employee with ID {EmployeeId} not found", id);
                    return NotFound(new { message = "Employee not found" });
                }

                return Ok(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user information for Id: {UserId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDTO>> UpdateUserInformation(long id, UpdateUserDTO UpdatedUserInfo)
        {
            try
            {
                var employee = await _userService.UpdateUserInformation(id, UpdatedUserInfo);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user information for Id: {UserId}", id);
                return StatusCode(500, new { message = "Internal server error" }); // HTTP 500
            }
        }

    }
}
