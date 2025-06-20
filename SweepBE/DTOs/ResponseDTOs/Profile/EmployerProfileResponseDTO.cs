using System.Text.Json.Serialization;

namespace SWEEP.DTOs.ResponseDTOs.Profile
{
    public class EmployerProfileResponseDTO
    {
        public int UserId { get; set; }
        public string EmployerName { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}