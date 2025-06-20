using SWEEP.Models;
using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Auth
{
    public class SetRoleRequest
    {
        [JsonPropertyName("role")]
        public required UserRole Role { get; set; }
    }
}