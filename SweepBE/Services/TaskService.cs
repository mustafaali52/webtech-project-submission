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

            //add attachments
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

            //Add attachment to the response
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

            //is requesting usr employer
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

            var field = await _context.Fields.FindAsync(request.FieldId);
            if (field == null)
            {
                _logger.LogWarning("Invalid field ID: {FieldId}", request.FieldId);
                return null;
            }

            //update props
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

            //assignment len
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
                _logger.LogWarning("Task not found, user not authorized: TaskId {TaskId}, UserId {UserId}", taskId, userId);
                return false;
            }

            //hasAssignments
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

            //Apply filter
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