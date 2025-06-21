using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public string Email { get; set; }

    public ICollection<Order> Orders { get; set; }
    public ICollection<Cart> Carts { get; set; }
}