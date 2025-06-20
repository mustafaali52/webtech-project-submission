using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWEEP.Data;
using SWEEP.DTOs.RequestDTOs.Task;
using SWEEP.DTOs.ResponseDTOs.Task;
using SWEEP.Models;
using SWEEP.Services;
using System.Security.Claims;

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
            
            //task req obj
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

            //file uploads
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

        [HttpGet("download-attachment/{attachmentId}")]
        public async Task<IActionResult> DownloadAttachment(int attachmentId)
        {
            var userId = GetUserId();
            if (!userId.HasValue)
            {
                return Unauthorized(new { message = "User ID not in token" });
            }

            try
            {
                //get attachment
                var attachment = await _context.TaskAttachments
                    .Include(ta => ta.JobTask)
                        .ThenInclude(jt => jt.Employer)
                    .Include(ta => ta.JobTask)
                        .ThenInclude(jt => jt.TaskAssignments)
                            .ThenInclude(assignment => assignment.Student)
                    .FirstOrDefaultAsync(ta => ta.AttachmentId == attachmentId);

                if (attachment == null)
                {
                    return NotFound(new { message = "Attachment not found" });
                }

                bool hasPermission = false;
                
                if (attachment.JobTask.UserId == userId.Value)
                {
                    hasPermission = true;
                }
                
                else
                {
                    var userAssignment = attachment.JobTask.TaskAssignments
                        .FirstOrDefault(ta => ta.UserId == userId.Value && ta.AcceptedAt.HasValue);

                    if (userAssignment != null)
                    {
                        hasPermission = true;
                    }
                }
                if (!hasPermission)
                {
                    return StatusCode(403, new { message = "You don't have permission to download this attachment" });
                }

                //download file
                var fileBytes = await _cloudinaryService.DownloadFileAsync(attachment.FileUrl);

                if (fileBytes == null || fileBytes.Length == 0)
                {
                    return NotFound(new { message = "File not found or could not be downloaded" });
                }

                //return file
                var contentType = attachment.FileType ?? "application/octet-stream";
                var fileName = attachment.FileName ?? $"attachment_{attachmentId}";

                return File(fileBytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading attachment {AttachmentId}", attachmentId);
                return StatusCode(500, new { message = "error occurred while downloading the file" });
            }
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