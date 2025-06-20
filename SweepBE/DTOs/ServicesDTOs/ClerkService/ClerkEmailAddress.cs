using System.Text.Json.Serialization;

namespace SWEEP.DTOs.ServicesDTOs.ClerkService
{
    public class ClerkEmailAddress
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("email_address")]
        public string? EmailAddress { get; set; }
    }
}