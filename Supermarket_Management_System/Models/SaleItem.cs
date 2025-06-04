namespace SuperMarketManagement.Models;

public class SaleItem
{
    public int SaleItemID { get; set; }
    public int SaleID { get; set; }
    public int ProductID { get; set; }
    public int Quantity { get; set; }
    public decimal PriceAtSale { get; set; }

    public Sale Sale { get; set; }
    public Product Product { get; set; }
}
