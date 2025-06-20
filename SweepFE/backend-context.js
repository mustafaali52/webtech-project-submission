/*
MODELS:

models/User.cs:
using System.ComponentModel.DataAnnotations;

namespace SWEEP.Models
{
    public enum UserRole
    {
        Student,
        Employer,
        Admin
    }
    public class User : IValidatableObject
    {
        [Key]
        public int UserId { get; set; }

        [Required, EmailAddress]
        public required string Email {  get; set; }

        public byte[]? PasswordHash { get; set; }

        public byte[]? PasswordSalt { get; set; }

        public string? ClerkId { get; set; }

        public required UserRole Role { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual StudentProfile? StudentProfile { get; set; }

        public virtual EmployerProfile? EmployerProfile { get; set; }

        public virtual ICollection<RefreshToken>? RefreshTokens { get; set; } //one user many refresh tokens
        = new HashSet<RefreshToken>(); //avoid null-ref
        public IEnumerable<ValidationResult> Validate(ValidationContext ctx)
        {
            if (PasswordHash == null && ClerkId == null)
            {
                yield return new ValidationResult(
                    "One set of credentials must be provided",
                    new[] { nameof(PasswordHash), nameof(PasswordSalt), nameof(ClerkId) }
                );
            }
        }

    }
}


RefreshToken.cs:
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWEEP.Models
{
    public class RefreshToken
    {
        [Key]
        public int TokenId { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required, MaxLength(500)]
        public required string Token { get; set; }
        
        public DateTime ExpiresAt { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? RevokedAt { get; set; }
        
        public string? ReplacedBy { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
        
        public RefreshToken()
        {
        }

        public RefreshToken(string token, int userId, TimeSpan lifetime)
        {
            Token = token;
            UserId = userId;
            CreatedAt = DateTime.UtcNow;
            ExpiresAt = CreatedAt.Add(lifetime);
        }
        
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        
        public bool IsActive => RevokedAt == null && !IsExpired;
    }
}


StudentProfile.cs:
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWEEP.Models
{
    public class StudentProfile
    {
        [Key]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public required string StudentName { get; set; }

        [Required, MaxLength(200)]
        public required string University { get; set; }

        [Range(0, 4.0)]
        [Column(TypeName = "decimal(3,2)")]
        public decimal CGPA { get; set; }
        public int GraduationYear { get; set; }
        public int TokenBalance { get; set; } = 0;
        public int PriorExperienceYears { get; set; }
        public int FieldId { get; set; }
        public virtual User User { get; set; } = null!;
        [ForeignKey("FieldId")]
        public virtual Field Field { get; set; } = null!;
        public virtual ICollection<TaskAssignment> TaskAssignments { get; set; }
        = new HashSet<TaskAssignment>();
    }
}

EmployerProfile.cs:
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWEEP.Models
{
    public class EmployerProfile
    {
        [Key]
        [ForeignKey(nameof(User))] //1user1employerProfile
        public int UserId { get; set; }
        [Required, MaxLength(100)]
        public required string EmployerName { get; set; }
        [Required, MaxLength(200)]
        //employer org
        public required string Organization {  get; set; }
        public virtual User User { get; set; } = null!;
        //tasks by employer
        public virtual ICollection<JobTask> JobTasks { get; set; }
        = new HashSet<JobTask>();
    }
}


JobTask.cs:
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWEEP.Models
{
    public class JobTask
    {
        [Key]
        public int JobTaskId { get; set; }

        [Required] //When I talk about Employer, use the JobTask.UserId column to join to EmployerProfile.UserId
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual EmployerProfile Employer { get; set; } = null!;

        [Required, MaxLength(200)]
        public required string Title { get; set; }

        [Required, MaxLength(2000)]
        public required string Description { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        public bool RequiresExperience { get; set; }

        public Complexity Complexity { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? MonetaryCompensation { get; set; }

        public int FieldId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("FieldId")]
        public virtual Field Field { get; set; } = null!;

        public virtual ICollection<TaskAssignment> TaskAssignments { get; set; }
            = new HashSet<TaskAssignment>();

        public virtual ICollection<TaskAttachment> Attachments { get; set; }
            = new HashSet<TaskAttachment>();
    }
}


TaskAssignment.cs:
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWEEP.Models
{
    public class TaskAssignment
    {
        [Key]
        public int AssignmentId { get; set; }
        [Required]
        public int JobTaskId { get; set; }
        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual StudentProfile Student { get; set; } = null!;
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public int? TokensAwarded { get; set; }

        [ForeignKey("JobTaskId")]
        public virtual JobTask JobTask { get; set; } = null!;
    }
}

TaskAttachment.cs:
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWEEP.Models
{
    public class TaskAttachment
    {
        [Key]
        public int AttachmentId { get; set; }

        [Required]
        public int JobTaskId { get; set; }

        [Required, MaxLength(500)]
        public required string FileUrl { get; set; }

        [MaxLength(255)]
        public string FileName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string FileType { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("JobTaskId")]
        public virtual JobTask JobTask { get; set; } = null!;
    }
}


Field.cs:
using System.ComponentModel.DataAnnotations;

namespace SWEEP.Models
{
    public class Field
    {
        [Key]
        public int FieldId { get; set; }
        [Required, MaxLength(100)]
        public required string Name { get; set; }

        public virtual ICollection<StudentProfile> StudentProfiles { get; set; }
        = new HashSet<StudentProfile>();

        public virtual ICollection<JobTask> JobTasks { get; set; }
        = new HashSet<JobTask>();
    }
}


Complexity.cs:
namespace SWEEP.Models
{
    public enum Complexity : int
    {
        Easy = 75,
        Medium = 100,
        Hard = 150
    }
}

API's:
Base URL: https://localhost:7243/api/
------------------------------------------------------------------------------------------------------------------------
TaskController.cs:
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SWEEP.Data;
using SWEEP.DTOs.RequestDTOs.Task;
using SWEEP.DTOs.ResponseDTOs.Task;
using SWEEP.Models;
using SWEEP.Services;

namespace SWEEP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;
        private readonly SweepDbContext _context;
        private readonly ILogger<TaskController> _logger;
        private readonly CloudinaryService _cloudinaryService;

        public TaskController(
            TaskService taskService,
            SweepDbContext context,
            CloudinaryService cloudinaryService,
            ILogger<TaskController> logger)
        {
            _taskService = taskService;
            _context = context;
            _logger = logger;
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateTask(
            [FromForm] string title, 
            [FromForm] string description,
            [FromForm] DateTime deadline,
            [FromForm] bool requiresExperience,
            [FromForm] Complexity complexity,
            [FromForm] decimal? monetaryCompensation,
            [FromForm] int fieldId,
            [FromForm] List<IFormFile> attachments)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            //is user emp
            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null || user.Role != UserRole.Employer)
            {
                return BadRequest(new { message = "Only employers can create tasks" });
            }

            //profile check
            var profile = await _context.EmployerProfiles.FindAsync(userId.Value);
            if (profile == null)
            {
                return BadRequest(new { message = "Employer profile must be created before posting tasks" });
            }

            //deadline check
            if (deadline < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Task deadline cannot be in the past" });
            }
            
            // Create task request object
            var request = new TaskCreateRequest
            {
                Title = title,
                Description = description,
                Deadline = deadline,
                RequiresExperience = requiresExperience,
                Complexity = complexity,
                MonetaryCompensation = monetaryCompensation,
                FieldId = fieldId
            };

            // Process file uploads
            var fileUrls = new List<TaskAttachment>();
            if (attachments != null && attachments.Count > 0)
            {
                foreach (var file in attachments)
                {
                    if (file.Length > 0)
                    {
                        // Upload file to Cloudinary
                        var fileUrl = await _cloudinaryService.UploadFileAsync(file);
                        
                        if (!string.IsNullOrEmpty(fileUrl))
                        {
                            fileUrls.Add(new TaskAttachment 
                            { 
                                FileUrl = fileUrl,
                                FileName = file.FileName,
                                FileType = file.ContentType 
                            });
                        }
                    }
                }
            }

            //create task
            var task = await _taskService.CreateTaskWithAttachments(userId.Value, request, fileUrls);
            if (task == null)
            {
                return BadRequest(new { message = "Failed to create task" });
            }

            return CreatedAtAction(nameof(GetTask), new { id = task.JobTaskId }, task);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTask(int id)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var task = await _taskService.GetTaskDetails(id, userId.Value);
            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            return Ok(task);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskUpdateRequest request)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            //deadline check
            if (request.Deadline < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Task deadline cannot be in the past" });
            }

            var updatedTask = await _taskService.UpdateTask(id, userId.Value, request);
            if (updatedTask == null)
            {
                return NotFound(new { message = "Task not found or no auth" });
            }

            return Ok(updatedTask);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var result = await _taskService.DeleteTask(id, userId.Value);
            if (!result)
            {
                return NotFound(new { message = "Task not found or no auth" });
            }

            return NoContent();
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetTasks(
            [FromQuery] int? fieldId = null,
            [FromQuery] Complexity? complexity = null,
            [FromQuery] bool? requiresExperience = null,
            [FromQuery] bool includeExpired = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 50) pageSize = 10;

            var tasks = await _taskService.GetTasks(
                fieldId,
                complexity,
                requiresExperience,
                includeExpired,
                page,
                pageSize);

            return Ok(tasks);
        }

        [HttpGet("employer")]
        public async Task<IActionResult> GetMyTasks([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "UID not found in token" });
            }

            //isEmployer
            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null || user.Role != UserRole.Employer)
            {
                return BadRequest(new { message = "Only emp can access endpoint" });
            }

            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 50) pageSize = 10;

            var tasks = await _taskService.GetTasksByEmployer(userId.Value, page, pageSize);
            return Ok(tasks);
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

TaskAssignmentController.cs:
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using SWEEP.Data;
using SWEEP.DTOs.RequestDTOs.Task;
using SWEEP.DTOs.ResponseDTOs.Task;
using SWEEP.Models;

namespace SWEEP.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TaskAssignmentController : ControllerBase
    {
        private readonly SweepDbContext _context;
        private readonly ILogger<TaskAssignmentController> _logger;

        public TaskAssignmentController(SweepDbContext context, ILogger<TaskAssignmentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("assign")]
        [Consumes("application/json")]
        public async Task<IActionResult> AssignTask([FromBody] EmployerTaskAssignRequest request)
        {
            var employerId = GetUserId();
            if (!employerId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            //verify user is employer
            var employer = await _context.Users.FindAsync(employerId.Value);
            if (employer == null || employer.Role != UserRole.Employer)
            {
                return BadRequest(new { message = "Only employers can assign tasks" });
            }

            //employer profile exists or no
            var employerProfile = await _context.EmployerProfiles.FindAsync(employerId.Value);
            if (employerProfile == null)
            {
                return BadRequest(new { message = "Employer profile must be created before assigning tasks" });
            }

            //find task
            var task = await _context.JobTasks
                .FirstOrDefaultAsync(t => t.JobTaskId == request.TaskId && t.UserId == employerId.Value);

            if (task == null)
            {
                return NotFound(new { message = "Task not found or you don't own this task" });
            }

            //is task deadline has passed
            if (task.Deadline < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Cannot assign tasks with expired deadlines" });
            }

            //student and profile exist or no
            var studentProfile = await _context.StudentProfiles
                .Include(sp => sp.User)
                .FirstOrDefaultAsync(sp => sp.UserId == request.StudentId);

            if (studentProfile == null || studentProfile.User?.Role != UserRole.Student)
            {
                return BadRequest(new { message = "Invalid student ID or student profile not found" });
            }

            //is task already assigned
            var existingAssignment = await _context.TaskAssignments
                .FirstOrDefaultAsync(ta => ta.JobTaskId == request.TaskId && ta.UserId == request.StudentId);

            if (existingAssignment != null)
            {
                return BadRequest(new { message = "Task is already assigned to this student" });
            }

            //req exp?
            if (task.RequiresExperience && studentProfile.PriorExperienceYears < 1)
            {
                return BadRequest(new { message = "This student doesn't have the required experience for this task" });
            }

            //employer-initiated assignment - now pending student acceptance
            var assignment = new TaskAssignment
            {
                JobTaskId = request.TaskId,
                UserId = request.StudentId,
                RequestedAt = DateTime.UtcNow,
                // AcceptedAt is now null until student accepts it
            };

            _context.TaskAssignments.Add(assignment);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Employer {EmployerId} assigned task {TaskId} to student {StudentId}", 
                employerId.Value, request.TaskId, request.StudentId);

            return Created($"/api/taskassignment/{assignment.AssignmentId}", new
            {
                AssignmentId = assignment.AssignmentId,
                TaskId = assignment.JobTaskId,
                StudentId = assignment.UserId,
                StudentName = studentProfile.StudentName,
                RequestedAt = assignment.RequestedAt
            });
        }

        [HttpPost("accept")]
        [Consumes("application/json")]
        public async Task<IActionResult> AcceptTask([FromBody] TaskAcceptRequest request)
        {
            var studentId = GetUserId();
            if (!studentId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            // Verify user is student
            var student = await _context.Users.FindAsync(studentId.Value);
            if (student == null || student.Role != UserRole.Student)
            {
                return BadRequest(new { message = "Only students can accept tasks" });
            }

            // Find the assignment
            var assignment = await _context.TaskAssignments
                .Include(ta => ta.JobTask)
                .FirstOrDefaultAsync(ta => ta.AssignmentId == request.AssignmentId && ta.UserId == studentId.Value);

            if (assignment == null)
            {
                return NotFound(new { message = "Assignment not found or you are not the assigned student" });
            }

            // Check if already accepted
            if (assignment.AcceptedAt.HasValue)
            {
                return BadRequest(new { message = "This task has already been accepted" });
            }

            // Check if task deadline has passed
            if (assignment.JobTask.Deadline < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Cannot accept tasks with expired deadlines" });
            }

            // Accept the assignment
            assignment.AcceptedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Student {StudentId} accepted assignment {AssignmentId}", 
                studentId.Value, assignment.AssignmentId);

            return Ok(new
            {
                AssignmentId = assignment.AssignmentId,
                TaskId = assignment.JobTaskId,
                AcceptedAt = assignment.AcceptedAt
            });
        }

        [HttpGet("available-students")]
        public async Task<IActionResult> GetAvailableStudents([FromQuery] int fieldId = 0, [FromQuery] bool requiresExperience = false)
        {
            var employerId = GetUserId();
            if (!employerId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            //verify employer
            var employer = await _context.Users.FindAsync(employerId.Value);
            if (employer == null || employer.Role != UserRole.Employer)
            {
                return BadRequest(new { message = "Only employers can access this endpoint" });
            }

            var query = _context.StudentProfiles
                .Include(sp => sp.User)
                .Include(sp => sp.Field)
                .Where(sp => sp.User.Role == UserRole.Student);

            //filter by field
            if (fieldId > 0)
            {
                query = query.Where(sp => sp.FieldId == fieldId);
            }

            //filter by experience
            if (requiresExperience)
            {
                query = query.Where(sp => sp.PriorExperienceYears >= 1);
            }

            var students = await query.ToListAsync();

            var result = students.Select(s => new
            {
                StudentId = s.UserId,
                StudentName = s.StudentName,
                University = s.University,
                CGPA = s.CGPA,
                GraduationYear = s.GraduationYear,
                PriorExperienceYears = s.PriorExperienceYears,
                Field = s.Field?.Name ?? string.Empty,
                Email = s.User?.Email ?? string.Empty
            }).ToList();

            return Ok(result);
        }

        [HttpPost("complete")]
        public async Task<IActionResult> MarkAsComplete([FromBody] TaskCompletionRequest request)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            //find assignment
            var assignment = await _context.TaskAssignments
                .FirstOrDefaultAsync(ta => ta.AssignmentId == request.AssignmentId && ta.UserId == userId.Value);

            if (assignment == null)
            {
                return NotFound(new { message = "Assignment not found or you are not authorized" });
            }

            // Check if the task has been accepted
            if (!assignment.AcceptedAt.HasValue)
            {
                return BadRequest(new { message = "Task must be accepted before it can be completed" });
            }

            //isCompleted
            if (assignment.CompletedAt.HasValue)
            {
                return BadRequest(new { message = "Task has already been marked as complete" });
            }

            //mark complete
            assignment.CompletedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Student {UserId} marked assignment {AssignmentId} as complete", 
                userId.Value, assignment.AssignmentId);

            return Ok(new
            {
                AssignmentId = assignment.AssignmentId,
                TaskId = assignment.JobTaskId,
                CompletedAt = assignment.CompletedAt
            });
        }

        [HttpPost("approve")]
        public async Task<IActionResult> ApproveCompletion([FromBody] TaskApprovalRequest request)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            //get assignment
            var assignment = await _context.TaskAssignments
                .Include(ta => ta.JobTask)
                .Include(ta => ta.Student)
                .FirstOrDefaultAsync(ta => ta.AssignmentId == request.AssignmentId);

            if (assignment == null)
            {
                return NotFound(new { message = "Assignment not found" });
            }

            //is user task owner
            if (assignment.JobTask.UserId != userId.Value)
            {
                return Unauthorized(new { message = "Only the task owner can approve completions" });
            }

            //isCompleted
            if (!assignment.CompletedAt.HasValue)
            {
                return BadRequest(new { message = "Task must be marked as complete before approval" });
            }

            //isApproved
            if (assignment.ApprovedAt.HasValue)
            {
                return BadRequest(new { message = "Task has already been approved" });
            }

            //transact
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                //approve completion
                assignment.ApprovedAt = DateTime.UtcNow;
                assignment.TokensAwarded = request.TokensAwarded;

                //update token balance
                var student = assignment.Student;
                if (student != null)
                {
                    student.TokenBalance += request.TokensAwarded;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Employer {UserId} approved assignment {AssignmentId} and awarded {Tokens} tokens", 
                    userId.Value, assignment.AssignmentId, request.TokensAwarded);

                return Ok(new
                {
                    AssignmentId = assignment.AssignmentId,
                    TaskId = assignment.JobTaskId,
                    ApprovedAt = assignment.ApprovedAt,
                    TokensAwarded = assignment.TokensAwarded
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error approving assignment {AssignmentId}", request.AssignmentId);
                return StatusCode(500, new { message = "error occurred while approving the task" });
            }
        }

        [HttpGet("student")]
        public async Task<IActionResult> GetStudentAssignments([FromQuery] bool? completed = null, [FromQuery] bool? accepted = null)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }            var query = _context.TaskAssignments
                .Include(ta => ta.JobTask)
                    .ThenInclude(jt => jt.Field)
                .Include(ta => ta.JobTask)
                    .ThenInclude(jt => jt.Employer)
                .Include(ta => ta.JobTask)
                    .ThenInclude(jt => jt.Attachments)
                .Where(ta => ta.UserId == userId.Value);

            if (completed.HasValue)
            {
                query = completed.Value
                    ? query.Where(ta => ta.CompletedAt.HasValue)
                    : query.Where(ta => !ta.CompletedAt.HasValue);
            }

            if (accepted.HasValue)
            {
                query = accepted.Value
                    ? query.Where(ta => ta.AcceptedAt.HasValue)
                    : query.Where(ta => !ta.AcceptedAt.HasValue);
            }

            var assignments = await query
                .OrderByDescending(ta => ta.RequestedAt)
                .ToListAsync();            var result = assignments.Select(a => new
            {
                AssignmentId = a.AssignmentId,
                TaskId = a.JobTaskId,
                TaskTitle = a.JobTask.Title,
                TaskDescription = a.JobTask.Description,
                Deadline = a.JobTask.Deadline,
                Complexity = a.JobTask.Complexity,
                MonetaryCompensation = a.JobTask.MonetaryCompensation,
                FieldName = a.JobTask.Field?.Name,
                EmployerName = a.JobTask.Employer?.EmployerName,
                Organization = a.JobTask.Employer?.Organization,
                RequestedAt = a.RequestedAt,
                AcceptedAt = a.AcceptedAt,
                CompletedAt = a.CompletedAt,
                ApprovedAt = a.ApprovedAt,
                TokensAwarded = a.TokensAwarded,
                Attachments = a.JobTask.Attachments.Select(att => new
                {
                    AttachmentId = att.AttachmentId,
                    FileUrl = att.FileUrl,
                    FileName = att.FileName,
                    FileType = att.FileType,
                    UploadedAt = att.UploadedAt
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        [HttpGet("employer")]
        public async Task<IActionResult> GetEmployerAssignments([FromQuery] int? taskId = null, [FromQuery] bool? accepted = null)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            var query = _context.TaskAssignments
                .Include(ta => ta.JobTask)
                .Include(ta => ta.Student)
                    .ThenInclude(s => s.User)
                .Where(ta => ta.JobTask.UserId == userId.Value);

            if (taskId.HasValue)
            {
                query = query.Where(ta => ta.JobTaskId == taskId.Value);
            }

            if (accepted.HasValue)
            {
                query = accepted.Value
                    ? query.Where(ta => ta.AcceptedAt.HasValue)
                    : query.Where(ta => !ta.AcceptedAt.HasValue);
            }

            var assignments = await query
                .OrderByDescending(ta => ta.RequestedAt)
                .ToListAsync();

            var result = assignments.Select(a => new
            {
                AssignmentId = a.AssignmentId,
                TaskId = a.JobTaskId,
                TaskTitle = a.JobTask.Title,
                StudentId = a.UserId,
                StudentName = a.Student?.StudentName,
                StudentEmail = a.Student?.User?.Email,
                RequestedAt = a.RequestedAt,
                AcceptedAt = a.AcceptedAt,
                CompletedAt = a.CompletedAt,
                ApprovedAt = a.ApprovedAt,
                TokensAwarded = a.TokensAwarded
            }).ToList();

            return Ok(result);
        }

        [HttpDelete("{assignmentId}")]
        public async Task<IActionResult> UnassignTask(int assignmentId)
        {
            var employerId = GetUserId();
            if (!employerId.HasValue)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            //find assignment
            var assignment = await _context.TaskAssignments
                .Include(ta => ta.JobTask)
                .FirstOrDefaultAsync(ta => ta.AssignmentId == assignmentId && ta.JobTask.UserId == employerId.Value);

            if (assignment == null)
            {
                return NotFound(new { message = "Assignment not found or you don't have permission to unassign it" });
            }

            //no unassigning if task is completed
            if (assignment.CompletedAt.HasValue)
            {
                return BadRequest(new { message = "Cannot unassign a task that has already been completed" });
            }

            _context.TaskAssignments.Remove(assignment);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Employer {EmployerId} unassigned task {TaskId} from student {StudentId}", 
                employerId.Value, assignment.JobTaskId, assignment.UserId);

            return NoContent();
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

TaskService.cs:
using Microsoft.EntityFrameworkCore;
using SWEEP.Data;
using SWEEP.DTOs.RequestDTOs.Task;
using SWEEP.DTOs.ResponseDTOs.Task;
using SWEEP.Models;

namespace SWEEP.Services
{
    public class TaskService
    {
        private readonly SweepDbContext _context;
        private readonly ILogger<TaskService> _logger;

        public TaskService(SweepDbContext context, ILogger<TaskService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<TaskResponseDTO?> CreateTask(int userId, TaskCreateRequest request)
        {
            //user exist? isEmployer?
            var employer = await _context.EmployerProfiles
                .Include(ep => ep.User)
                .FirstOrDefaultAsync(ep => ep.UserId == userId);

            if (employer == null)
            {
                _logger.LogWarning("Employer not found or user is not an employer: {UserId}", userId);
                return null;
            }

            //field exist?
            var field = await _context.Fields.FindAsync(request.FieldId);
            if (field == null)
            {
                _logger.LogWarning("Invalid field ID: {FieldId}", request.FieldId);
                return null;
            }

            var task = new JobTask
            {
                UserId = userId,
                Title = request.Title,
                Description = request.Description,
                Deadline = request.Deadline,
                RequiresExperience = request.RequiresExperience,
                Complexity = request.Complexity,
                MonetaryCompensation = request.MonetaryCompensation,
                FieldId = request.FieldId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.JobTasks.Add(task);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Task created successfully: {JobTaskId} by employer {UserId}", task.JobTaskId, userId);

            // Return response DTO
            return new TaskResponseDTO
            {
                JobTaskId = task.JobTaskId,
                Title = task.Title,
                Description = task.Description,
                Deadline = task.Deadline,
                RequiresExperience = task.RequiresExperience,
                Complexity = task.Complexity,
                MonetaryCompensation = task.MonetaryCompensation,
                FieldId = task.FieldId,
                FieldName = field.Name,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                EmployerName = employer.EmployerName,
                Organization = employer.Organization,
                AssignmentCount = 0,
                Attachments = new List<TaskAttachmentDTO>()
            };
        }

        public async Task<TaskResponseDTO?> CreateTaskWithAttachments(int userId, TaskCreateRequest request, List<TaskAttachment> attachments)
        {
            //user exist? isEmployer?
            var employer = await _context.EmployerProfiles
                .Include(ep => ep.User)
                .FirstOrDefaultAsync(ep => ep.UserId == userId);

            if (employer == null)
            {
                _logger.LogWarning("Employer not found or user is not an employer: {UserId}", userId);
                return null;
            }

            //field exist?
            var field = await _context.Fields.FindAsync(request.FieldId);
            if (field == null)
            {
                _logger.LogWarning("Invalid field ID: {FieldId}", request.FieldId);
                return null;
            }

            var task = new JobTask
            {
                UserId = userId,
                Title = request.Title,
                Description = request.Description,
                Deadline = request.Deadline,
                RequiresExperience = request.RequiresExperience,
                Complexity = request.Complexity,
                MonetaryCompensation = request.MonetaryCompensation,
                FieldId = request.FieldId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.JobTasks.Add(task);
            await _context.SaveChangesAsync();

            // Add attachments if any
            if (attachments != null && attachments.Count > 0)
            {
                foreach (var attachment in attachments)
                {
                    attachment.JobTaskId = task.JobTaskId;
                    _context.TaskAttachments.Add(attachment);
                }

                await _context.SaveChangesAsync();
            }

            _logger.LogInformation("Task created successfully with {AttachmentCount} attachments: {JobTaskId} by employer {UserId}",
                attachments?.Count ?? 0, task.JobTaskId, userId);

            // Return response DTO
            var response = new TaskResponseDTO
            {
                JobTaskId = task.JobTaskId,
                Title = task.Title,
                Description = task.Description,
                Deadline = task.Deadline,
                RequiresExperience = task.RequiresExperience,
                Complexity = task.Complexity,
                MonetaryCompensation = task.MonetaryCompensation,
                FieldId = task.FieldId,
                FieldName = field.Name,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                EmployerName = employer.EmployerName,
                Organization = employer.Organization,
                AssignmentCount = 0,
                Attachments = new List<TaskAttachmentDTO>()
            };

            // Add attachments to the response
            if (attachments != null)
            {
                foreach (var attachment in attachments)
                {
                    response.Attachments.Add(new TaskAttachmentDTO
                    {
                        AttachmentId = attachment.AttachmentId,
                        FileUrl = attachment.FileUrl,
                        FileName = attachment.FileName,
                        FileType = attachment.FileType,
                        UploadedAt = attachment.UploadedAt
                    });
                }
            }

            return response;
        }

        public async Task<TaskDetailsResponseDTO?> GetTaskDetails(int taskId, int? userId = null)
        {
            var task = await _context.JobTasks
                .Include(t => t.Field)
                .Include(t => t.Employer)
                    .ThenInclude(e => e.User)
                .Include(t => t.TaskAssignments)
                    .ThenInclude(ta => ta.Student)
                        .ThenInclude(s => s.User)
                .Include(t => t.Attachments)
                .FirstOrDefaultAsync(t => t.JobTaskId == taskId);

            if (task == null)
            {
                _logger.LogWarning("Task not found with ID: {TaskId}", taskId);
                return null;
            }

            var response = new TaskDetailsResponseDTO
            {
                JobTaskId = task.JobTaskId,
                UserId = task.UserId,
                Title = task.Title,
                Description = task.Description,
                Deadline = task.Deadline,
                RequiresExperience = task.RequiresExperience,
                Complexity = task.Complexity,
                MonetaryCompensation = task.MonetaryCompensation,
                FieldId = task.FieldId,
                FieldName = task.Field?.Name ?? string.Empty,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                EmployerName = task.Employer?.EmployerName ?? string.Empty,
                Organization = task.Employer?.Organization ?? string.Empty,
                Email = task.Employer?.User?.Email ?? string.Empty,
                TotalRequests = task.TaskAssignments.Count,
                AcceptedRequests = task.TaskAssignments.Count(a => a.AcceptedAt.HasValue),
                CompletedTasks = task.TaskAssignments.Count(a => a.CompletedAt.HasValue),
                ApprovedTasks = task.TaskAssignments.Count(a => a.ApprovedAt.HasValue),
                Attachments = task.Attachments.Select(a => new TaskAttachmentDTO
                {
                    AttachmentId = a.AttachmentId,
                    FileUrl = a.FileUrl,
                    FileName = a.FileName,
                    FileType = a.FileType,
                    UploadedAt = a.UploadedAt
                }).ToList()
            };

            // Include assignments only if the requester is the employer
            if (userId.HasValue && task.UserId == userId.Value)
            {
                response.Assignments = task.TaskAssignments.Select(a => new TaskAssignmentDTO
                {
                    AssignmentId = a.AssignmentId,
                    UserId = a.UserId,
                    StudentName = a.Student?.StudentName ?? string.Empty,
                    University = a.Student?.University ?? string.Empty,
                    Email = a.Student?.User?.Email ?? string.Empty,
                    RequestedAt = a.RequestedAt,
                    AcceptedAt = a.AcceptedAt,
                    CompletedAt = a.CompletedAt,
                    ApprovedAt = a.ApprovedAt,
                    TokensAwarded = a.TokensAwarded
                }).ToList();
            }

            return response;
        }

        public async Task<TaskResponseDTO?> UpdateTask(int taskId, int userId, TaskUpdateRequest request)
        {
            var task = await _context.JobTasks
                .Include(t => t.Field)
                .Include(t => t.Employer)
                .FirstOrDefaultAsync(t => t.JobTaskId == taskId && t.UserId == userId);

            if (task == null)
            {
                _logger.LogWarning("Task not found or user not authorized: TaskId {TaskId}, UserId {UserId}", taskId, userId);
                return null;
            }

            // Check if field exists
            var field = await _context.Fields.FindAsync(request.FieldId);
            if (field == null)
            {
                _logger.LogWarning("Invalid field ID: {FieldId}", request.FieldId);
                return null;
            }

            // Update task properties
            task.Title = request.Title;
            task.Description = request.Description;
            task.Deadline = request.Deadline;
            task.RequiresExperience = request.RequiresExperience;
            task.Complexity = request.Complexity;
            task.MonetaryCompensation = request.MonetaryCompensation;
            task.FieldId = request.FieldId;
            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Task updated successfully: {JobTaskId} by employer {UserId}", taskId, userId);

            // Get assignment count
            var assignmentCount = await _context.TaskAssignments
                .CountAsync(ta => ta.JobTaskId == taskId);

            return new TaskResponseDTO
            {
                JobTaskId = task.JobTaskId,
                Title = task.Title,
                Description = task.Description,
                Deadline = task.Deadline,
                RequiresExperience = task.RequiresExperience,
                Complexity = task.Complexity,
                MonetaryCompensation = task.MonetaryCompensation,
                FieldId = task.FieldId,
                FieldName = field.Name,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                EmployerName = task.Employer?.EmployerName ?? string.Empty,
                Organization = task.Employer?.Organization ?? string.Empty,
                AssignmentCount = assignmentCount,
                Attachments = new List<TaskAttachmentDTO>()
            };
        }

        public async Task<bool> DeleteTask(int taskId, int userId)
        {
            var task = await _context.JobTasks
                .FirstOrDefaultAsync(t => t.JobTaskId == taskId && t.UserId == userId);

            if (task == null)
            {
                _logger.LogWarning("Task not found or user not authorized: TaskId {TaskId}, UserId {UserId}", taskId, userId);
                return false;
            }

            // Check if task has any assignments
            var hasAssignments = await _context.TaskAssignments
                .AnyAsync(ta => ta.JobTaskId == taskId);

            if (hasAssignments)
            {
                _logger.LogWarning("Cannot delete task with existing assignments: TaskId {TaskId}", taskId);
                return false;
            }

            _context.JobTasks.Remove(task);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Task deleted successfully: {JobTaskId} by employer {UserId}", taskId, userId);
            return true;
        }

        public async Task<List<TaskResponseDTO>> GetTasks(
            int? fieldId = null,
            Complexity? complexity = null,
            bool? requiresExperience = null,
            bool includeExpired = false,
            int page = 1,
            int pageSize = 10)
        {
            var query = _context.JobTasks
                .Include(t => t.Field)
                .Include(t => t.Employer)
                .AsQueryable();

            // Apply filters
            if (fieldId.HasValue)
            {
                query = query.Where(t => t.FieldId == fieldId.Value);
            }

            if (complexity.HasValue)
            {
                query = query.Where(t => t.Complexity == complexity.Value);
            }

            if (requiresExperience.HasValue)
            {
                query = query.Where(t => t.RequiresExperience == requiresExperience.Value);
            }

            if (!includeExpired)
            {
                query = query.Where(t => t.Deadline > DateTime.UtcNow);
            }

            var tasks = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var taskDtos = new List<TaskResponseDTO>();
            foreach (var task in tasks)
            {
                var assignmentCount = await _context.TaskAssignments
                    .CountAsync(ta => ta.JobTaskId == task.JobTaskId);

                taskDtos.Add(new TaskResponseDTO
                {
                    JobTaskId = task.JobTaskId,
                    Title = task.Title,
                    Description = task.Description,
                    Deadline = task.Deadline,
                    RequiresExperience = task.RequiresExperience,
                    Complexity = task.Complexity,
                    MonetaryCompensation = task.MonetaryCompensation,
                    FieldId = task.FieldId,
                    FieldName = task.Field?.Name ?? string.Empty,
                    CreatedAt = task.CreatedAt,
                    UpdatedAt = task.UpdatedAt,
                    EmployerName = task.Employer?.EmployerName ?? string.Empty,
                    Organization = task.Employer?.Organization ?? string.Empty,
                    AssignmentCount = assignmentCount,
                    Attachments = new List<TaskAttachmentDTO>()
                });
            }

            return taskDtos;
        }

        public async Task<List<TaskResponseDTO>> GetTasksByEmployer(int employerId, int page = 1, int pageSize = 10)
        {
            var query = _context.JobTasks
                .Include(t => t.Field)
                .Include(t => t.Employer)
                .Where(t => t.UserId == employerId);

            var tasks = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var taskDtos = new List<TaskResponseDTO>();
            foreach (var task in tasks)
            {
                var assignmentCount = await _context.TaskAssignments
                    .CountAsync(ta => ta.JobTaskId == task.JobTaskId);

                taskDtos.Add(new TaskResponseDTO
                {
                    JobTaskId = task.JobTaskId,
                    Title = task.Title,
                    Description = task.Description,
                    Deadline = task.Deadline,
                    RequiresExperience = task.RequiresExperience,
                    Complexity = task.Complexity,
                    MonetaryCompensation = task.MonetaryCompensation,
                    FieldId = task.FieldId,
                    FieldName = task.Field?.Name ?? string.Empty,
                    CreatedAt = task.CreatedAt,
                    UpdatedAt = task.UpdatedAt,
                    EmployerName = task.Employer?.EmployerName ?? string.Empty,
                    Organization = task.Employer?.Organization ?? string.Empty,
                    AssignmentCount = assignmentCount,
                    Attachments = new List<TaskAttachmentDTO>()
                });
            }

            return taskDtos;
        }
    }
}

DTOs:
DTOs/RequestDTOs/Task/TaskCreateRequest.cs:
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using SWEEP.Models;

namespace SWEEP.DTOs.RequestDTOs.Task
{
    public class TaskCreateRequest
    {
        [Required]
        [JsonPropertyName("title")]
        [StringLength(200, MinimumLength = 5)]
        public required string Title { get; set; }

        [Required]
        [JsonPropertyName("description")]
        [StringLength(2000, MinimumLength = 20)]
        public required string Description { get; set; }

        [Required]
        [JsonPropertyName("deadline")]
        public DateTime Deadline { get; set; }

        [JsonPropertyName("requiresExperience")]
        public bool RequiresExperience { get; set; }

        [Required]
        [JsonPropertyName("complexity")]
        public Complexity Complexity { get; set; }

        [JsonPropertyName("monetaryCompensation")]
        public decimal? MonetaryCompensation { get; set; }

        [Required]
        [JsonPropertyName("fieldId")]
        public int FieldId { get; set; }
    }
}

DTOs/RequestDTOs/Task/TaskUpdateRequest.cs:
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using SWEEP.Models;

namespace SWEEP.DTOs.RequestDTOs.Task
{
    public class TaskUpdateRequest
    {
        [Required]
        [JsonPropertyName("title")]
        [StringLength(200, MinimumLength = 5)]
        public required string Title { get; set; }

        [Required]
        [JsonPropertyName("description")]
        [StringLength(2000, MinimumLength = 20)]
        public required string Description { get; set; }

        [Required]
        [JsonPropertyName("deadline")]
        public DateTime Deadline { get; set; }

        [JsonPropertyName("requiresExperience")]
        public bool RequiresExperience { get; set; }

        [Required]
        [JsonPropertyName("complexity")]
        public Complexity Complexity { get; set; }

        [JsonPropertyName("monetaryCompensation")]
        public decimal? MonetaryCompensation { get; set; }

        [Required]
        [JsonPropertyName("fieldId")]
        public int FieldId { get; set; }
    }
}

DTOs/RequestDTOs/Task/TaskAssignmentRequest.cs:
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Task
{
    public class TaskAssignmentRequest
    {
        [Required]
        [JsonPropertyName("taskId")]
        public int TaskId { get; set; }
    }
    
    public class EmployerTaskAssignRequest
    {
        [Required]
        [JsonPropertyName("taskId")]
        public int TaskId { get; set; }
        
        [Required]
        [JsonPropertyName("studentId")]
        public int StudentId { get; set; }
    }
    
    public class TaskAcceptRequest
    {
        [Required]
        [JsonPropertyName("assignmentId")]
        public int AssignmentId { get; set; }
    }
    
    public class TaskCompletionRequest
    {
        [Required]
        [JsonPropertyName("assignmentId")]
        public int AssignmentId { get; set; }
    }
    
    public class TaskApprovalRequest
    {
        [Required]
        [JsonPropertyName("assignmentId")]
        public int AssignmentId { get; set; }
        
        [Required]
        [JsonPropertyName("tokensAwarded")]
        [Range(1, 500)]
        public int TokensAwarded { get; set; }
    }
}

DTOs/ResponseDTOs/Task/TaskResponseDTO.cs:
using System.Text.Json.Serialization;
using SWEEP.Models;

namespace SWEEP.DTOs.ResponseDTOs.Task
{
    public class TaskResponseDTO
    {
        public int JobTaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public bool RequiresExperience { get; set; }
        public Complexity Complexity { get; set; }
        public decimal? MonetaryCompensation { get; set; }
        public int FieldId { get; set; }
        public string FieldName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string EmployerName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public int AssignmentCount { get; set; }
        public List<TaskAttachmentDTO> Attachments { get; set; } = new List<TaskAttachmentDTO>();
    }
}

DTOs/ResponseDTOs/Task/TaskDetailsResponseDTO.cs:
using System.Text.Json.Serialization;
using SWEEP.Models;

namespace SWEEP.DTOs.ResponseDTOs.Task
{
    public class TaskDetailsResponseDTO
    {
        public int JobTaskId { get; set; }
        public int UserId { get; set; }  // Employer ID
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public bool RequiresExperience { get; set; }
        public Complexity Complexity { get; set; }
        public decimal? MonetaryCompensation { get; set; }
        public int FieldId { get; set; }
        public string FieldName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Employer information
        public string EmployerName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        // Assignment stats
        public int TotalRequests { get; set; }
        public int AcceptedRequests { get; set; }
        public int CompletedTasks { get; set; }
        public int ApprovedTasks { get; set; }
        
        // Task attachments
        public List<TaskAttachmentDTO> Attachments { get; set; } = new List<TaskAttachmentDTO>();
        
        // List of assignments if the user is the employer
        public List<TaskAssignmentDTO>? Assignments { get; set; }
    }
    
    public class TaskAssignmentDTO
    {
        public int AssignmentId { get; set; }
        public int UserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string University { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public int? TokensAwarded { get; set; }
    }
}

Services/CloudinaryService.cs:
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;

namespace SWEEP.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration configuration)
        {
            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];

            if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                throw new InvalidOperationException("Cloudinary configuration is missing. Please check appsettings.json");
            }

            var cloudinarySettings = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(cloudinarySettings);
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            using var stream = file.OpenReadStream();

            // Check if file is an image
            var isImage = IsImageFile(file.ContentType);

            if (isImage)
            {
                var imageUploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    UseFilename = true,
                    UniqueFilename = true,
                    AccessMode = "public",
                    Folder = "task_attachments"
                };

                var uploadResult = await _cloudinary.UploadAsync(imageUploadParams);

                if (uploadResult.Error != null)
                {
                    throw new Exception($"Failed to upload image: {uploadResult.Error.Message}");
                }

                return uploadResult.SecureUrl.ToString();
            }
            else
            {
                // For non-image files (PDFs, documents, etc.)
                var rawUploadParams = new RawUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    UseFilename = true,
                    UniqueFilename = true,
                    AccessMode = "public",
                    Folder = "task_attachments"
                };

                var uploadResult = await _cloudinary.UploadAsync(rawUploadParams);

                if (uploadResult.Error != null)
                {
                    throw new Exception($"Failed to upload file: {uploadResult.Error.Message}");
                }

                return uploadResult.SecureUrl.ToString();
            }
        }

        private bool IsImageFile(string contentType)
        {
            if (string.IsNullOrEmpty(contentType))
                return false;

            return contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);
        }

        public async Task<byte[]> DownloadFileAsync(string fileUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(fileUrl))
                    return null;

                using var httpClient = new HttpClient();

                // Set a user agent to avoid some blocking
                httpClient.DefaultRequestHeaders.Add("User-Agent", "SWEEP-Application/1.0");

                // Download the file from Cloudinary
                var response = await httpClient.GetAsync(fileUrl);

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Failed to download file: {response.StatusCode} - {response.ReasonPhrase}");
                }

                return await response.Content.ReadAsByteArrayAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error downloading file from URL {fileUrl}: {ex.Message}", ex);
            }
        }
    }
}

------------------------------------------------------------------------------------------------------------------------

ProfileController.cs:
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using SWEEP.Data;
using SWEEP.Models;
using SWEEP.DTOs.RequestDTOs.Profile;
using SWEEP.DTOs.ResponseDTOs.Profile;

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

            // Verify that the user exists and has the correct role
            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (user.Role != UserRole.Student)
            {
                return BadRequest(new { message = "User must have Student role to create a student profile" });
            }

            // Check if profile already exists
            var existingProfile = await _context.StudentProfiles.FindAsync(userId.Value);
            if (existingProfile != null)
            {
                return BadRequest(new { message = "Student profile already exists for this user" });
            }

            // Verify that the field exists
            var field = await _context.Fields.FindAsync(request.FieldId);
            if (field == null)
            {
                return BadRequest(new { message = "Invalid field ID" });
            }

            // Create the profile
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

            // Map to DTO for response to avoid circular references
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

            // Verify that the user exists and has the correct role
            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (user.Role != UserRole.Employer)
            {
                return BadRequest(new { message = "User must have Employer role to create an employer profile" });
            }

            // Check if profile already exists
            var existingProfile = await _context.EmployerProfiles.FindAsync(userId.Value);
            if (existingProfile != null)
            {
                return BadRequest(new { message = "Employer profile already exists for this user" });
            }

            // Create the profile
            var employerProfile = new EmployerProfile
            {
                UserId = userId.Value,
                EmployerName = request.EmployerName,
                Organization = request.Organization
            };

            _context.EmployerProfiles.Add(employerProfile);
            await _context.SaveChangesAsync();

            // Map to DTO for response to avoid circular references
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

            // Calculate total tokens earned from completed assignments
            var totalTokensEarned = await _context.TaskAssignments
                .Where(ta => ta.UserId == userId.Value && ta.ApprovedAt.HasValue && ta.TokensAwarded.HasValue)
                .SumAsync(ta => ta.TokensAwarded.Value);

            // Map to DTO for response to avoid circular references
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
                Email = profile.User?.Email ?? string.Empty,
                TotalTokensEarned = totalTokensEarned
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

            // Map to DTO for response to avoid circular references
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

            // Verify that the field exists
            var field = await _context.Fields.FindAsync(request.FieldId);
            if (field == null)
            {
                return BadRequest(new { message = "Invalid field ID" });
            }

            // Update profile
            profile.StudentName = request.StudentName;
            profile.University = request.University;
            profile.CGPA = request.CGPA;
            profile.GraduationYear = request.GraduationYear;
            profile.PriorExperienceYears = request.PriorExperienceYears;
            profile.FieldId = request.FieldId;

            await _context.SaveChangesAsync();

            // Map to DTO for response to avoid circular references
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

            // Update profile
            profile.EmployerName = request.EmployerName;
            profile.Organization = request.Organization;

            await _context.SaveChangesAsync();

            // Map to DTO for response to avoid circular references
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
            
            // Map to DTOs
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

Response DTOs:
/DTOs/ResponseDTOs/Profile/StudentProfileResponseDTO.cs:

using System.Text.Json.Serialization;

namespace SWEEP.DTOs.ResponseDTOs.Profile
{    public class StudentProfileResponseDTO
    {
        public int UserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string University { get; set; } = string.Empty;
        public decimal CGPA { get; set; }
        public int GraduationYear { get; set; }
        public int PriorExperienceYears { get; set; }
        public int TokenBalance { get; set; }
        public int FieldId { get; set; }
        public string FieldName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int TotalTokensEarned { get; set; }
    }
}

/DTOs/ResponseDTOs/Profile/EmployerProfileResponseDTO.cs:
using System.Text.Json.Serialization;

namespace SWEEP.DTOs.ResponseDTOs.Profile
{
    public class EmployerProfileResponseDTO
    {
        public int UserId { get; set; }
        public string EmployerName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}

/DTOs/ResponseDTOs/Profile/FieldResponseDTO.cs:
namespace SWEEP.DTOs.ResponseDTOs.Profile
{
    public class FieldResponseDTO
    {
        public int FieldId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}

/DTOs/RequestDTOs/Profile/StudentProfileRequest.cs:
using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Profile
{
    public class StudentProfileRequest
    {
        [JsonPropertyName("studentName")]
        public required string StudentName { get; set; }
        
        [JsonPropertyName("university")]
        public required string University { get; set; }
        
        [JsonPropertyName("cgpa")]
        public decimal CGPA { get; set; }
        
        [JsonPropertyName("graduationYear")]
        public int GraduationYear { get; set; }
        
        [JsonPropertyName("priorExperienceYears")]
        public int PriorExperienceYears { get; set; }
        
        [JsonPropertyName("fieldId")]
        public int FieldId { get; set; }
    }
}

/DTOs/RequestDTOs/Profile/EmployerProfileRequest.cs:
using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Profile
{
    public class EmployerProfileRequest
    {
        [JsonPropertyName("employerName")]
        public required string EmployerName { get; set; }
        
        [JsonPropertyName("organization")]
        public required string Organization { get; set; }
    }
}
-----------------------------------------------------------------

AuthController.cs:
using Microsoft.AspNetCore.Authorization; //jwt auth
using Microsoft.AspNetCore.Mvc; //for my endpoints
using SWEEP.Models;
using SWEEP.Services; //AuthService, ClerkAuthService
using System.Text.Json.Serialization; //JSON responses

namespace SWEEP.Controllers
{
    [ApiController]
    [Route("api/[controller]")] //base route: /api/auth
    public class AuthController : ControllerBase
    {
        private readonly ClerkAuthService _clerkAuthService;
        private readonly AuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            ClerkAuthService clerkAuthService, //auth with clerk
            AuthService authService, //traditional auth
            ILogger<AuthController> logger) //info logger
        {
            //init services
            _clerkAuthService = clerkAuthService;
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")] // /api/auth/register
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
            //obj of type RegisterRequest, json -> c#
        {
            //validate RegisterRequest
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Registering user: {Email}, role: {Role}", request.Email, request.Role);

            //call reg method of authService, traditional auth.
            var user = await _authService.Register(request.Email, request.Password, request.Role);

            //user already existed
            if (user == null)
            {
                _logger.LogWarning("reg failed, user already exists: {Email}", request.Email);
                return BadRequest(new { message = "User already exists" });
            }

            //user created
            _logger.LogInformation("User registered successfully. UserId: {UserId}", user.UserId);

            //gen JWT and refresh token
            var jwtToken = _authService.GenerateJwtToken(user);
            _logger.LogInformation("JWT token generated for {UserId}", user.UserId);

            var refreshToken = await _authService.GenerateRefreshToken(user);
            _logger.LogInformation("Refresh token generated for user {UserId}: {TokenId}", user.UserId, refreshToken.TokenId);

            SetRefreshTokenCookie(refreshToken.Token);
            _logger.LogInformation("Refresh token cookie set for user {UserId}", user.UserId);

            bool hasCompletedProfile = false;
            if (user.Role == UserRole.Student && user.StudentProfile != null)
            {
                hasCompletedProfile = true;
                _logger.LogInformation("User {UserId} has a completed student profile", user.UserId);
            }
            else if (user.Role == UserRole.Employer && user.EmployerProfile != null)
            {
                hasCompletedProfile = true;
                _logger.LogInformation("User {UserId} has a completed employer profile", user.UserId);
            }
            else
            {
                _logger.LogInformation("User {UserId} needs to complete their profile", user.UserId);
            }

            return Ok(new
            {
                user.UserId,
                user.Email,
                user.Role,
                hasCompletedProfile,
                token = jwtToken,
                message = "Registration successful",
                requiresProfileSetup = !hasCompletedProfile
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            _logger.LogInformation("login for email: {Email}", request.Email);

            var user = await _authService.Login(request.Email, request.Password);

            if (user == null)
            {
                _logger.LogWarning("Login failed for email: {Email}", request.Email);
                return Unauthorized(new { message = "Invalid email or password" });
            }

            _logger.LogInformation("Login successful for user {UserId}, email: {Email}", user.UserId, user.Email);

            //gen JWT and Refresh token
            var jwtToken = _authService.GenerateJwtToken(user);
            _logger.LogInformation("JWT token for user {UserId}", user.UserId);

            var refreshToken = await _authService.GenerateRefreshToken(user);
            _logger.LogInformation("Refresh token for user {UserId}: {TokenId}", user.UserId, refreshToken.TokenId);

            SetRefreshTokenCookie(refreshToken.Token);
            _logger.LogInformation("Refresh token cookie set for user {UserId}", user.UserId);

            bool hasCompletedProfile = false;
            if (user.Role == UserRole.Student && user.StudentProfile != null)
            {
                hasCompletedProfile = true;
                _logger.LogInformation("User {UserId} has a completed student profile", user.UserId);
            }
            else if (user.Role == UserRole.Employer && user.EmployerProfile != null)
            {
                hasCompletedProfile = true;
                _logger.LogInformation("User {UserId} has a completed employer profile", user.UserId);
            }
            else
            {
                _logger.LogInformation("User {UserId} needs to complete their profile", user.UserId);
            }

            return Ok(new
            {
                user.UserId,
                user.Email,
                user.Role,
                hasCompletedProfile,
                token = jwtToken,
                message = "Login successful"
            });
        }

        [HttpPost("clerk")] // /api/auth/clerk
        public async Task<IActionResult> AuthenticateWithClerk([FromBody] ClerkAuthRequest request)
        {
            _logger.LogInformation("recv clerk auth request");

            //token from clerk
            if (string.IsNullOrEmpty(request.Token))
            {
                _logger.LogWarning("clerk auth fail - no token");
                return BadRequest(new { message = "Token required" });
            }

            _logger.LogInformation("clerk token provided, token length: {TokenLength}", request.Token.Length);

            try
            {
                _logger.LogInformation("Calling ClerkAuthService.ValidateClerkToken");
                var result = await _clerkAuthService.ValidateClerkToken(request.Token);

                if (result.User != null)
                {
                    // Existing user - proceed with normal login flow
                    _logger.LogInformation("Existing Clerk user found: {UserId}, email: {Email}",
                        result.User.UserId, result.User.Email);

                    var jwtToken = _authService.GenerateJwtToken(result.User);
                    var refreshToken = await _authService.GenerateRefreshToken(result.User);
                    SetRefreshTokenCookie(refreshToken.Token);

                    bool hasCompletedProfile = false;
                    if (result.User.Role == UserRole.Student && result.User.StudentProfile != null)
                    {
                        hasCompletedProfile = true;
                    }
                    else if (result.User.Role == UserRole.Employer && result.User.EmployerProfile != null)
                    {
                        hasCompletedProfile = true;
                    }

                    return Ok(new
                    {
                        result.User.UserId,
                        result.User.Email,
                        result.User.Role,
                        hasCompletedProfile,
                        isNewUser = false,
                        token = jwtToken,
                        message = "Successfully authenticated with Clerk",
                        requiresRoleSelection = false,
                        requiresProfileSetup = !hasCompletedProfile
                    });
                }
                else if (result.ClerkUserData != null)
                {
                    //new user, role selection before DB creation
                    _logger.LogInformation("New Clerk user detected, email: {Email}. Role selection required.",
                        result.ClerkUserData.Email);

                    return Ok(new
                    {
                        email = result.ClerkUserData.Email,
                        clerkId = result.ClerkUserData.ClerkId,
                        isNewUser = true,
                        message = "New user detected - role selection required",
                        requiresRoleSelection = true,
                        requiresProfileSetup = false
                    });
                }
                else
                {
                    _logger.LogWarning("Clerk authentication failed - invalid token or user data");
                    return Unauthorized(new { message = "Invalid token" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception during Clerk authentication process");
                return StatusCode(500, new { message = "An error occurred during authentication with Clerk" });
            }
        }

        [HttpPost("clerk/complete-registration")]
        public async Task<IActionResult> CompleteClerkRegistration([FromBody] CompleteClerkRegistrationRequest request)
        {
            _logger.LogInformation("recv clerk reg completion request for email: {Email}, role: {Role}",
                request.Email, request.Role);

            try
            {
                //validate clerk token
                var validationResult = await _clerkAuthService.ValidateClerkToken(request.ClerkToken);

                //compare fetched with request data
                if (validationResult.ClerkUserData == null ||
                    validationResult.ClerkUserData.Email != request.Email ||
                    validationResult.ClerkUserData.ClerkId != request.ClerkId)
                {
                    _logger.LogWarning("Invalid Clerk token or mismatched user data during registration completion");
                    return BadRequest(new { message = "Invalid or expired registration data" });
                }

                //check if user already exists
                var existingUser = await _authService.GetUserByEmail(request.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning("User already exists: {Email}", request.Email);
                    return BadRequest(new { message = "User already exists" });
                }

                //create user in the database
                var user = await _authService.CreateClerkUser(request.Email, request.ClerkId, request.Role);
                if (user == null)
                {
                    _logger.LogError("Failed to create user during Clerk registration completion");
                    return StatusCode(500, new { message = "Failed to create user account" });
                }

                _logger.LogInformation("Successfully created Clerk user: {UserId}, email: {Email}, role: {Role}",
                    user.UserId, user.Email, user.Role);

                // Generate tokens for the new user
                var jwtToken = _authService.GenerateJwtToken(user);
                var refreshToken = await _authService.GenerateRefreshToken(user);
                SetRefreshTokenCookie(refreshToken.Token);

                return Ok(new
                {
                    user.UserId,
                    user.Email,
                    user.Role,
                    hasCompletedProfile = false, //new users always need to complete profile
                    isNewUser = true,
                    token = jwtToken,
                    message = "Registration completed successfully",
                    requiresRoleSelection = false,
                    requiresProfileSetup = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception during Clerk registration completion");
                return StatusCode(500, new { message = "An error occurred during registration completion" });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            _logger.LogInformation("Received token refresh request");

            //get refresh token from cookie
            if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            {
                _logger.LogWarning("Token refresh failed, no refresh_token cookie");
                return BadRequest(new { message = "Refresh token is required" });
            }

            _logger.LogInformation("refresh_token cookie found, validating token");

            var (user, newRefreshToken) = await _authService.ValidateRefreshToken(refreshToken);

            if (user == null || newRefreshToken == null)
            {
                _logger.LogWarning("token refresh failed, invalid or expired refresh token");
                return Unauthorized(new { message = "Invalid or expired refresh token" });
            }

            _logger.LogInformation("Refresh token validated for user {UserId}", user.UserId);

            //generate new JWT token
            var jwtToken = _authService.GenerateJwtToken(user);
            _logger.LogInformation("New JWT token generated for user {UserId}", user.UserId);

            //set new refresh token cookie
            SetRefreshTokenCookie(newRefreshToken.Token);
            _logger.LogInformation("New refresh token cookie set for user {UserId}", user.UserId);

            bool hasCompletedProfile = false;
            if (user.Role == UserRole.Student && user.StudentProfile != null)
            {
                hasCompletedProfile = true;
            }
            else if (user.Role == UserRole.Employer && user.EmployerProfile != null)
            {
                hasCompletedProfile = true;
            }

            return Ok(new
            {
                user.UserId,
                user.Email,
                user.Role,
                hasCompletedProfile,
                token = jwtToken,
                message = "Token refreshed successfully"
            });
        }

        [Authorize]
        [HttpPost("set-role")]
        public async Task<IActionResult> SetUserRole([FromBody] SetRoleRequest request)
        {
            try
            {
                // Get user ID from the JWT token
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
                {
                    _logger.LogWarning("Invalid user ID in token: {UserId}", userId);
                    return BadRequest(new { message = "Invalid user ID" });
                }

                _logger.LogInformation("Setting role {Role} for user {UserId}", request.Role, userIdInt);

                var success = await _authService.UpdateUserRole(userIdInt, request.Role);

                if (!success)
                {
                    _logger.LogWarning("Failed to update role for user {UserId}", userIdInt);
                    return BadRequest(new { message = "Failed to update user role" });
                }

                _logger.LogInformation("Successfully updated role to {Role} for user {UserId}", request.Role, userIdInt);
                return Ok(new { message = "User role updated successfully", role = request.Role });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user role");
                return StatusCode(500, new { message = "An error occurred while updating the role" });
            }
        }

        private void SetRefreshTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.Strict, //cookie not sent with cross-site requests
                Secure = true //only over https
            };

            Response.Cookies.Append("refresh_token", token, cookieOptions);
        }
    }
    public class ClerkAuthRequest
    {
        [JsonPropertyName("token")]
        public string Token { get; set; } = string.Empty;
    }

    public class CompleteClerkRegistrationRequest
    {
        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("clerkId")]
        public required string ClerkId { get; set; }

        [JsonPropertyName("clerkToken")]
        public required string ClerkToken { get; set; }

        [JsonPropertyName("role")]
        public required UserRole Role { get; set; }
    }

    public class RegisterRequest
    {
        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("password")]
        public required string Password { get; set; }

        [JsonPropertyName("role")]
        public UserRole Role { get; set; } = UserRole.Student;
    }

    public class LoginRequest
    {
        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("password")]
        public required string Password { get; set; }
    }

    public class SetRoleRequest
    {
        [JsonPropertyName("role")]
        public required UserRole Role { get; set; }
    }
}

ClerkAuthService.cs:
using Microsoft.EntityFrameworkCore;
using SWEEP.Data;
using SWEEP.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SWEEP.Services
{
    public class ClerkAuthService
    {
        private readonly SweepDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ClerkAuthService> _logger;
        private readonly HttpClient _httpClient;

        public ClerkAuthService(SweepDbContext context, IConfiguration configuration,
            ILogger<ClerkAuthService> logger, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient("ClerkAPI");
        }

        public async Task<ClerkValidationResult> ValidateClerkToken(string jwtToken)
        {
            try
            {
                _logger.LogInformation("validating clerk token");

                //decode the JWT token
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadJwtToken(jwtToken);

                //user id from token
                var clerkUserId = jsonToken.Claims.FirstOrDefault(x => x.Type == "sub")?.Value;
                _logger.LogInformation("clerk user ID: {UserId}", clerkUserId);

                if (string.IsNullOrEmpty(clerkUserId))
                {
                    _logger.LogWarning("No user ID found in JWT token");
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                // Get user details from Clerk API
                var secretKey = _configuration["Clerk:SecretKey"];

                if (string.IsNullOrEmpty(secretKey))
                {
                    _logger.LogError("clerk secret key not configured");
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                _logger.LogInformation("requesting clerk API for user: {UserId}", clerkUserId);

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", secretKey);

                //get req
                var userResponse = await _httpClient.GetAsync($"https://api.clerk.com/v1/users/{clerkUserId}");

                _logger.LogInformation("clerk API response status: {StatusCode}", userResponse.StatusCode);

                if (!userResponse.IsSuccessStatusCode)
                {
                    var errorContent = await userResponse.Content.ReadAsStringAsync();
                    _logger.LogWarning("failed to get user details: {StatusCode}, Content: {Content}",
                        userResponse.StatusCode, errorContent);
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                var responseContent = await userResponse.Content.ReadAsStringAsync();
                _logger.LogInformation("clerk API response content: {Content}", responseContent);

                //json to c#
                var userData = JsonSerializer.Deserialize<ClerkUser>(responseContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
                    PropertyNameCaseInsensitive = true
                });

                if (userData?.Id == null || userData?.EmailAddresses == null)
                {
                    _logger.LogWarning("Invalid user data from Clerk API");
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                //first email address object where the Id matches the PrimaryEmailAddressId of the user.
                var primaryEmail = userData.EmailAddresses
                    .FirstOrDefault(e => e.Id == userData.PrimaryEmailAddressId)?.EmailAddress;

                if (string.IsNullOrEmpty(primaryEmail))
                {
                    _logger.LogWarning("User has no primary email address");
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                _logger.LogInformation("Processing user with email: {Email}", primaryEmail);

                //see if user already exists in our database
                var existingUser = await _context.Users
                    .Include(u => u.StudentProfile)
                    .Include(u => u.EmployerProfile)
                    .FirstOrDefaultAsync(u => u.ClerkId == userData.Id || u.Email == primaryEmail);

                if (existingUser != null)
                {
                    //existing user
                    if (string.IsNullOrEmpty(existingUser.ClerkId))
                    {
                        _logger.LogInformation("link user to Clerk ID");
                        existingUser.ClerkId = userData.Id;
                        await _context.SaveChangesAsync();
                    }

                    _logger.LogInformation("Returning existing user: {UserId}", existingUser.UserId);
                    return new ClerkValidationResult { User = existingUser, ClerkUserData = null };
                }
                else
                {
                    // New user - return Clerk data for role selection
                    _logger.LogInformation("New user detected - returning Clerk data for role selection");
                    var clerkUserData = new ClerkUserData
                    {
                        ClerkId = userData.Id,
                        Email = primaryEmail
                    };
                    return new ClerkValidationResult { User = null, ClerkUserData = clerkUserData };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating Clerk token");
                return new ClerkValidationResult { User = null, ClerkUserData = null };
            }
        }
    }

    //result class
    public class ClerkValidationResult
    {
        public User? User { get; set; }
        public ClerkUserData? ClerkUserData { get; set; }
    }

    //temporary clerk user data class
    public class ClerkUserData
    {
        public required string ClerkId { get; set; }
        public required string Email { get; set; }
    }

    //clerk API v1 responses class
    public class ClerkUser
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("primary_email_address_id")]
        public string? PrimaryEmailAddressId { get; set; }

        [JsonPropertyName("email_addresses")]
        public List<ClerkEmailAddress>? EmailAddresses { get; set; }
    }

    public class ClerkEmailAddress
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("email_address")]
        public string? EmailAddress { get; set; }
    }
}


AuthService.cs:
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWEEP.Data;
using SWEEP.Models;

namespace SWEEP.Services
{
    public class AuthService
    {
        private readonly SweepDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(SweepDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<User?> Register(string email, string password, UserRole role)
            //return user obj
        {
            //see if user already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
            {
                return null;
            }

            //if new:
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            //create new user
            var user = new User
            {
                Email = email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Role = role
            };

            _context.Users.Add(user); //dbcontext.UserTable.Add
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User?> Login(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.StudentProfile)
                .Include(u => u.EmployerProfile)
                .FirstOrDefaultAsync(u => u.Email == email);
                
            if (user == null || user.PasswordHash == null || user.PasswordSalt == null)
            {
                return null;
            }

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }

            return user;
        }

        public async Task<RefreshToken> GenerateRefreshToken(User user)
        {
            var refreshToken = new RefreshToken
            {
                //64 byte random string
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                UserId = user.UserId
            };

            //remove old tokens for this user
            var oldTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == user.UserId)
                .ToListAsync();

            //remove range: del multiple records in one go
            _context.RefreshTokens.RemoveRange(oldTokens);

            //store token
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return refreshToken;
        }

        public async Task<(User? User, RefreshToken? NewRefreshToken)> ValidateRefreshToken(string token)
        {
            var refreshToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .ThenInclude(u => u.StudentProfile)
                .Include(rt => rt.User)
                .ThenInclude(u => u.EmployerProfile)
                .FirstOrDefaultAsync(rt => rt.Token == token);

            if (refreshToken == null || refreshToken.User == null)
            {
                return (null, null);
            }

            // Check if token is expired
            if (refreshToken.ExpiresAt < DateTime.UtcNow)
            {
                // Remove expired token
                _context.RefreshTokens.Remove(refreshToken);
                await _context.SaveChangesAsync();
                return (null, null);
            }

            // Generate new refresh token
            var newRefreshToken = await GenerateRefreshToken(refreshToken.User);

            return (refreshToken.User, newRefreshToken);
        }

        public async Task<bool> UpdateUserRole(int userId, UserRole role)
        {
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null)
            {
                return false;
            }
            
            user.Role = role;
            user.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            //secret key in appsettings.json
            var key = Encoding.ASCII.GetBytes(_configuration["JWT:Secret"] ?? 
                throw new InvalidOperationException("JWT:Secret not configured"));

            //securityTokenDescriptor: desc properties of token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                //claimsIdentity: represent user identity with claims
                //create array of claims
                Subject = new ClaimsIdentity(new[]
                {
                    //claims considered: id, email, role
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),

                Expires = DateTime.UtcNow.AddHours(1), //token expiry

                //signing token to avoid tamper, HMAC-SHA256 algorithm
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            //str conversion
            return tokenHandler.WriteToken(token);
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != storedHash[i])
                {
                    return false;
                }
            }
            
            return true;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users
                .Include(u => u.StudentProfile)
                .Include(u => u.EmployerProfile)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> CreateClerkUser(string email, string clerkId, UserRole role)
        {
            try
            {
                var user = new User
                {
                    Email = email,
                    ClerkId = clerkId,
                    Role = role
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                // Log the exception if you have logging configured
                //_logger.LogError(ex, "Error creating Clerk user");
                return null;
            }
        }
    }
}


*/
