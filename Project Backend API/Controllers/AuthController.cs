using Event_Mangement_System_WebTech_Project.Models;
using Event_Mangement_System_WebTech_Project.Models.Dto;
using Event_Mangement_System_WebTech_Project.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Event_Mangement_System_WebTech_Project.Controllers
{
    [Route("auth/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        //SignUp
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            using var hmac = new HMACSHA512();
            var user = new User
            {
                userName = userDto.userName,
                email = userDto.email,
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.passwordHash)),
                passwordSalt = hmac.Key,
                userRoleId = userDto.userRoleId
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok($"Signed up Successfully");
        }

        //Login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserDto userDto)
        {
            var user = await _context.Users
                                     .Include(u => u.Role)
                                     .FirstOrDefaultAsync(x => x.userName == userDto.userName);

            if (user is null)
                return Unauthorized("Invalid username or password.");

            // validate password
            using var hmac = new HMACSHA512(user.passwordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(userDto.passwordHash));
            if (!computedHash.SequenceEqual(user.passwordHash))
                return Unauthorized("Invalid password.");

            // create JWT
            var token = await CreateTokenAsync(user);   
            return Ok(new { token });                   
        }

        //function for Creating JWT Token
        private Task<string> CreateTokenAsync(User user)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.userName),
        new Claim(ClaimTypes.Role, user.Role.roleName)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["TokenKey"] ?? "SuperSecretKey"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);

            return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
        }

    }
}
