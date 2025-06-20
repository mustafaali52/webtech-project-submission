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
