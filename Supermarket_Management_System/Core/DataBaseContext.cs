using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Models;
namespace SuperMarketManagement.Core;

public class DataBaseContext : DbContext
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<SaleItem> SaleItems { get; set; }

    public DataBaseContext(DbContextOptions<DataBaseContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>().HasKey(c => c.CategoryID);
        modelBuilder.Entity<Supplier>().HasKey(s => s.SupplierID);
        modelBuilder.Entity<Product>().HasKey(p => p.ProductID);
        modelBuilder.Entity<Customer>().HasKey(c => c.CustomerID);
        modelBuilder.Entity<Employee>().HasKey(e => e.EmployeeID);
        modelBuilder.Entity<Sale>().HasKey(s => s.SaleID);
        modelBuilder.Entity<SaleItem>().HasKey(si => si.SaleItemID);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryID);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Supplier)
            .WithMany(s => s.Products)
            .HasForeignKey(p => p.SupplierID);

        modelBuilder.Entity<Sale>()
            .HasOne(s => s.Customer)
            .WithMany(c => c.Sales)
            .HasForeignKey(s => s.CustomerID);

        modelBuilder.Entity<Sale>()
            .HasOne(s => s.Employee)
            .WithMany(e => e.Sales)
            .HasForeignKey(s => s.EmployeeID);

        modelBuilder.Entity<SaleItem>()
            .HasOne(si => si.Sale)
            .WithMany(s => s.SaleItems)
            .HasForeignKey(si => si.SaleID);

        modelBuilder.Entity<SaleItem>()
            .HasOne(si => si.Product)
            .WithMany(p => p.SaleItems)
            .HasForeignKey(si => si.ProductID);
    }
}
