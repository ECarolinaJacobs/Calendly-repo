using Microsoft.EntityFrameworkCore;
using System.Globalization;
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
            // Add room to list if not already booked
            if (!CheckRoomAlreadyBooked(room, roomFilter))
            {
                filteredRooms.Add(room);
            }
        }

        // Filter through list to keep only relevant floor
        if (roomFilter.Floor != null)
        {
            filteredRooms = filteredRooms
            .Where(r => r.Floor == roomFilter.Floor)
            .ToList();
        }

        return filteredRooms;
    }

    public bool CheckRoomAlreadyBooked(Room room, RoomFilterDTO roomFilter)
    {
        var bookings = _context.RoomBookings.ToList();

        if (roomFilter.StartTime != null && roomFilter.EndTime != null)
        {
            DateTime startFilter = DateTime.ParseExact(
                roomFilter.StartTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);
            DateTime endFilter = DateTime.ParseExact(
                roomFilter.EndTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);

            foreach (var booking in bookings)
            {
                if (booking.RoomId == room.Id)
                {
                    DateTime startTime = DateTime.ParseExact(
                        booking.StartTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);
                    DateTime endTime = DateTime.ParseExact(
                        booking.EndTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);

                    if (startFilter < endTime && endFilter > startTime) return true;
                }
            }
            return false;
        }
        return false;
    }

    // public Room FindRoomById(long id)
    // {
    //     var rooms = _context.Rooms.ToList();
    //     foreach (var room in rooms)
    //     {
    //         if (room.Id == id) return room;
    //     }
    //     return null;
    // }
}