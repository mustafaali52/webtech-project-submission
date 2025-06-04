using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core;
using SuperMarketManagement.Models;

namespace SuperMarketManagement.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : Controller
    {
        private readonly DataBaseContext _dataBaseContext;
        public CategoryController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        [HttpGet]
        public async Task<IEnumerable<Category>> GetCategories()
        {
            return await _dataBaseContext.Categories
                .Select(x => x).ToListAsync();
        }
    }
}
