using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Event_Mangement_System_WebTech_Project.Models
{
    public class EventType
    {
        [Key]
        public int typeId { get; set; }

        [Required]
        [MaxLength(50)]
        public string  typeName { get; set; }

        // Nav Relationship - one event type can have many events
        [JsonIgnore]
        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
