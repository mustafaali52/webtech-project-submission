using System.ComponentModel.DataAnnotations;

namespace Event_Mangement_System_WebTech_Project.Models.Dto
{
    public class EventTypeDto
    {
        [Required]
        [MaxLength(50)]
        public string typeName { get; set; }
    }
}
