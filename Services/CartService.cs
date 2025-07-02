using Microsoft.EntityFrameworkCore;
using BookCart.Data;
using BookCart.DTOs;
using BookCart.Models;

namespace BookCart.Services
{
    public class CartService : ICartService
    {
        private readonly BookCartDbContext _context;

        public CartService(BookCartDbContext context)
        {
            _context = context;
        }

        public async Task<CartDto?> GetCartByUserIdAsync(string userId)
        {
            var cart = await _context.ApplicationUserCarts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Book)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return null;

            return new CartDto
            {
                CartId = cart.CartId,
                UserId = cart.UserId,
                CreatedDate = cart.CreatedDate,
                LastModified = cart.LastModified,
                CartItems = cart.CartItems.Select(ci => new CartItemDto
                {
                    CartItemId = ci.CartItemId,
                    CartId = ci.CartId,
                    BookId = ci.BookId,
                    BookTitle = ci.Book.Title,
                    BookAuthor = ci.Book.Author,
                    BookImageUrl = ci.Book.ImageUrl,
                    Quantity = ci.Quantity,
                    UnitPrice = ci.UnitPrice,
                    TotalPrice = ci.TotalPrice,
                    AddedDate = ci.AddedDate
                }).ToList()
            };
        }

        public async Task<CartDto> AddToCartAsync(AddToCartDto addToCartDto)
        {
            // Get or create cart for user
            var cart = await _context.ApplicationUserCarts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == addToCartDto.UserId);

            if (cart == null)
            {
                cart = new ApplicationUserCart
                {
                    UserId = addToCartDto.UserId
                };
                _context.ApplicationUserCarts.Add(cart);
                await _context.SaveChangesAsync();
            }

            // Get book details
            var book = await _context.Books.FindAsync(addToCartDto.BookId);
            if (book == null)
                throw new ArgumentException("Book not found");

            // Check if item already exists in cart
            var existingItem = cart.CartItems.FirstOrDefault(ci => ci.BookId == addToCartDto.BookId);

            if (existingItem != null)
            {
                existingItem.Quantity += addToCartDto.Quantity;
                cart.LastModified = DateTime.UtcNow;
            }
            else
            {
                var cartItem = new ApplicationUserCartItem
                {
                    CartId = cart.CartId,
                    BookId = addToCartDto.BookId,
                    Quantity = addToCartDto.Quantity,
                    UnitPrice = book.Price
                };
                _context.ApplicationUserCartItems.Add(cartItem);
                cart.LastModified = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return await GetCartByUserIdAsync(addToCartDto.UserId) ?? throw new InvalidOperationException("Failed to retrieve cart");
        }

        public async Task<CartDto?> UpdateCartItemAsync(int cartItemId, UpdateCartItemDto updateCartItemDto)
        {
            var cartItem = await _context.ApplicationUserCartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId);

            if (cartItem == null) return null;

            cartItem.Quantity = updateCartItemDto.Quantity;
            cartItem.Cart.LastModified = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return await GetCartByUserIdAsync(cartItem.Cart.UserId);
        }

        public async Task<bool> RemoveFromCartAsync(int cartItemId)
        {
            var cartItem = await _context.ApplicationUserCartItems
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId);

            if (cartItem == null) return false;

            cartItem.Cart.LastModified = DateTime.UtcNow;
            _context.ApplicationUserCartItems.Remove(cartItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(string userId)
        {
            var cart = await _context.ApplicationUserCarts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null) return false;

            _context.ApplicationUserCartItems.RemoveRange(cart.CartItems);
            cart.LastModified = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
