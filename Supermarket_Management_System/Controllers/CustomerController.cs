using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core;
using SuperMarketManagement.Models;

namespace SuperMarketManagement.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomerController : Controller
    {
        private readonly DataBaseContext _dataBaseContext;
        public CustomerController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        [HttpGet]
        public async Task<IEnumerable<Customer>> GetCustomers()
        {
            return await _dataBaseContext.Customers
                .Select(x => x).ToListAsync();
        }
    }
}
