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