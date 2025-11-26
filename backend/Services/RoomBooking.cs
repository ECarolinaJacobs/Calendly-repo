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

        _context.RoomBookings.Add(newBooking);
        _context.SaveChanges();

        return newBooking;
    }
}