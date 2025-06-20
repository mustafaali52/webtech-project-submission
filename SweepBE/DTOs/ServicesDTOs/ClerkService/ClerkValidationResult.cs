using SWEEP.Models;

namespace SWEEP.DTOs.ServicesDTOs.ClerkService
{
    public class ClerkValidationResult
    {
        public User? User { get; set; }
        public ClerkUserData? ClerkUserData { get; set; }
    }
}