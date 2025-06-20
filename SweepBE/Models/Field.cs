using System.ComponentModel.DataAnnotations;

namespace SWEEP.Models
{
    public class Field
    {
        [Key]
        public int FieldId { get; set; }
        [Required, MaxLength(100)]
        public required string Name { get; set; }

        public virtual ICollection<StudentProfile> StudentProfiles { get; set; }
        = new HashSet<StudentProfile>();

        public virtual ICollection<JobTask> JobTasks { get; set; }
        = new HashSet<JobTask>();
    }
}
