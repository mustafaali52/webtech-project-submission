using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookCart.Models
{
    // New CartItem model for Identity users
    public class ApplicationUserCartItem
    {
        [Key]
        public int CartItemId { get; set; }

        [Required]
        public int CartId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        public DateTime AddedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ApplicationUserCart Cart { get; set; } = null!;
        public virtual Book Book { get; set; } = null!;

        // Calculated property
        [NotMapped]
        public decimal TotalPrice => Quantity * UnitPrice;
    }

    // Legacy CartItem model for backward compatibility
    public class CartItem
    {
        public int CartItemId { get; set; }

        [Required]
        public int CartId { get; set; }

        [Required]
        public int BookId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        public DateTime AddedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Cart Cart { get; set; } = null!;
        public virtual Book Book { get; set; } = null!;

        // Calculated property
        [NotMapped]
        public decimal TotalPrice => Quantity * UnitPrice;
    }
}
