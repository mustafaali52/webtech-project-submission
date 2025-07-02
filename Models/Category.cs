using System.ComponentModel.DataAnnotations;

namespace BookCart.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string CategoryName { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        // Navigation property
        public virtual ICollection<Book> Books { get; set; } = new List<Book>();
    }
}
