using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Event_Mangement_System_WebTech_Project.Models
{
    public class Event
    {
        [Key]
        public int eventId { get; set; }

        [Required]
        [MaxLength(200)]
        public string eventTitle { get; set; }

        [Required]
        public int eventTypeId { get; set; }

        public string description { get; set; }

        [Required]
        public DateTime createdAt { get; set; }

        [Required]
        public DateTime startDate { get; set; }

        [Required]
        public DateTime endDate { get; set; }

        [ForeignKey("Organizer")]
        public int organizerId { get; set; }

        [ForeignKey("Location")]
        public int locationId { get; set; }

        // Navigation
        public User Organizer { get; set; }
        public Location Location { get; set; }
        public EventType EventType { get; set; }

        [JsonIgnore]
        public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }

}
