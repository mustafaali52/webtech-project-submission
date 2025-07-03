using System.ComponentModel.DataAnnotations;

namespace Event_Mangement_System_WebTech_Project.Models.Dto
{
    public class LocationDto
    {
        [Required]
        [MaxLength(150)]
        public string locationName { get; set; }

        [Required]
        public string address { get; set; }

        [Required]
        public int capacity { get; set; }
    }
}
