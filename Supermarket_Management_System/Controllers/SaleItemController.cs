using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SuperMarketManagement.Core.Dtos;
using SuperMarketManagement.Models;
using SuperMarketManagement.Core;

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
        public async Task<IEnumerable<SaleItemDto>> GetSaleItems()
        {
            var saleItems = await _dataBaseContext.SaleItems.ToListAsync();
            List<SaleItemDto> saleItemDtos = new List<SaleItemDto>();
            foreach (var item in saleItems)
            {
                saleItemDtos.Add(new SaleItemDto
                {
                    Id = item.SaleItemID,
                    SaleId = item.SaleID,
                    ProductId = item.ProductID,
                    Quantity = item.Quantity,
                    Price = item.PriceAtSale
                });
            }
            return saleItemDtos;
        }

        [HttpPost]
        public async Task<IActionResult> AddSaleItem(SaleItemDto saleItemInfo)
        {
            var item = new SaleItem
            {
                SaleID = saleItemInfo.SaleId,
                ProductID = saleItemInfo.ProductId,
                Quantity = saleItemInfo.Quantity,
                PriceAtSale = saleItemInfo.Price
            };
            _dataBaseContext.SaleItems.Add(item);
            await _dataBaseContext.SaveChangesAsync();
            return Ok(new SaleItemDto
            {
                Id = item.SaleItemID,
                SaleId = item.SaleID,
                ProductId = item.ProductID,
                Quantity = item.Quantity,
                Price = item.PriceAtSale
            });
        }
    }
}