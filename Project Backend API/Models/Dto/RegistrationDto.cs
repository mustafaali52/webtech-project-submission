using System.ComponentModel.DataAnnotations;

namespace Event_Mangement_System_WebTech_Project.Models.Dto
{
    public class RegistrationDto
    {
        //public int? registerationId { get; set; } // optional on create

        [Required]
        public int attendeeId { get; set; }

        [Required]
        public int eventId { get; set; }

        //public string eventTitle { get; set; }

    }
}
