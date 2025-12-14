using TodoApi.Services;

namespace TodoApi.Context;

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
            throw new Exception("Invalid employee ID");
        }
        if (!_context.Rooms.Any(r => r.Id == newBooking.RoomId))
        {
            throw new Exception("Invalid Room ID");
        }

        _context.RoomBookings.Add(newBooking);
        await _context.SaveChangesAsync();

        // Award points for room booking
        await _pointsService.AwardRoomBookingPointsAsync(newBooking.EmployeeId);

        return newBooking;
    }

    // Keep the synchronous method for backward compatibility
    public RoomBooking CreateBooking(RoomBooking newBooking)
    {
        return CreateBookingAsync(newBooking).GetAwaiter().GetResult();
    }
}