using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWEEP.Models
{
    public class EmployerProfile
    {
        [Key]
        [ForeignKey(nameof(User))] //1user1employerProfile
        public int UserId { get; set; }
        [Required, MaxLength(100)]
        public required string EmployerName { get; set; }
        [Required, MaxLength(200)]
        //employer org
        public required string Organization {  get; set; }
        public virtual User User { get; set; } = null!;
        //tasks by employer
        public virtual ICollection<JobTask> JobTasks { get; set; }
        = new HashSet<JobTask>();
    }
}
