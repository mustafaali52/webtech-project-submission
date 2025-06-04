using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core;
using SuperMarketManagement.Models;

namespace SuperMarketManagement.Controllers
{
    [ApiController]
    [Route("api/suppliers")]
    public class SupplierController : Controller
    {
        private readonly DataBaseContext _dataBaseContext;
        public SupplierController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        [HttpGet]
        public async Task<IEnumerable<Supplier>> GetSuppliers()
        {
            return await _dataBaseContext.Suppliers
                .Select(x => x).ToListAsync();
        }
    }
}
