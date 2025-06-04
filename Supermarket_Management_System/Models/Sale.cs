namespace SuperMarketManagement.Models;

public class Sale
{
    public int SaleID { get; set; }
    public int CustomerID { get; set; }
    public int EmployeeID { get; set; }
    public DateTime Date { get; set; }
    public decimal TotalAmount { get; set; }

    public Customer Customer { get; set; }
    public Employee Employee { get; set; }
    public ICollection<SaleItem> SaleItems { get; set; }
}
