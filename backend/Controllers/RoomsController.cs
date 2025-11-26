using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

using TodoApi.Models;
using TodoApi.Context;
using Microsoft.AspNetCore.Identity;
namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly ProjectContext _context;
    private readonly RoomBookingService _roomBookingService;

    public RoomsController(ProjectContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<RoomBooking>> GetRooms()
    {
        var rooms = _context.Rooms.ToListAsync();
        return Ok(rooms);
    }
}