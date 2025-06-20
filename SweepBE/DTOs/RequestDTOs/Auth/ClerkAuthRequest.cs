using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Auth
{
    public class ClerkAuthRequest
    {
        [JsonPropertyName("token")]
        public string Token { get; set; } = string.Empty;
    }
}