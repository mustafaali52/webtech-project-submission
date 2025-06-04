namespace SuperMarketManagement.Models;

public class Supplier
{
    public int SupplierID { get; set; }
    public string Name { get; set; }
    public string ContactInfo { get; set; }

    public ICollection<Product> Products { get; set; }
}
