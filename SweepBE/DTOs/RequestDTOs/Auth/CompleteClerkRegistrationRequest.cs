using SWEEP.Models;
using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Auth
{
    public class CompleteClerkRegistrationRequest
    {
        [JsonPropertyName("email")]
        public required string Email { get; set; }

        [JsonPropertyName("clerkId")]
        public required string ClerkId { get; set; }

        [JsonPropertyName("clerkToken")]
        public required string ClerkToken { get; set; }

        [JsonPropertyName("role")]
        public required UserRole Role { get; set; }
    }
}