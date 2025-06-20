using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Auth
{
    public class LoginRequest
    {
        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("password")]
        public required string Password { get; set; }
    }
}