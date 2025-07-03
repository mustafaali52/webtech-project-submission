using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Event_Mangement_System_WebTech_Project.Models.Dto
{
    public class UserDto
    {
        [Required]
        [MaxLength(100)]
        public string userName { get; set; }

        [Required]
        [EmailAddress]
        public string email { get; set; }

        [Required]
        public string passwordHash { get; set; }

        [ForeignKey("Role")]
        public int userRoleId { get; set; }
    }
}
