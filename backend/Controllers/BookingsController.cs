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
    private readonly RoomBookingContext _context;

    public BookingsController(RoomBookingContext context)
    {
        _context = context;
    }
}

[HttpPost("start")]
public async Task<ActionResult<RoomBooking>> BookRoom(Room room)
{
    RoomBooking new_booking = new(room.Id, );
    _context.Add()
}