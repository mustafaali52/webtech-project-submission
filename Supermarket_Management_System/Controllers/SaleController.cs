using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core.Dtos;
using SuperMarketManagement.Models;
using SuperMarketManagement.Core;

namespace SuperMarketManagement.Controllers
{
    [ApiController]
    [Route("api/sales")]
    public class SaleController : Controller
    {
        private readonly DataBaseContext _dataBaseContext;
        public SaleController(DataBaseContext dataBaseContext)
        {
            _dataBaseContext = dataBaseContext;
        }

        [HttpGet]
        public async Task<IEnumerable<SaleDto>> GetSales()
        {
            var sales = await _dataBaseContext.Sales.ToListAsync();
            List<SaleDto> saleDtos = new List<SaleDto>();
            foreach (var sale in sales)
            {
                saleDtos.Add(new SaleDto
                {
                    Id = sale.SaleID,
                    CustomerId = sale.CustomerID,
                    EmployeeId = sale.EmployeeID,
                    SaleDate = sale.Date,
                    TotalAmount = sale.TotalAmount
                });
            }
            return saleDtos;
        }

        [HttpPost]
        public async Task<IActionResult> AddSale(SaleDto saleInfo)
        {
            var sale = new Sale
            {
                CustomerID = saleInfo.CustomerId,
                EmployeeID = saleInfo.EmployeeId,
                Date = saleInfo.SaleDate,
                TotalAmount = saleInfo.TotalAmount
            };
            _dataBaseContext.Sales.Add(sale);
            await _dataBaseContext.SaveChangesAsync();
            return Ok(new SaleDto
            {
                Id = sale.SaleID,
                CustomerId = sale.CustomerID,
                EmployeeId = sale.EmployeeID,
                SaleDate = sale.Date,
                TotalAmount = sale.TotalAmount
            });
        }
    }
}