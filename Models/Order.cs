using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyMvcApp.Models; // Add this if Order is in MyMvcApp.Models

public class Order
{
    public int Id { get; set; }

    [Required]
    public DateTime OrderDate { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; }
}