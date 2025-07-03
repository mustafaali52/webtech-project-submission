using Event_Mangement_System_WebTech_Project.Services;
using Event_Mangement_System_WebTech_Project.Models;
using Event_Mangement_System_WebTech_Project.Models.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Event_Mangement_System_WebTech_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
       private readonly ApplicationDbContext _context;
        public UserRoleController(ApplicationDbContext context)
        {
            this._context = context;
        }

        //Get All User Roles
        [HttpGet]
        public IActionResult GetUserRoles()
        {
            var userRoles = _context.Roles.ToList();
            if (userRoles == null || !userRoles.Any())
            {
                return NotFound("No user roles found.");
            }
            return Ok(userRoles);
        }

        //Add New User Role
        [HttpPost]
        public IActionResult AddNewUserRole(UserRoleDto userRoleDto)
        {
            var userRole = new Role
            {
                roleName = userRoleDto.roleName
            };
            _context.Roles.Add(userRole);
            _context.SaveChanges();
            return Ok(userRole);
        }

        //Remove User Role
        [HttpDelete("{id}")]
        public IActionResult RemoveUserRole(int id)
        {
            var userRole = _context.Roles.Find(id);
            if (userRole == null)
            {
                return NotFound($"User role with ID {id} not found.");
            }
            _context.Roles.Remove(userRole);
            _context.SaveChanges();
            return Ok($"User role with ID {id} has been removed successfully.");
        }
    }
}
