using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Profile
{
    public class EmployerProfileRequest
    {
        [JsonPropertyName("employerName")]
        public required string EmployerName { get; set; }

        [JsonPropertyName("organization")]
        public required string Organization { get; set; }
    }
}