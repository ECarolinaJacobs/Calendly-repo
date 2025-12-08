using System.Globalization;
using TodoApi.Models;

namespace TodoApi.Context;

public class RoomBookingService
{
    private readonly ProjectContext _context;

    public RoomBookingService(ProjectContext context)
    {
        _context = context;
    }
    
    public RoomBooking CreateBooking(RoomBooking newBooking)
    {
        if (!_context.Employees.Any(e => e.Id == newBooking.EmployeeId))
        {
            throw new Exception("Invalid employee ID");
        }
        if (!_context.Rooms.Any(r => r.Id == newBooking.RoomId))
        {
            throw new Exception("Invalid Room ID");
        }
        if (!CheckRoomAvailability(newBooking))
        {
            throw new Exception("Room already booked for this time");
        }

        _context.RoomBookings.Add(newBooking);
        _context.SaveChanges();

        return newBooking;
    }

    public bool CheckRoomAvailability(RoomBooking newBooking)
    {
        DateTime startNewBooking = DateTime.ParseExact(
            newBooking.StartTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);
        DateTime endNewBooking = DateTime.ParseExact(
            newBooking.EndTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);

        foreach (RoomBooking booking in _context.RoomBookings)
        {
            if (booking.RoomId == newBooking.RoomId)
            {
                DateTime startExistingBooking = DateTime.ParseExact(
                    booking.StartTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);
                DateTime endExistingBooking = DateTime.ParseExact(
                    booking.EndTime, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);

                if (startNewBooking < endExistingBooking && endNewBooking > startExistingBooking) return false;
            }
        }
        return true;
    }
}