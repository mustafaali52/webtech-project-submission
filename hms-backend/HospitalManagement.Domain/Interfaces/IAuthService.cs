using HospitalManagement.Domain.Entities;
using HospitalManagement.Domain.DTOs;  // Updated namespace

namespace HospitalManagement.Domain.Interfaces
{
    public interface IAuthService
    {
        Task<TokenDto> LoginAsync(string username, string password);
        Task<TokenDto> RegisterAsync(string username, string password, string email, string role = "User");
        Task<User> GetUserByUsernameAsync(string username);
        Task<bool> ValidateUserCredentialsAsync(string username, string password);
    }
}