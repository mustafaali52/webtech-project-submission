using BookCart.Models;
using System.Security.Claims;

namespace BookCart.Services
{
    public interface IJwtService
    {
        string GenerateToken(ApplicationUser user, IList<string> roles);
        ClaimsPrincipal? ValidateToken(string token);
    }
}
