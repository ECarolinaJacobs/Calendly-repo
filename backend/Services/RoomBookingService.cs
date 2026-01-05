using System.Globalization;
using TodoApi.Models;
using TodoApi.Context;

namespace TodoApi.Services;

public class RoomBookingService
{
    private readonly ProjectContext _context;
    private readonly PointsService _pointsService;

    public RoomBookingService(ProjectContext context, PointsService pointsService)
    {
        _context = context;
        _pointsService = pointsService;
    }
    
    public async Task<RoomBooking> CreateBookingAsync(RoomBooking newBooking)
    {
        if (!_context.Employees.Any(e => e.Id == newBooking.EmployeeId))
        {
            throw new ResourceDoesNotExistException("User");
        }
        if (!_context.Rooms.Any(r => r.Id == newBooking.RoomId))
        {
            throw new ResourceDoesNotExistException("Room");
        }
        if (!CheckRoomAvailability(newBooking))
        {
            throw new RoomAlreadyBookedException();
        }

        _context.RoomBookings.Add(newBooking);
        await _context.SaveChangesAsync();

        // Award points for room booking
        await _pointsService.AwardRoomBookingPointsAsync(newBooking.EmployeeId);

        return newBooking;
    }

    public bool CheckRoomAvailability(RoomBooking newBooking)
    {
        // Fetch times for new booking
        DateTime startNewBooking = DateTime.ParseExact(
            newBooking.StartTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);
        DateTime endNewBooking = DateTime.ParseExact(
            newBooking.EndTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);

        foreach (RoomBooking booking in _context.RoomBookings)
        {
            if (booking.RoomId == newBooking.RoomId)
            {
                // Fetch times for existing booking
                DateTime startExistingBooking = DateTime.ParseExact(
                    booking.StartTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);
                DateTime endExistingBooking = DateTime.ParseExact(
                    booking.EndTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);

                // Check if existing and new booking times overlap
                if (startNewBooking < endExistingBooking && endNewBooking > startExistingBooking) return false;
            }
        }
        return true;
    }
}