using BookCart.DTOs;

namespace BookCart.Services
{
    public interface ICartService
    {
        Task<CartDto?> GetCartByUserIdAsync(string userId);
        Task<CartDto> AddToCartAsync(AddToCartDto addToCartDto);
        Task<CartDto?> UpdateCartItemAsync(int cartItemId, UpdateCartItemDto updateCartItemDto);
        Task<bool> RemoveFromCartAsync(int cartItemId);
        Task<bool> ClearCartAsync(string userId);
    }
}
