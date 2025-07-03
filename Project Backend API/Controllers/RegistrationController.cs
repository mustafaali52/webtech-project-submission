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
    public class RegistrationController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        public RegistrationController(ApplicationDbContext context)
        {
            this._context = context;
        }


        //Get All Registrations
        [HttpGet]
        public ActionResult GetAllRegistrations()
        {
            var registrations = _context.Registrations
                .Include(r => r.Event)
                .Include(r => r.Attendee)
                .ToList();
            if (registrations == null || !registrations.Any())
            {
                return NotFound("No registrations found.");
            }
            return Ok(registrations);
        }

        //Get User Specified Registrations
        [HttpGet("{userId}")]
        public ActionResult GetUserRegistrations(int userId)
        {
            var registrations = _context.Registrations
                .Where(r => r.attendeeId == userId)
                .Include(r => r.Event)
                .ToList();
            if (registrations == null || !registrations.Any())
            {
                return NotFound($"No registrations found for user with ID {userId}.");
            }
            return Ok(registrations);
        }


        //Register for Event
        [HttpPost("register/{eventId}/{userId}")]
        public IActionResult RegisterForEvent(int eventId, int userId, RegistrationDto registrationDto)
        {
            var evt = _context.Events.Find(eventId);
            if (evt == null)
            {
                return NotFound($"Event with ID {eventId} not found.");
            }
            var registration = new Registration
            {
                eventId = eventId,
                attendeeId = userId,
                registeredAt = DateTime.UtcNow
            };

            _context.Registrations.Add(registration);
            _context.SaveChanges();

            return Ok(registration);
        }

        //Deregister from Event
        [HttpPut("{id}")]
        public IActionResult DeregisterFromEvent(int id)
        {
            var registration = _context.Registrations.Find(id);
            if (registration == null)
            {
                return NotFound($"Registration with ID {id} not found.");
            }
            registration.isConfirmed = false;

            _context.SaveChanges();

            return Ok($"Successfully deregistered from event with ID {registration.eventId}.");
        }

        //Remove Registration
        [HttpDelete("{id}")]
        public IActionResult RemoveRegistration(int id)
        {
            var registration = _context.Registrations.Find(id);
            if (registration == null)
            {
                return NotFound($"Registration with ID {id} not found.");
            }
            _context.Registrations.Remove(registration);
            _context.SaveChanges();
            return Ok($"Successfully removed registration with ID {id}.");
        }

    }
}
