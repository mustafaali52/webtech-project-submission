using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Event_Mangement_System_WebTech_Project.Models
{
    public class Location
    {
        [Key]
        public int locationId { get; set; }

        [Required]
        [MaxLength(150)]
        public string locationName { get; set; }

        [Required]
        public string address { get; set; }

        [Required]
        public int capacity { get; set; }

        [JsonIgnore]
        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}
