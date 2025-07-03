using System.ComponentModel.DataAnnotations;

namespace Event_Mangement_System_WebTech_Project.Models.Dto
{
    public class EventDto
    {
        [Required]
        [MaxLength(200)]
        public string eventTitle { get; set; }

        [Required]
        public int eventTypeId { get; set; }

        [MaxLength(500)]
        public string description { get; set; }

        [Required]
        public DateTime startDate { get; set; }

        [Required]
        public DateTime endDate { get; set; }

        [Required]
        public int organizerId { get; set; }

        [Required]
        public int locationId { get; set; }
    }
}
