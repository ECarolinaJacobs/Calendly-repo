using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

using TodoApi.Models;
using TodoApi.Context;
using Microsoft.AspNetCore.Identity;
using TodoApi.DTOs;
namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly ProjectContext _context;
    private readonly RoomService _roomService;

    public RoomsController(ProjectContext context, RoomService roomService)
    {
        _context = context;
        _roomService = roomService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Room>>> GetRooms()
    {
        var rooms = await _context.Rooms.ToListAsync();
        return Ok(rooms);
    }

    [HttpPost("filtered")]
    public async Task<ActionResult<List<Room>>> GetFilteredRooms([FromBody] RoomFilterDTO roomFilter)
    {
        var filteredRooms = await _roomService.GetFilteredRooms(roomFilter);
        return filteredRooms;
    }
}