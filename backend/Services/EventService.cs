using Microsoft.EntityFrameworkCore;
using TodoApi.Context;
using TodoApi.Models;
using TodoApi.DTOs;

namespace TodoApi.Services
{
    public class EventService
    {
        private readonly EventContext _context;
        private readonly ProjectContext _projectContext;
        private readonly PointsService _pointsService;

        public EventService(EventContext context, ProjectContext projectContext, PointsService pointsService)
        {
            _context = context;
            _projectContext = projectContext;
            _pointsService = pointsService;
        }

        public async Task<Event> CreateEventAsync(EventCreateRequest request)
        {
            Event newEvent = new()
            {
                Title = request.Title,
                Description = request.Description,
                Image = request.Image,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Attendees = request.Attendees ?? new List<Attendee>()
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return newEvent;
        }

        public async Task<EventDto?> GetEventByIdAsync(long id)
        {
            var eventItem = await _context.Events
                .Include(x => x.Attendees)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (eventItem == null)
            {
                return null;
            }

            return new EventDto(
                eventItem.Id,
                eventItem.Title,
                eventItem.Description,
                eventItem.Image,
                eventItem.StartDate,
                eventItem.EndDate,
                eventItem.Attendees?.Select(a => new AttendeeDto(
                    a.Id,
                    a.Name,
                    a.Avatar,
                    a.EmployeeId
                )).ToList()
            );
        }

        public async Task<bool> DeleteEventAsync(long id)
        {
            var eventToDelete = await _context.Events.FindAsync(id);

            if (eventToDelete == null)
            {
                return false;
            }

            _context.Events.Remove(eventToDelete);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<EventDto>> GetAllEventsAsync()
        {
            var events = await _context.Events
                .Include(e => e.Attendees)
                .ToListAsync();

            return events.Select(e => new EventDto(
                e.Id,
                e.Title,
                e.Description,
                e.Image,
                e.StartDate,
                e.EndDate,
                e.Attendees?.Select(a => new AttendeeDto(
                    a.Id,
                    a.Name,
                    a.Avatar,
                    a.EmployeeId
                )).ToList()
            ));
        }

        public async Task<(AttendeeDto?, string?)> JoinEventAsync(long eventId, JoinEventRequest request)
        {
            var eventItem = await _context.Events.FindAsync(eventId);
            if (eventItem == null)
            {
                return (null, $"Event with ID {eventId} not found.");
            }

            var employee = await _projectContext.Employees.FindAsync(request.EmployeeId);
            if (employee == null)
            {
                return (null, "Invalid employee ID.");
            }

            var existingAttendee = await _context.Attendees
                .FirstOrDefaultAsync(a => a.EventId == eventId && a.EmployeeId == request.EmployeeId);

            if (existingAttendee != null)
            {
                return (null, "Employee is already attending this event.");
            }

            var attendee = new Attendee
            {
                Name = employee.Name,
                Avatar = request.Avatar,
                EmployeeId = request.EmployeeId,
                EventId = eventId
            };

            _context.Attendees.Add(attendee);
            await _context.SaveChangesAsync();

            await _pointsService.AwardEventJoinPointsAsync(request.EmployeeId);

            var attendeeDto = new AttendeeDto(
                attendee.Id,
                attendee.Name,
                attendee.Avatar,
                attendee.EmployeeId
            );

            return (attendeeDto, null);
        }
    }
}
