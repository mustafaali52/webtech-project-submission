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