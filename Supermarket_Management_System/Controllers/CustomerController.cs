using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core.Dtos;
using SuperMarketManagement.Models;
using SuperMarketManagement.Core;

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
        public async Task<IEnumerable<CustomerDto>> GetCustomers()
        {
            var customers = await _dataBaseContext.Customers.ToListAsync();
            List<CustomerDto> customerDtos = new List<CustomerDto>();
            foreach (var customer in customers)
            {
                customerDtos.Add(new CustomerDto
                {
                    Id = customer.CustomerID,
                    Name = customer.Name,
                    Email = customer.Email,
                    Phone = customer.Phone
                });
            }
            return customerDtos;
        }

        [HttpPost]
        public async Task<IActionResult> AddCustomer(CustomerDto customerInfo)
        {
            var customer = new Customer
            {
                Name = customerInfo.Name,
                Email = customerInfo.Email,
                Phone = customerInfo.Phone
            };
            _dataBaseContext.Customers.Add(customer);
            await _dataBaseContext.SaveChangesAsync();
            return Ok(new CustomerDto
            {
                Id = customer.CustomerID,
                Name = customer.Name,
                Email = customer.Email,
                Phone = customer.Phone
            });
        }
    }
}