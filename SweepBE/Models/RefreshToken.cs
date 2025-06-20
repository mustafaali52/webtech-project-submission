using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SWEEP.Models
{
    public class RefreshToken
    {
        [Key]
        public int TokenId { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required, MaxLength(500)]
        public required string Token { get; set; }
        
        public DateTime ExpiresAt { get; set; }
        
        public DateTime CreatedAt { get; set; }
        
        public DateTime? RevokedAt { get; set; }
        
        public string? ReplacedBy { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
        
        public RefreshToken()
        {
        }

        public RefreshToken(string token, int userId, TimeSpan lifetime)
        {
            Token = token;
            UserId = userId;
            CreatedAt = DateTime.UtcNow;
            ExpiresAt = CreatedAt.Add(lifetime);
        }
        
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        
        public bool IsActive => RevokedAt == null && !IsExpired;
    }
}
