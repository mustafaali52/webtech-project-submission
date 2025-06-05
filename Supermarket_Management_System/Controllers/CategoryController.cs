using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core.Dtos;
using SuperMarketManagement.Models;
using SuperMarketManagement.Core;

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
        public async Task<IEnumerable<CategoryDto>> GetCategories()
        {
            var categories = await _dataBaseContext.Categories.ToListAsync();
            List<CategoryDto> categoryDtos = new List<CategoryDto>();
            foreach (var category in categories)
            {
                categoryDtos.Add(new CategoryDto
                {
                    Id = category.CategoryID,
                    Name = category.CategoryName
                });
            }
            return categoryDtos;
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory(CategoryDto categoryInfo)
        {
            var category = new Category
            {
                CategoryName = categoryInfo.Name
            };
            _dataBaseContext.Categories.Add(category);
            await _dataBaseContext.SaveChangesAsync();
            return Ok(new CategoryDto
            {
                Id = category.CategoryID,
                Name = category.CategoryName
            });
        }
    }
}