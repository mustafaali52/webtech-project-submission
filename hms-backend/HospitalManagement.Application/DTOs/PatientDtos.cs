namespace HospitalManagement.Application.DTOs
{
    public class PatientDto
    {
        public int Id { get; set; }
        public required string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public required string Gender { get; set; }
    }

    public class CreatePatientDto
    {
        public required string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public required string Gender { get; set; }
    }

    public class UpdatePatientDto
    {
        public required string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public required string Gender { get; set; }
    }
}