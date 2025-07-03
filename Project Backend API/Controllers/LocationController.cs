using Event_Mangement_System_WebTech_Project.Models;
using Event_Mangement_System_WebTech_Project.Models.Dto;
using Event_Mangement_System_WebTech_Project.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Event_Mangement_System_WebTech_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public LocationController(ApplicationDbContext context)
        {
            this._context = context;
        }

        [HttpGet]
        public IActionResult GetLocations()
        {
            var locations = _context.Locations.ToList();
            if (locations == null || !locations.Any())
            {
                return NotFound("No locations found.");
            }
            return Ok(locations);
        }

        [HttpPost]
        public IActionResult AddNewLocation(LocationDto locationDto)
        {
            var location = new Location
            {
                locationName = locationDto.locationName,
                address = locationDto.address,
                capacity = locationDto.capacity
            };

            _context.Locations.Add(location);
            _context.SaveChanges();
            return Ok(location);
        }


        [HttpGet("{id}")]
        public IActionResult GetLocationById(int id)
        {
            var location = _context.Locations.Find(id);
            if (location == null)
            {
                return NotFound($"Location with ID {id} not found.");
            }
            return Ok(location);
        }



        [HttpPut("{id}")]
        public IActionResult EditLocation(int id, LocationDto locationDto)
        {
            var existingLocation = _context.Locations.Find(id);
            if (existingLocation == null)
            {
                return NotFound($"Location with ID {id} not found.");
            }

            existingLocation.locationName = locationDto.locationName;
            existingLocation.address = locationDto.address;
            existingLocation.capacity = locationDto.capacity;

            _context.SaveChanges();
            return Ok(existingLocation);
        }

        [HttpDelete("{id}")]
        public IActionResult RemoveLocation(int id)
        {
            var location = _context.Locations.Find(id);
            if (location == null)
            {
                return NotFound($"Location with ID {id} not found.");
            }
            _context.Locations.Remove(location);
            _context.SaveChanges();
            return Ok($"Location with ID {id} has been removed successfully.");
        }

        [HttpGet("search/{name}")]
        public IActionResult SearchLocationsByName(string name)
        {
            //var locations = _context.Locations
            //    .Where(l => l.locationName.ToLower().Contains(name.ToLower(), StringComparison.OrdinalIgnoreCase))
            //    .ToList();
            var locations = _context.Locations
            .Where(l => l.locationName.ToLower().Contains(name.ToLower()))
            .ToList();

            if (locations == null || !locations.Any())
            {
                return NotFound($"No locations found with name containing '{name}'.");
            }
            return Ok(locations);
        }
    }
}
