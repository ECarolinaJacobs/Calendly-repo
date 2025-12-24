using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;
using TodoApi.Services;
using TodoApi.DTOs;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly EventService _eventService;

        public EventController(EventService eventService)
        {
            _eventService = eventService;
        }

        [HttpPost]
        public async Task<ActionResult<Event>> Post(EventCreateRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Title) ||
                string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest("Title and Description required.");
            }

            var newEvent = await _eventService.CreateEventAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = newEvent.Id },
                newEvent);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventDto>> GetById(long id)
        {
            var eventDto = await _eventService.GetEventByIdAsync(id);

            if (eventDto == null)
            {
                return NotFound($"Event with ID {id} not found.");
            }

            return eventDto;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EventDto>> Update(long id, EventCreateRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Title) ||
                string.IsNullOrWhiteSpace(request.Description))
            {
                return BadRequest("Title and Description required.");
            }

            var updatedEvent = await _eventService.UpdateEventAsync(id, request);

            if (updatedEvent == null)
                return NotFound($"Event with ID {id} not found.");

            return Ok(updatedEvent);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            var result = await _eventService.DeleteEventAsync(id);

            if (!result)
            {
                return NotFound($"Event with ID {id} not found.");
            }

            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> Get()
        {
            var eventDtos = await _eventService.GetAllEventsAsync();
            return Ok(eventDtos);
        }

        [HttpPost("{eventId}/join")]
        public async Task<ActionResult<AttendeeDto>> JoinEvent(long eventId, JoinEventRequest request)
        {
            var (attendeeDto, error) = await _eventService.JoinEventAsync(eventId, request);

            if (error != null)
            {
                if (error.Contains("not found"))
                    return NotFound(error);
                if (error.Contains("Invalid"))
                    return BadRequest(error);
                if (error.Contains("already attending"))
                    return Conflict(error);
            }

            return CreatedAtAction(
                nameof(JoinEvent),
                new { eventId = eventId, attendeeId = attendeeDto!.Id },
                attendeeDto);
        }
    }
}
