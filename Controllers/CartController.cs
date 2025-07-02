using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BookCart.Services;
using BookCart.DTOs;
using System.Security.Claims;

namespace BookCart.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet("my-cart")]
        public async Task<ActionResult<CartDto>> GetMyCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var cart = await _cartService.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return NotFound("Cart not found for this user");
            }
            return Ok(cart);
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CartDto>> GetUserCart(string userId)
        {
            var cart = await _cartService.GetCartByUserIdAsync(userId);
            if (cart == null)
            {
                return NotFound("Cart not found for this user");
            }
            return Ok(cart);
        }

        [HttpPost("add")]
        public async Task<ActionResult<CartDto>> AddToCart(AddToCartRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get current user from JWT
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
                return Unauthorized();

            // Create internal DTO with user ID
            var addToCartDto = new AddToCartDto
            {
                UserId = currentUserId,
                BookId = request.BookId,
                Quantity = request.Quantity
            };

            try
            {
                var cart = await _cartService.AddToCartAsync(addToCartDto);
                return Ok(cart);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("item/{cartItemId}")]
        public async Task<ActionResult<CartDto>> UpdateCartItem(int cartItemId, UpdateCartItemDto updateCartItemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cart = await _cartService.UpdateCartItemAsync(cartItemId, updateCartItemDto);
            if (cart == null)
            {
                return NotFound("Cart item not found");
            }

            return Ok(cart);
        }

        [HttpDelete("item/{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartItemId)
        {
            var result = await _cartService.RemoveFromCartAsync(cartItemId);
            if (!result)
            {
                return NotFound("Cart item not found");
            }

            return NoContent();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearMyCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var result = await _cartService.ClearCartAsync(userId);
            if (!result)
            {
                return NotFound("Cart not found for this user");
            }

            return NoContent();
        }
    }
}
