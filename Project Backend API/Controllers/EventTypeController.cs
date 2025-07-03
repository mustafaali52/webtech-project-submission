using Event_Mangement_System_WebTech_Project.Models;
using Event_Mangement_System_WebTech_Project.Models.Dto;
using Event_Mangement_System_WebTech_Project.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Event_Mangement_System_WebTech_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventTypeController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        public EventTypeController(ApplicationDbContext context)
        {
            this._context = context;
        }

        // Show Event Types
        [HttpGet]
        public IActionResult GetEventTypes()
        {
            var eventTypes = _context.EventTypes.ToList();
            if (eventTypes == null || !eventTypes.Any())
            {
                return NotFound("No event types found.");
            }
            return Ok(eventTypes);
        }

        // Add New Event Type
        [HttpPost]
        public IActionResult AddNewEventType(EventTypeDto eventTypeDto)
        {
            var evtType = new EventType
            {
                typeName = eventTypeDto.typeName
            };

            _context.EventTypes.Add(evtType);
            _context.SaveChanges();

            return Ok(evtType);
        }

        // Edit Event Type
        [HttpPut("{id}")]
        public IActionResult EditEventType(int id, EventType eventType)
        {
            var existingEventType = _context.EventTypes.Find(id);
            if (existingEventType == null)
            {
                return NotFound($"Event type with ID {id} not found.");
            }
            existingEventType.typeName = eventType.typeName;
            _context.SaveChanges();

            return Ok(eventType);
        }

        // Delete Event Type
        [HttpDelete("{id}")]
        public IActionResult RemoveEventType(int id)
        {
            var eventType = _context.EventTypes.Find(id);
            if (eventType == null)
            {
                return NotFound($"Event type with ID {id} not found.");
            }
            _context.EventTypes.Remove(eventType);
            _context.SaveChanges();

            return Ok($"Event type with ID {id} deleted successfully.");
        }

        //Search Event Type by Name
        [HttpGet("search/{name}")]
        public IActionResult SearchEventTypeByName(string name)
        {
            var eventType = _context.EventTypes
            .FirstOrDefault(e => e.typeName.ToLower().Contains(name.ToLower()));
            if (eventType == null)
            {
                return NotFound($"No event type found with name {name}.");
            }
            return Ok(eventType);
        }


    }
}
