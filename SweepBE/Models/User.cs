using System.ComponentModel.DataAnnotations;

namespace SWEEP.Models
{
    public enum UserRole
    {
        Student,
        Employer,
        Admin
    }
    public class User : IValidatableObject
    {
        [Key]
        public int UserId { get; set; }

        [Required, EmailAddress]
        public required string Email {  get; set; }

        public byte[]? PasswordHash { get; set; }

        public byte[]? PasswordSalt { get; set; }

        public string? ClerkId { get; set; }

        public required UserRole Role { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual StudentProfile? StudentProfile { get; set; }

        public virtual EmployerProfile? EmployerProfile { get; set; }

        public virtual ICollection<RefreshToken>? RefreshTokens { get; set; } //one user many refresh tokens
        = new HashSet<RefreshToken>(); //avoid null-ref
        public IEnumerable<ValidationResult> Validate(ValidationContext ctx)
        {
            if (PasswordHash == null && ClerkId == null)
            {
                yield return new ValidationResult(
                    "One set of credentials must be provided",
                    new[] { nameof(PasswordHash), nameof(PasswordSalt), nameof(ClerkId) }
                );
            }
        }

    }
}
