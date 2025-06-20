using System.Text.Json.Serialization;

namespace SWEEP.DTOs.RequestDTOs.Profile
{
    public class StudentProfileRequest
    {
        [JsonPropertyName("studentName")]
        public required string StudentName { get; set; }

        [JsonPropertyName("university")]
        public required string University { get; set; }

        [JsonPropertyName("cgpa")]
        public decimal CGPA { get; set; }

        [JsonPropertyName("graduationYear")]
        public int GraduationYear { get; set; }

        [JsonPropertyName("priorExperienceYears")]
        public int PriorExperienceYears { get; set; }

        [JsonPropertyName("fieldId")]
        public int FieldId { get; set; }
    }
}