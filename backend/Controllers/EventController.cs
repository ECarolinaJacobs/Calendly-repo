using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using TodoApi.Context;

namespace TodoApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EventController : ControllerBase
{
    private readonly EventContext _context;

    public record EventCreateRequest(
        string Title,
        string Description,
        string? Image,
        DateTime? StartDate,
        DateTime? EndDate,
        ICollection<Attendee>? Attendees
    );

    public EventController(EventContext context)
    {
        _context = context;
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
    public async Task<ActionResult<IEnumerable<Event>>> Get() // FIX: The return type for multiple items should be IEnumerable<Event>
    {
        var events = await _context.Events.Include(e => e.Attendees).ToListAsync();
        return Ok(events);
    }
}