using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using QUIZGAME.Dtos;
using QUIZGAME.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace QUIZGAME.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly MyDataContext _context;
        private readonly IConfiguration _config;

        public AuthController(MyDataContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto request)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            if (request.Role == "Teacher")
            {
                if (_context.Teachers.Any(t => t.Username == request.Username))
                    return BadRequest("Teacher already exists.");

                var teacher = new Teacher
                {
                    Username = request.Username,
                    Password = hashedPassword,
                    Role = "Teacher"
                };
                _context.Teachers.Add(teacher);
            }
            else if (request.Role == "Student")
            {
                if (_context.Users.Any(u => u.Username == request.Username))
                    return BadRequest("User already exists.");

                var user = new User
                {
                    Username = request.Username,
                    Password = hashedPassword,
                    Role = "Student"
                };
                _context.Users.Add(user);
            }
            else
            {
                return BadRequest("Invalid role.");
            }

            await _context.SaveChangesAsync();
            return Ok("Registered successfully.");
        }

        [HttpPost("login")]
        public IActionResult Login(UserDto request)
        {
            if (request.Role == "Teacher")
            {
                var teacher = _context.Teachers.FirstOrDefault(t => t.Username == request.Username);
                if (teacher == null || !BCrypt.Net.BCrypt.Verify(request.Password, teacher.Password))
                    return Unauthorized("Invalid teacher credentials.");

                var token = CreateToken(teacher.Id, teacher.Username, "Teacher");
                return Ok(new { token = $"Bearer {token}" });

            }
            else if (request.Role == "Student")
            {
                var user = _context.Users.FirstOrDefault(u => u.Username == request.Username);
                if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                    return Unauthorized("Invalid user credentials.");

                var token = CreateToken(user.Id, user.Username, "Student");
                return Ok(new { token = $"Bearer {token}" });


            }

            return BadRequest("Invalid role.");
        }
        private string CreateToken(int id, string username, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"] ?? "SuperSecretKeyIsThis"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }

}
