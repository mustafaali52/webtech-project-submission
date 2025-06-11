using EmployeeManagementSystem.DTOs.Auth;
using EmployeeManagementSystem.Helpers;
using EmployeeManagementSystem.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IAuditLogService _auditLogService;

        public AuthController(IAuthService authService, IAuditLogService auditLogService)
        {
            _authService = authService;
            _auditLogService = auditLogService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.RegisterAsync(model);

            if (result == "Email already exists")
                return Conflict(new { message = result });

            // Get the created user by email to get the userId
            var user = await _authService.GetUserByEmailAsync(model.Email);
            if (user != null)
            {
                await _auditLogService.LogAsync(user.Id, $"User registered with email {model.Email}");
            }

            return Ok(new { message = result });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = await _authService.LoginAsync(model);

            if (token == null)
                return Unauthorized(new { message = "Invalid email or password" });

            // Get user by email to get the userId for audit log
            var user = await _authService.GetUserByEmailAsync(model.Email);
            if (user != null)
            {
                await _auditLogService.LogAsync(user.Id, $"User logged in with email {model.Email}");
            }

            return Ok(new { token });
        }

        [HttpGet("me")]
        [Authorize(Roles = Role.Admin)]
        public IActionResult GetCurrentUser()
        {
            var name = User.Identity?.Name ?? "Unknown";
            var role = User.Claims.FirstOrDefault(c => c.Type == "role")?.Value ?? "Unknown";
            var email = User.Claims.FirstOrDefault(c => c.Type == "email")?.Value ?? "Unknown";

            return Ok(new
            {
                message = "Authenticated user",
                name,
                email,
                role
            });
        }
    }
}
