using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Event_Mangement_System_WebTech_Project.Models
{
    public class Registration
    {
        [Key]
        public int registrationId { get; set; }

        [ForeignKey("Attendee")]
        public int attendeeId { get; set; }

        [ForeignKey("Event")]
        public int eventId { get; set; }

        [Required]
        public DateTime registeredAt { get; set; }

        [Required]
        public bool isConfirmed { get; set; } = true;

        // Navigation
        public User Attendee { get; set; }
        public Event Event { get; set; }
    }
}
