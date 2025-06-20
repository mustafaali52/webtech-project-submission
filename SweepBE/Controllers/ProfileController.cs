using Clerk.Net.Client.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWEEP.Data;
using SWEEP.DTOs.RequestDTOs.Profile;
using SWEEP.DTOs.ResponseDTOs.Profile;
using SWEEP.Models;
using System.Security.Claims;

namespace SWEEP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly SweepDbContext _context;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(SweepDbContext context, ILogger<ProfileController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("student")]
        public async Task<IActionResult> CreateStudentProfile([FromBody] StudentProfileRequest request)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (user.Role != UserRole.Student)
            {
                return BadRequest(new { message = "User must have Student role to create a student profile" });
            }

            var existingProfile = await _context.StudentProfiles.FindAsync(userId.Value);
            if (existingProfile != null)
            {
                return BadRequest(new { message = "Student profile already exists for this user" });
            }

            var field = await _context.Fields.FindAsync(request.FieldId);
            if (field == null)
            {
                return BadRequest(new { message = "Invalid field ID" });
            }

            var studentProfile = new StudentProfile
            {
                UserId = userId.Value,
                StudentName = request.StudentName,
                University = request.University,
                CGPA = request.CGPA,
                GraduationYear = request.GraduationYear,
                PriorExperienceYears = request.PriorExperienceYears,
                FieldId = request.FieldId
            };

            _context.StudentProfiles.Add(studentProfile);
            await _context.SaveChangesAsync();

            var responseDto = new StudentProfileResponseDTO
            {
                UserId = studentProfile.UserId,
                StudentName = studentProfile.StudentName,
                University = studentProfile.University,
                CGPA = studentProfile.CGPA,
                GraduationYear = studentProfile.GraduationYear,
                PriorExperienceYears = studentProfile.PriorExperienceYears,
                TokenBalance = studentProfile.TokenBalance,
                FieldId = studentProfile.FieldId,
                FieldName = field.Name,
                Email = user.Email
            };

            return CreatedAtAction(nameof(GetStudentProfile), null, responseDto);
        }

        [HttpPost("employer")]
        public async Task<IActionResult> CreateEmployerProfile([FromBody] EmployerProfileRequest request)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            //userExists
            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (user.Role != UserRole.Employer)
            {
                return BadRequest(new { message = "User must have Employer role to create an employer profile" });
            }

            //profExists
            var existingProfile = await _context.EmployerProfiles.FindAsync(userId.Value);
            if (existingProfile != null)
            {
                return BadRequest(new { message = "Employer profile already exists for this user" });
            }

            //create prof
            var employerProfile = new EmployerProfile
            {
                UserId = userId.Value,
                EmployerName = request.EmployerName,
                Organization = request.Organization
            };

            _context.EmployerProfiles.Add(employerProfile);
            await _context.SaveChangesAsync();

            var responseDto = new EmployerProfileResponseDTO
            {
                UserId = employerProfile.UserId,
                EmployerName = employerProfile.EmployerName,
                Organization = employerProfile.Organization,
                Email = user.Email
            };

            return CreatedAtAction(nameof(GetEmployerProfile), null, responseDto);
        }

        [HttpGet("student")]
        public async Task<IActionResult> GetStudentProfile()
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var profile = await _context.StudentProfiles
                .Include(sp => sp.Field)
                .Include(sp => sp.User)
                .FirstOrDefaultAsync(sp => sp.UserId == userId.Value);

            if (profile == null)
            {
                return NotFound(new { message = "Student profile not found" });
            }

            //circular ref
            var responseDto = new StudentProfileResponseDTO
            {
                UserId = profile.UserId,
                StudentName = profile.StudentName,
                University = profile.University,
                CGPA = profile.CGPA,
                GraduationYear = profile.GraduationYear,
                PriorExperienceYears = profile.PriorExperienceYears,
                TokenBalance = profile.TokenBalance,
                FieldId = profile.FieldId,
                FieldName = profile.Field?.Name ?? string.Empty,
                Email = profile.User?.Email ?? string.Empty
            };

            return Ok(responseDto);
        }

        [HttpGet("employer")]
        public async Task<IActionResult> GetEmployerProfile()
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var profile = await _context.EmployerProfiles
                .Include(ep => ep.User)
                .FirstOrDefaultAsync(ep => ep.UserId == userId.Value);

            if (profile == null)
            {
                return NotFound(new { message = "Employer profile not found" });
            }

            var responseDto = new EmployerProfileResponseDTO
            {
                UserId = profile.UserId,
                EmployerName = profile.EmployerName,
                Organization = profile.Organization,
                Email = profile.User?.Email ?? string.Empty
            };

            return Ok(responseDto);
        }

        [HttpPut("student")]
        public async Task<IActionResult> UpdateStudentProfile([FromBody] StudentProfileRequest request)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var profile = await _context.StudentProfiles
                .Include(sp => sp.User)
                .Include(sp => sp.Field)
                .FirstOrDefaultAsync(sp => sp.UserId == userId.Value);
                
            if (profile == null)
            {
                return NotFound(new { message = "Student profile not found" });
            }

            //fieldExist
            var field = await _context.Fields.FindAsync(request.FieldId);
            if (field == null)
            {
                return BadRequest(new { message = "Invalid field ID" });
            }

            //update
            profile.StudentName = request.StudentName;
            profile.University = request.University;
            profile.CGPA = request.CGPA;
            profile.GraduationYear = request.GraduationYear;
            profile.PriorExperienceYears = request.PriorExperienceYears;
            profile.FieldId = request.FieldId;

            await _context.SaveChangesAsync();

            var responseDto = new StudentProfileResponseDTO
            {
                UserId = profile.UserId,
                StudentName = profile.StudentName,
                University = profile.University,
                CGPA = profile.CGPA,
                GraduationYear = profile.GraduationYear,
                PriorExperienceYears = profile.PriorExperienceYears,
                TokenBalance = profile.TokenBalance,
                FieldId = profile.FieldId,
                FieldName = field.Name,
                Email = profile.User?.Email ?? string.Empty
            };

            return Ok(responseDto);
        }

        [HttpPut("employer")]
        public async Task<IActionResult> UpdateEmployerProfile([FromBody] EmployerProfileRequest request)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var profile = await _context.EmployerProfiles
                .Include(ep => ep.User)
                .FirstOrDefaultAsync(ep => ep.UserId == userId.Value);
                
            if (profile == null)
            {
                return NotFound(new { message = "Employer profile not found" });
            }

            //update
            profile.EmployerName = request.EmployerName;
            profile.Organization = request.Organization;

            await _context.SaveChangesAsync();

            var responseDto = new EmployerProfileResponseDTO
            {
                UserId = profile.UserId,
                EmployerName = profile.EmployerName,
                Organization = profile.Organization,
                Email = profile.User?.Email ?? string.Empty
            };

            return Ok(responseDto);
        }

        [HttpGet("fields")]
        [AllowAnonymous]
        public async Task<IActionResult> GetFields()
        {
            var fields = await _context.Fields.ToListAsync();
            
            //map
            var responseDtos = fields.Select(field => new FieldResponseDTO 
            { 
                FieldId = field.FieldId,
                Name = field.Name
            }).ToList();
            
            return Ok(responseDtos);
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return null;
            }

            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }

            return null;
        }
    }
}