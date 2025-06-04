namespace SuperMarketManagement.Models;

public class Customer
{
    public int CustomerID { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }

    public ICollection<Sale> Sales { get; set; }
}
