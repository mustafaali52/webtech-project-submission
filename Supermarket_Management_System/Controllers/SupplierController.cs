using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core.Dtos;
using SuperMarketManagement.Models;
using SuperMarketManagement.Core;

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
        public async Task<IEnumerable<SupplierDto>> GetSuppliers()
        {
            var suppliers = await _dataBaseContext.Suppliers.ToListAsync();
            List<SupplierDto> supplierDtos = new List<SupplierDto>();
            foreach (var supplier in suppliers)
            {
                supplierDtos.Add(new SupplierDto
                {
                    Id = supplier.SupplierID,
                    Name = supplier.Name,
                    ContactInfo = supplier.ContactInfo
                });
            }
            return supplierDtos;
        }

        [HttpPost]
        public async Task<IActionResult> AddSupplier(SupplierDto supplierInfo)
        {
            var supplier = new Supplier
            {
                Name = supplierInfo.Name,
                ContactInfo = supplierInfo.ContactInfo
            };
            _dataBaseContext.Suppliers.Add(supplier);
            await _dataBaseContext.SaveChangesAsync();
            return Ok(new SupplierDto
            {
                Id = supplier.SupplierID,
                Name = supplier.Name,
                ContactInfo = supplier.ContactInfo
            });
        }
    }
}