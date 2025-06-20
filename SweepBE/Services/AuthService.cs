using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SWEEP.Data;
using SWEEP.Models;

namespace SWEEP.Services
{
    public class AuthService
    {
        private readonly SweepDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(SweepDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<User?> Register(string email, string password, UserRole role)
            //return user obj
        {
            //see if user already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
            {
                return null;
            }

            //if new:
            CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

            //create new user
            var user = new User
            {
                Email = email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                Role = role
            };

            _context.Users.Add(user); //dbcontext.UserTable.Add
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<User?> Login(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.StudentProfile)
                .Include(u => u.EmployerProfile)
                .FirstOrDefaultAsync(u => u.Email == email);
                
            if (user == null || user.PasswordHash == null || user.PasswordSalt == null)
            {
                return null;
            }

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }

            return user;
        }

        public async Task<RefreshToken> GenerateRefreshToken(User user)
        {
            var refreshToken = new RefreshToken
            {
                //64 byte random string
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                UserId = user.UserId
            };

            //remove old tokens for this user
            var oldTokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == user.UserId)
                .ToListAsync();

            //remove range: del multiple records in one go
            _context.RefreshTokens.RemoveRange(oldTokens);

            //store token
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return refreshToken;
        }

        public async Task<(User? User, RefreshToken? NewRefreshToken)> ValidateRefreshToken(string token)
        {
            var refreshToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .ThenInclude(u => u.StudentProfile)
                .Include(rt => rt.User)
                .ThenInclude(u => u.EmployerProfile)
                .FirstOrDefaultAsync(rt => rt.Token == token);

            if (refreshToken == null || refreshToken.User == null)
            {
                return (null, null);
            }

            // Check if token is expired
            if (refreshToken.ExpiresAt < DateTime.UtcNow)
            {
                // Remove expired token
                _context.RefreshTokens.Remove(refreshToken);
                await _context.SaveChangesAsync();
                return (null, null);
            }

            // Generate new refresh token
            var newRefreshToken = await GenerateRefreshToken(refreshToken.User);

            return (refreshToken.User, newRefreshToken);
        }

        public async Task<bool> UpdateUserRole(int userId, UserRole role)
        {
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null)
            {
                return false;
            }
            
            user.Role = role;
            user.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            //secret key in appsettings.json
            var key = Encoding.ASCII.GetBytes(_configuration["JWT:Secret"] ?? 
                throw new InvalidOperationException("JWT:Secret not configured"));

            //securityTokenDescriptor: desc properties of token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                //claimsIdentity: represent user identity with claims
                //create array of claims
                Subject = new ClaimsIdentity(new[]
                {
                    //claims considered: id, email, role
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),

                Expires = DateTime.UtcNow.AddHours(1), //token expiry

                //signing token to avoid tamper, HMAC-SHA256 algorithm
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            //str conversion
            return tokenHandler.WriteToken(token);
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != storedHash[i])
                {
                    return false;
                }
            }
            
            return true;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users
                .Include(u => u.StudentProfile)
                .Include(u => u.EmployerProfile)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> CreateClerkUser(string email, string clerkId, UserRole role)
        {
            try
            {
                var user = new User
                {
                    Email = email,
                    ClerkId = clerkId,
                    Role = role
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                // Log the exception if you have logging configured
                // _logger.LogError(ex, "Error creating Clerk user");
                return null;
            }
        }
    }
}