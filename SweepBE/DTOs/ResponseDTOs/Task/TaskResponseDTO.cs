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