using Microsoft.EntityFrameworkCore;
using TodoApi.DTOs;
using TodoApi.Models;

namespace TodoApi.Context;

public class RoomService
{
    private readonly ProjectContext _context;

    public RoomService(ProjectContext context)
    {
        _context = context;
    }
    
    public async Task<List<Room>> GetFilteredRooms(RoomFilterDTO roomFilter)
    {
        List<Room> filteredRooms = new();
        var rooms = await _context.Rooms.ToListAsync();

        foreach (var room in rooms)
        {
            if (room.Floor == roomFilter.Floor) filteredRooms.Add(room);
        }

        return filteredRooms;
    }
}