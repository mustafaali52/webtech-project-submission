using Event_Mangement_System_WebTech_Project.Models;
using Event_Mangement_System_WebTech_Project.Models.Dto;
using Event_Mangement_System_WebTech_Project.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Event_Mangement_System_WebTech_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public EventsController(ApplicationDbContext context)
        {
            this._context = context;
        }


        //All Events by latest.
        [HttpGet]
        public ActionResult GetEvents()
        {
            var events = _context.Events.OrderByDescending(e => e.createdAt).ToList();
            return Ok(events);
        }

        //Event by Id
        [HttpGet("{id}")]
        public ActionResult GetEventbyId(int id)
        {
            var eventbyId = _context.Events.Find(id);
            if (eventbyId == null)
            {
                return NotFound();
            }

            return Ok(eventbyId);

        }

        //Create Event
        [HttpPost]
        public IActionResult CreateEvent(EventDto eventDto)
        {
            var evt = new Event
            {
                eventTitle = eventDto.eventTitle,
                eventTypeId = eventDto.eventTypeId,
                description = eventDto.description,
                startDate = eventDto.startDate,
                endDate = eventDto.endDate,
                organizerId = eventDto.organizerId,
                locationId = eventDto.locationId,
                createdAt = DateTime.UtcNow

            };

            _context.Events.Add(evt);
            _context.SaveChanges();

            return Ok(evt);
        }

        //Edit Event
        [HttpPut("{id}")]
        public IActionResult EditEvent(int id, EventDto eventDto)
        {
            var evt = _context.Events.Find(id);
            if (evt == null)
            {
                return NotFound();
            }

            evt.eventTitle = eventDto.eventTitle;
            evt.eventTypeId = eventDto.eventTypeId;
            evt.description = eventDto.description;
            evt.startDate = eventDto.startDate;
            evt.endDate = eventDto.endDate;
            evt.locationId = eventDto.locationId;

            _context.SaveChanges();

            return Ok(evt);

        }

        //Delete Event
        [HttpDelete("{id}")]
        public IActionResult RemoveEvent(int id)
        {
            var evt = _context.Events.Find(id);
            if (evt == null)
            {
                return NotFound();
            }

            _context.Events.Remove(evt);
            _context.SaveChanges();

            return Ok(evt);
        }

        //Event by Event Type
        [HttpGet("type/{eventTypeId}")]
        public IActionResult GetEventsByType(int eventTypeId)
        {
            var events = _context.Events.Where(e => e.eventTypeId == eventTypeId).ToList();
            if (events == null || !events.Any())
            {
                return NotFound($"No events found for event type ID {eventTypeId}.");
            }
            return Ok(events);

        }

        //Search Event by Name
        [HttpGet("search/{eventTitle}")]
        public IActionResult SearchEventByName(string eventTitle)
        {
            var events = _context.Events.Where(e => e.eventTitle.Contains(eventTitle)).ToList();
            if (events == null || !events.Any())
            {
                return NotFound($"No events found with title containing '{eventTitle}'.");
            }
            return Ok(events);
        }

    }
}