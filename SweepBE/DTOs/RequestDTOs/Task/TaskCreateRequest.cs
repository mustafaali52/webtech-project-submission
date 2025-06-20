using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using SWEEP.Models;

namespace SWEEP.DTOs.RequestDTOs.Task
{
    public class TaskCreateRequest
    {
        [Required]
        [JsonPropertyName("title")]
        [StringLength(200, MinimumLength = 5)]
        public required string Title { get; set; }

        [Required]
        [JsonPropertyName("description")]
        [StringLength(2000, MinimumLength = 20)]
        public required string Description { get; set; }

        [Required]
        [JsonPropertyName("deadline")]
        public DateTime Deadline { get; set; }

        [JsonPropertyName("requiresExperience")]
        public bool RequiresExperience { get; set; }

        [Required]
        [JsonPropertyName("complexity")]
        public Complexity Complexity { get; set; }

        [JsonPropertyName("monetaryCompensation")]
        public decimal? MonetaryCompensation { get; set; }

        [Required]
        [JsonPropertyName("fieldId")]
        public int FieldId { get; set; }
    }
}