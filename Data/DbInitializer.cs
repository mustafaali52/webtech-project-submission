using MyMvcApp.Models;
using System.Linq;

namespace MyMvcApp.Data
{
    public static class DbInitializer
    {
        public static void Seed(ApplicationDbContext context)
        {
            // Seed Categories
            if (!context.Categories.Any())
            {
                context.Categories.AddRange(
                    new Category { Name = "Electronics" },
                    new Category { Name = "Books" }
                );
                context.SaveChanges();
            }

            // Seed Products
            if (!context.Products.Any())
            {
                var electronics = context.Categories.First(c => c.Name == "Electronics");
                var books = context.Categories.First(c => c.Name == "Books");

                context.Products.AddRange(
                    new Product { Name = "Laptop", Price = 1000, CategoryId = electronics.Id },
                    new Product { Name = "Novel", Price = 20, CategoryId = books.Id }
                );
                context.SaveChanges();
            }

            // Seed Users
            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User { Name = "Alice", Email = "alice@example.com" },
                    new User { Name = "Bob", Email = "bob@example.com" }
                );
                context.SaveChanges();
            }
        }
    }
} 