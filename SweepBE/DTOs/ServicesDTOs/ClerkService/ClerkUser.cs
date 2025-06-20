using System.Text.Json.Serialization;

namespace SWEEP.DTOs.ServicesDTOs.ClerkService
{
    public class ClerkUser
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("primary_email_address_id")]
        public string? PrimaryEmailAddressId { get; set; }

        [JsonPropertyName("email_addresses")]
        public List<ClerkEmailAddress>? EmailAddresses { get; set; }
    }
}