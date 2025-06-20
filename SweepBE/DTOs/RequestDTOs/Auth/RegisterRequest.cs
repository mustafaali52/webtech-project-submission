using SWEEP.Models;
using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Auth
{
    public class RegisterRequest
    {
        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("password")]
        public required string Password { get; set; }

        [JsonPropertyName("role")]
        public UserRole Role { get; set; } = UserRole.Student;
    }
}