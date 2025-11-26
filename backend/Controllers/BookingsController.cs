using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

using TodoApi.Models;
using TodoApi.Context;
using Microsoft.AspNetCore.Identity;
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

    [HttpPost("start")]
    public async Task<ActionResult<RoomBooking>> BookRoom(RoomBooking newBooking)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var createdBooking = _roomBookingService.CreateBooking(newBooking);
        return Ok(createdBooking);
    }
}