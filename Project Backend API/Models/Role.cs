using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Event_Mangement_System_WebTech_Project.Models
{
    public class Role
    {
        [Key]
        public int roleId { get; set; }

        [Required]
        [MaxLength(50)]
        public string roleName { get; set; }

       
        public ICollection<User> Users { get; set; } = new List<User>(); // Nav Relationshis
    }
}
