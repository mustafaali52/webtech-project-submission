using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using SWEEP.Data;
using SWEEP.DTOs.RequestDTOs.Task;
using SWEEP.DTOs.ResponseDTOs.Task;
using SWEEP.Models;
using Microsoft.EntityFrameworkCore.Query;

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
                return NotFound(new { message = "Task not found or don't own this task" });
            }

            //is task deadline has passed
            if (task.Deadline < DateTime.UtcNow)
            {
                return BadRequest(new { message = "expired deadlines" });
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

            //isStudent
            var student = await _context.Users.FindAsync(studentId.Value);
            if (student == null || student.Role != UserRole.Student)
            {
                return BadRequest(new { message = "Only students can accept tasks" });
            }

            //get assignment
            var assignment = await _context.TaskAssignments
                .Include(ta => ta.JobTask)
                .FirstOrDefaultAsync(ta => ta.AssignmentId == request.AssignmentId && ta.UserId == studentId.Value);

            if (assignment == null)
            {
                return NotFound(new { message = "Assignment not found or you are not the assigned student" });
            }

            //alrAccepted
            if (assignment.AcceptedAt.HasValue)
            {
                return BadRequest(new { message = "This task has already been accepted" });
            }

            //deadline
            if (assignment.JobTask.Deadline < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Cannot accept tasks with expired deadlines" });
            }

            //acceptTask
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

            //isComplete
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
                return Unauthorized(new { message = "Only task owner can approve completions" });
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
                return Unauthorized(new { message = "User ID not in token" });
            }

            var query = _context.TaskAssignments
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
                .ToListAsync(); var result = assignments.Select(a => new
                {
                    AssignmentId = a.AssignmentId,
                    TaskId = a.JobTaskId,
                    TaskTitle = a.JobTask.Title,
                    TaskDescription = a.JobTask.Description,
                    Deadline = a.JobTask.Deadline,
                    Complexity = a.JobTask.Complexity,
                    MonetaryCompensation = a.JobTask.MonetaryCompensation,
                    FieldName = a.JobTask.Field?.Name,
                    RequiresExperience = a.JobTask.RequiresExperience,
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
                return NotFound(new { message = "Assignment not found or no permission to unassign it" });
            }

            //no unassigning if task complete
            if (assignment.CompletedAt.HasValue)
            {
                return BadRequest(new { message = "Cannot unassign a task already completed" });
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