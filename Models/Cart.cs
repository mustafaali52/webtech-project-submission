using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Cart
{
    public int Id { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; }

    [ForeignKey("Product")]
    public int ProductId { get; set; }
    public Product Product { get; set; }

    [Required]
    public int Quantity { get; set; }
}
