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
