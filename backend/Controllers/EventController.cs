using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Context;
using TodoApi.Services;

namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EventController : ControllerBase
{
    private readonly EventContext _context;
    private readonly ProjectContext _projectContext;
    private readonly PointsService _pointsService;

    public record EventCreateRequest(
        string Title,
        string Description,
        string? Image,
        DateTime? StartDate,
        DateTime? EndDate,
        ICollection<Attendee>? Attendees
    );

    public record JoinEventRequest(
        long EmployeeId,
        string? Avatar
    );

    public EventController(EventContext context, ProjectContext projectContext, PointsService pointsService)
    {
        _context = context;
        _projectContext = projectContext;
        _pointsService = pointsService;
    }

    [HttpPost]
    public async Task<ActionResult<Event>> Post(EventCreateRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Description))
        {
            return BadRequest("Title and Description required.");
        }

        Event newEvent = new()
        {
            Title = request.Title,
            Description = request.Description,
            Image = request.Image,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Attendees = (ICollection<Attendee>?)request.Attendees
        };

        _context.Events.Add(newEvent);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(Get),
            new { id = newEvent.Id },
            newEvent);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetById(int id)
    {
        var eventItem = await _context.Events.Include(x => x.Attendees).FirstOrDefaultAsync(e => e.Id == id);

        if (eventItem == null)
        {
            return NotFound($"Event with ID {id} not found.");
        }

        return eventItem;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        Event? eventToDelete = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == id);

        if (eventToDelete == null)
        {
            return NotFound($"Event with ID {id} not found.");
        }

        _context.Events.Remove(eventToDelete);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> Get()
    {
        var events = await _context.Events.Include(e => e.Attendees).ToListAsync();
        return Ok(events);
    }

    [HttpPost("{eventId}/join")]
    public async Task<ActionResult<Attendee>> JoinEvent(int eventId, JoinEventRequest request)
    {
        // Check if event exists
        var eventItem = await _context.Events.FindAsync(eventId);
        if (eventItem == null)
        {
            return NotFound($"Event with ID {eventId} not found.");
        }

        // Check if employee exists
        var employee = await _projectContext.Employees.FindAsync(request.EmployeeId);
        if (employee == null)
        {
            return BadRequest("Invalid employee ID.");
        }

        // Check if employee is already attending this event
        var existingAttendee = await _context.Attendees
            .FirstOrDefaultAsync(a => a.EventId == eventId && a.EmployeeId == request.EmployeeId);

        if (existingAttendee != null)
        {
            return Conflict("Employee is already attending this event.");
        }

        // Create new attendee
        var attendee = new Attendee
        {
            Name = employee.Name,
            Avatar = request.Avatar,
            EmployeeId = request.EmployeeId,
            EventId = eventId
        };

        _context.Attendees.Add(attendee);
        await _context.SaveChangesAsync();

        // Award points for joining event
        await _pointsService.AwardEventJoinPointsAsync(request.EmployeeId);

        return CreatedAtAction(
            nameof(JoinEvent),
            new { eventId = eventId, attendeeId = attendee.Id },
            attendee);
    }
}
