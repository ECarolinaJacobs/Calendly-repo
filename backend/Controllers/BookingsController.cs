using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;
using System.Security.Claims;

using TodoApi.Models;
using TodoApi.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Net;
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
        try
        {
            var createdBooking = _roomBookingService.CreateBooking(newBooking);
            return CreatedAtAction("Room booked", createdBooking);
        }
        catch (RoomAlreadyBookedException ex)
        {
            return Conflict(ex.Message);
        }
        catch (ResourceDoesNotExistException ex)
        {
            return NotFound(ex.Message);
        }
    }
}