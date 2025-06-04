using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core;
using SuperMarketManagement.Models;

namespace SuperMarketManagement.Controllers
{
    [ApiController]
    [Route("api/saleitems")]
    public class SaleItemController : Controller
    {
        private readonly DataBaseContext _dataBaseContext;
        public SaleItemController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        [HttpGet]
        public async Task<IEnumerable<SaleItem>> GetSaleItems()
        {
            return await _dataBaseContext.SaleItems
                .Select(x => x).ToListAsync();
        }
    }
}
