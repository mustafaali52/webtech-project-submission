using System.Text.Json.Serialization;

namespace HospitalManagement.Domain.Entities
{
    public class Doctor
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Specialization { get; set; }
        public required string ContactNumber { get; set; }
        public required string Email { get; set; }
        
        [JsonIgnore] // Prevent circular reference
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}