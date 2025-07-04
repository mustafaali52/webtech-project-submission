namespace HospitalManagement.Domain.DTOs
{
    public class TokenDto
    {
        public required string Token { get; set; }
        public required string Username { get; set; }
        public required string Role { get; set; }
        public DateTime Expiration { get; set; }
    }
}