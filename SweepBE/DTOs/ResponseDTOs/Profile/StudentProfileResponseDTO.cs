using System.Text.Json.Serialization;

namespace SWEEP.DTOs.ResponseDTOs.Profile
{
    public class StudentProfileResponseDTO
    {
        public int UserId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string University { get; set; } = string.Empty;
        public decimal CGPA { get; set; }
        public int GraduationYear { get; set; }
        public int PriorExperienceYears { get; set; }
        public int TokenBalance { get; set; }
        public int FieldId { get; set; }
        public string FieldName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}