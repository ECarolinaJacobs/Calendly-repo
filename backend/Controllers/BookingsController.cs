using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using System.Security.Claims;

using TodoApi.Models;
using TodoApi.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookingsController : ControllerBase
{
    private readonly ProjectContext _context;
    private readonly RoomBookingService _roomBookingService;

    public BookingsController(ProjectContext context, RoomBookingService roomBookingService)
    {
        _context = context;
        _roomBookingService = roomBookingService;
    }

    [Authorize]
    [HttpPost("start")]
    public async Task<ActionResult<RoomBooking>> BookRoom(RoomBooking newBooking)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        newBooking.EmployeeId = long.Parse(userId);
        var createdBooking = _roomBookingService.CreateBooking(newBooking);
        return Ok(createdBooking);
    }
}