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
        
        //emp info
        public string EmployerName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        //stats
        public int TotalRequests { get; set; }
        public int AcceptedRequests { get; set; }
        public int CompletedTasks { get; set; }
        public int ApprovedTasks { get; set; }
        
        //attachment
        public List<TaskAttachmentDTO> Attachments { get; set; } = new List<TaskAttachmentDTO>();

        //list of assignment
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