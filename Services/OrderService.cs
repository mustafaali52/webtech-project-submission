using Microsoft.EntityFrameworkCore;
using BookCart.Data;
using BookCart.DTOs;
using BookCart.Models;

namespace BookCart.Services
{
    public class OrderService : IOrderService
    {
        private readonly BookCartDbContext _context;

        public OrderService(BookCartDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Calculate total amount and validate stock
                decimal totalAmount = 0;
                var orderItems = new List<OrderItem>();

                foreach (var item in createOrderDto.OrderItems)
                {
                    var book = await _context.Books.FindAsync(item.BookId);
                    if (book == null)
                        throw new ArgumentException($"Book with ID {item.BookId} not found");

                    if (book.StockQuantity < item.Quantity)
                        throw new InvalidOperationException($"Insufficient stock for book '{book.Title}'. Available: {book.StockQuantity}, Requested: {item.Quantity}");

                    // Reduce stock
                    book.StockQuantity -= item.Quantity;

                    var orderItem = new OrderItem
                    {
                        BookId = item.BookId,
                        Quantity = item.Quantity,
                        UnitPrice = book.Price
                    };

                    orderItems.Add(orderItem);
                    totalAmount += orderItem.Quantity * orderItem.UnitPrice;
                }

                // Create order
                var order = new Order
                {
                    UserId = int.Parse(createOrderDto.UserId), // Note: This needs to be updated for Identity
                    TotalAmount = totalAmount,
                    ShippingAddress = createOrderDto.ShippingAddress,
                    PaymentMethod = createOrderDto.PaymentMethod,
                    OrderItems = orderItems
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Clear user's cart after successful order
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .FirstOrDefaultAsync(c => c.UserId == int.Parse(createOrderDto.UserId));

                if (cart != null)
                {
                    _context.CartItems.RemoveRange(cart.CartItems);
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return await GetOrderByIdAsync(order.OrderId) ?? throw new InvalidOperationException("Failed to retrieve created order");
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null) return null;

            return new OrderDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId.ToString(),
                UserName = $"{order.User.FirstName} {order.User.LastName}",
                UserEmail = order.User.Email,
                TotalAmount = order.TotalAmount,
                OrderDate = order.OrderDate,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                ShippedDate = order.ShippedDate,
                DeliveredDate = order.DeliveredDate,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    OrderId = oi.OrderId,
                    BookId = oi.BookId,
                    BookTitle = oi.Book.Title,
                    BookAuthor = oi.Book.Author,
                    BookImageUrl = oi.Book.ImageUrl,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            };
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(string userId)
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .Where(o => o.UserId == int.Parse(userId))
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(order => new OrderDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId.ToString(),
                UserName = $"{order.User.FirstName} {order.User.LastName}",
                UserEmail = order.User.Email,
                TotalAmount = order.TotalAmount,
                OrderDate = order.OrderDate,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                ShippedDate = order.ShippedDate,
                DeliveredDate = order.DeliveredDate,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    OrderId = oi.OrderId,
                    BookId = oi.BookId,
                    BookTitle = oi.Book.Title,
                    BookAuthor = oi.Book.Author,
                    BookImageUrl = oi.Book.ImageUrl,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            });
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(order => new OrderDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId.ToString(),
                UserName = $"{order.User.FirstName} {order.User.LastName}",
                UserEmail = order.User.Email,
                TotalAmount = order.TotalAmount,
                OrderDate = order.OrderDate,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                ShippedDate = order.ShippedDate,
                DeliveredDate = order.DeliveredDate,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    OrderId = oi.OrderId,
                    BookId = oi.BookId,
                    BookTitle = oi.Book.Title,
                    BookAuthor = oi.Book.Author,
                    BookImageUrl = oi.Book.ImageUrl,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            });
        }

        public async Task<OrderDto?> UpdateOrderStatusAsync(int orderId, UpdateOrderStatusDto updateStatusDto)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return null;

            order.Status = updateStatusDto.Status;
            
            if (updateStatusDto.ShippedDate.HasValue)
                order.ShippedDate = updateStatusDto.ShippedDate;
                
            if (updateStatusDto.DeliveredDate.HasValue)
                order.DeliveredDate = updateStatusDto.DeliveredDate;

            await _context.SaveChangesAsync();
            return await GetOrderByIdAsync(orderId);
        }

        public async Task<bool> CancelOrderAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null || order.Status != "Pending") return false;

            // Restore stock
            foreach (var item in order.OrderItems)
            {
                item.Book.StockQuantity += item.Quantity;
            }

            order.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<OrderSummaryDto> GetOrderSummaryAsync()
        {
            var orders = await _context.Orders.ToListAsync();
            var recentOrders = await GetAllOrdersAsync();

            return new OrderSummaryDto
            {
                TotalOrders = orders.Count,
                TotalRevenue = orders.Where(o => o.Status != "Cancelled").Sum(o => o.TotalAmount),
                PendingOrders = orders.Count(o => o.Status == "Pending"),
                CompletedOrders = orders.Count(o => o.Status == "Delivered"),
                RecentOrders = recentOrders.Take(10).ToList()
            };
        }

        public async Task<IEnumerable<OrderDto>> GetOrdersByStatusAsync(string status)
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
                .Where(o => o.Status == status)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(order => new OrderDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId.ToString(),
                UserName = $"{order.User.FirstName} {order.User.LastName}",
                UserEmail = order.User.Email,
                TotalAmount = order.TotalAmount,
                OrderDate = order.OrderDate,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                ShippedDate = order.ShippedDate,
                DeliveredDate = order.DeliveredDate,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    OrderId = oi.OrderId,
                    BookId = oi.BookId,
                    BookTitle = oi.Book.Title,
                    BookAuthor = oi.Book.Author,
                    BookImageUrl = oi.Book.ImageUrl,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            });
        }
    }
}
