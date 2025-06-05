using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core.Dtos;
using SuperMarketManagement.Models;
using SuperMarketManagement.Core;

namespace SuperMarketManagement.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : Controller
    {
        private readonly DataBaseContext _dataBaseContext;
        public ProductController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        [HttpGet]
        public async Task<IEnumerable<ProductDto>> GetProducts()
        {
            var products = await _dataBaseContext.Products.ToListAsync();
            List<ProductDto> productDtos = new List<ProductDto>();
            foreach (var product in products)
            {
                productDtos.Add(new ProductDto
                {
                    Id = product.ProductID,
                    Name = product.Name,
                    Price = product.UnitPrice,
                    Quantity = product.QuantityInStock,
                    CategoryId = product.CategoryID,
                    SupplierId = product.SupplierID
                });
            }
            return productDtos;
        }

        [HttpPost]
        public async Task<IActionResult> AddProduct(ProductDto productInfo)
        {
            var product = new Product
            {
                Name = productInfo.Name,
                UnitPrice = productInfo.Price,
                QuantityInStock = productInfo.Quantity,
                CategoryID = productInfo.CategoryId,
                SupplierID = productInfo.SupplierId
            };
            _dataBaseContext.Products.Add(product);
            await _dataBaseContext.SaveChangesAsync();
            return Ok(new ProductDto
            {
                Id = product.ProductID,
                Name = product.Name,
                Price = product.UnitPrice,
                Quantity = product.QuantityInStock,
                CategoryId = product.CategoryID,
                SupplierId = product.SupplierID
            });
        }
    }
}