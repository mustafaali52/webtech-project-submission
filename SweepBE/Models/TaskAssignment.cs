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
