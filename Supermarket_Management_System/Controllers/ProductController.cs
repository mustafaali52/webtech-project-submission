using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using SuperMarketManagement.Core;
using SuperMarketManagement.Models;

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
        public async Task<IEnumerable<Product>> GetProducts()
        {
            return await _dataBaseContext.Products
                .Select(x => x).ToListAsync();
        }

    }
}
