namespace SuperMarketManagement.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public string Name { get; set; }
        public int CategoryID { get; set; }
        public int SupplierID { get; set; }
        public int QuantityInStock { get; set; }
        public decimal UnitPrice { get; set; }

        public Category Category { get; set; }
        public Supplier Supplier { get; set; }
        public ICollection<SaleItem> SaleItems { get; set; }
    }

}
