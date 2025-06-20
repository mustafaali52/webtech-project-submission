using Microsoft.EntityFrameworkCore;
using SWEEP.Data;
using SWEEP.Models;
using SWEEP.DTOs.ServicesDTOs.ClerkService;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SWEEP.Services
{
    public class ClerkAuthService
    {
        private readonly SweepDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ClerkAuthService> _logger;
        private readonly HttpClient _httpClient;

        public ClerkAuthService(SweepDbContext context, IConfiguration configuration,
            ILogger<ClerkAuthService> logger, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient("ClerkAPI");
        }

        public async Task<ClerkValidationResult> ValidateClerkToken(string jwtToken)
        {
            try
            {
                _logger.LogInformation("validating clerk token");

                //decode the JWT token
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadJwtToken(jwtToken);

                //user id from token
                var clerkUserId = jsonToken.Claims.FirstOrDefault(x => x.Type == "sub")?.Value;
                _logger.LogInformation("clerk user ID: {UserId}", clerkUserId);

                if (string.IsNullOrEmpty(clerkUserId))
                {
                    _logger.LogWarning("No user ID found in JWT token");
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                // Get user details from Clerk API
                var secretKey = _configuration["Clerk:SecretKey"];

                if (string.IsNullOrEmpty(secretKey))
                {
                    _logger.LogError("clerk secret key not configured");
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                _logger.LogInformation("requesting clerk API for user: {UserId}", clerkUserId);

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", secretKey);

                //get req
                var userResponse = await _httpClient.GetAsync($"https://api.clerk.com/v1/users/{clerkUserId}");

                _logger.LogInformation("clerk API response status: {StatusCode}", userResponse.StatusCode);

                if (!userResponse.IsSuccessStatusCode)
                {
                    var errorContent = await userResponse.Content.ReadAsStringAsync();
                    _logger.LogWarning("failed to get user details: {StatusCode}, Content: {Content}",
                        userResponse.StatusCode, errorContent);
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                var responseContent = await userResponse.Content.ReadAsStringAsync();
                _logger.LogInformation("clerk API response content: {Content}", responseContent);

                //json to c#
                var userData = JsonSerializer.Deserialize<ClerkUser>(responseContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
                    PropertyNameCaseInsensitive = true
                });

                if (userData?.Id == null || userData?.EmailAddresses == null)
                {
                    _logger.LogWarning("Invalid user data from Clerk API");
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                //first email address object where the Id matches the PrimaryEmailAddressId of the user.
                var primaryEmail = userData.EmailAddresses
                    .FirstOrDefault(e => e.Id == userData.PrimaryEmailAddressId)?.EmailAddress;

                if (string.IsNullOrEmpty(primaryEmail))
                {
                    _logger.LogWarning("User has no primary email address");
                    return new ClerkValidationResult { User = null, ClerkUserData = null };
                }

                _logger.LogInformation("Processing user with email: {Email}", primaryEmail);

                //see if user already exists in our database
                var existingUser = await _context.Users
                    .Include(u => u.StudentProfile)
                    .Include(u => u.EmployerProfile)
                    .FirstOrDefaultAsync(u => u.ClerkId == userData.Id || u.Email == primaryEmail);

                if (existingUser != null)
                {
                    //existing user
                    if (string.IsNullOrEmpty(existingUser.ClerkId))
                    {
                        _logger.LogInformation("link user to Clerk ID");
                        existingUser.ClerkId = userData.Id;
                        await _context.SaveChangesAsync();
                    }

                    _logger.LogInformation("Returning existing user: {UserId}", existingUser.UserId);
                    return new ClerkValidationResult { User = existingUser, ClerkUserData = null };
                }
                else
                {
                    //new user, ret clerk data for role selection
                    _logger.LogInformation("New user detected - returning Clerk data for role selection");
                    var clerkUserData = new ClerkUserData
                    {
                        ClerkId = userData.Id,
                        Email = primaryEmail
                    };
                    return new ClerkValidationResult { User = null, ClerkUserData = clerkUserData };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating Clerk token");
                return new ClerkValidationResult { User = null, ClerkUserData = null };
            }
        }
    }
}
