using Microsoft.AspNetCore.Authorization; //jwt auth
using Microsoft.AspNetCore.Mvc; //for my endpoints
using SWEEP.Models;
using SWEEP.Services; //AuthService, ClerkAuthService
using SWEEP.DTOs.RequestDTOs.Auth; //Updated DTOs

namespace SWEEP.Controllers
{
    [ApiController]
    [Route("api/[controller]")] //base route: /api/auth
    public class AuthController : ControllerBase
    {
        private readonly ClerkAuthService _clerkAuthService;
        private readonly AuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            ClerkAuthService clerkAuthService, //auth with clerk
            AuthService authService, //traditional auth
            ILogger<AuthController> logger) //info logger
        {
            //init services
            _clerkAuthService = clerkAuthService;
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")] // /api/auth/register
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
            //obj of type RegisterRequest, json -> c#
        {
            //validate RegisterRequest
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Registering user: {Email}, role: {Role}", request.Email, request.Role);

            //call reg method of authService, traditional auth.
            var user = await _authService.Register(request.Email, request.Password, request.Role);

            //user already existed
            if (user == null)
            {
                _logger.LogWarning("reg failed, user already exists: {Email}", request.Email);
                return BadRequest(new { message = "User already exists" });
            }

            //user created
            _logger.LogInformation("User registered successfully. UserId: {UserId}", user.UserId);

            //gen JWT and refresh token
            var jwtToken = _authService.GenerateJwtToken(user);
            _logger.LogInformation("JWT token generated for {UserId}", user.UserId);

            var refreshToken = await _authService.GenerateRefreshToken(user);
            _logger.LogInformation("Refresh token generated for user {UserId}: {TokenId}", user.UserId, refreshToken.TokenId);

            SetRefreshTokenCookie(refreshToken.Token);
            _logger.LogInformation("Refresh token cookie set for user {UserId}", user.UserId);

            bool hasCompletedProfile = false;
            if (user.Role == UserRole.Student && user.StudentProfile != null)
            {
                hasCompletedProfile = true;
                _logger.LogInformation("User {UserId} has a completed student profile", user.UserId);
            }
            else if (user.Role == UserRole.Employer && user.EmployerProfile != null)
            {
                hasCompletedProfile = true;
                _logger.LogInformation("User {UserId} has a completed employer profile", user.UserId);
            }
            else
            {
                _logger.LogInformation("User {UserId} needs to complete their profile", user.UserId);
            }

            return Ok(new
            {
                user.UserId,
                user.Email,
                user.Role,
                hasCompletedProfile,
                token = jwtToken,
                message = "Registration successful",
                requiresProfileSetup = !hasCompletedProfile
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            _logger.LogInformation("login for email: {Email}", request.Email);

            var user = await _authService.Login(request.Email, request.Password);

            if (user == null)
            {
                _logger.LogWarning("Login failed for email: {Email}", request.Email);
                return Unauthorized(new { message = "Invalid email or password" });
            }

            _logger.LogInformation("Login successful for user {UserId}, email: {Email}", user.UserId, user.Email);

            //gen JWT and Refresh token
            var jwtToken = _authService.GenerateJwtToken(user);
            _logger.LogInformation("JWT token for user {UserId}", user.UserId);

            var refreshToken = await _authService.GenerateRefreshToken(user);
            _logger.LogInformation("Refresh token for user {UserId}: {TokenId}", user.UserId, refreshToken.TokenId);

            SetRefreshTokenCookie(refreshToken.Token);
            _logger.LogInformation("Refresh token cookie set for user {UserId}", user.UserId);

            bool hasCompletedProfile = false;
            if (user.Role == UserRole.Student && user.StudentProfile != null)
            {
                hasCompletedProfile = true;
                _logger.LogInformation("User {UserId} has a completed student profile", user.UserId);
            }
            else if (user.Role == UserRole.Employer && user.EmployerProfile != null)
            {
                hasCompletedProfile = true;
                _logger.LogInformation("User {UserId} has a completed employer profile", user.UserId);
            }
            else
            {
                _logger.LogInformation("User {UserId} needs to complete their profile", user.UserId);
            }

            return Ok(new
            {
                user.UserId,
                user.Email,
                user.Role,
                hasCompletedProfile,
                token = jwtToken,
                message = "Login successful"
            });
        }

        [HttpPost("clerk")] // /api/auth/clerk
        public async Task<IActionResult> AuthenticateWithClerk([FromBody] ClerkAuthRequest request)
        {
            _logger.LogInformation("recv clerk auth request");

            //token from clerk
            if (string.IsNullOrEmpty(request.Token))
            {
                _logger.LogWarning("clerk auth fail - no token");
                return BadRequest(new { message = "Token required" });
            }

            _logger.LogInformation("clerk token provided, token length: {TokenLength}", request.Token.Length);

            try
            {
                _logger.LogInformation("Calling ClerkAuthService.ValidateClerkToken");
                var result = await _clerkAuthService.ValidateClerkToken(request.Token);

                if (result.User != null)
                {
                    // Existing user - proceed with normal login flow
                    _logger.LogInformation("Existing Clerk user found: {UserId}, email: {Email}",
                        result.User.UserId, result.User.Email);

                    var jwtToken = _authService.GenerateJwtToken(result.User);
                    var refreshToken = await _authService.GenerateRefreshToken(result.User);
                    SetRefreshTokenCookie(refreshToken.Token);

                    bool hasCompletedProfile = false;
                    if (result.User.Role == UserRole.Student && result.User.StudentProfile != null)
                    {
                        hasCompletedProfile = true;
                    }
                    else if (result.User.Role == UserRole.Employer && result.User.EmployerProfile != null)
                    {
                        hasCompletedProfile = true;
                    }

                    return Ok(new
                    {
                        result.User.UserId,
                        result.User.Email,
                        result.User.Role,
                        hasCompletedProfile,
                        isNewUser = false,
                        token = jwtToken,
                        message = "Successfully authenticated with Clerk",
                        requiresRoleSelection = false,
                        requiresProfileSetup = !hasCompletedProfile
                    });
                }
                else if (result.ClerkUserData != null)
                {
                    //new user, role selection before DB creation
                    _logger.LogInformation("New Clerk user detected, email: {Email}. Role selection required.",
                        result.ClerkUserData.Email);

                    return Ok(new
                    {
                        email = result.ClerkUserData.Email,
                        clerkId = result.ClerkUserData.ClerkId,
                        isNewUser = true,
                        message = "New user detected - role selection required",
                        requiresRoleSelection = true,
                        requiresProfileSetup = false
                    });
                }
                else
                {
                    _logger.LogWarning("Clerk authentication failed - invalid token or user data");
                    return Unauthorized(new { message = "Invalid token" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception during Clerk authentication process");
                return StatusCode(500, new { message = "An error occurred during authentication with Clerk" });
            }
        }

        [HttpPost("clerk/complete-registration")]
        public async Task<IActionResult> CompleteClerkRegistration([FromBody] CompleteClerkRegistrationRequest request)
        {
            _logger.LogInformation("recv clerk reg completion request for email: {Email}, role: {Role}",
                request.Email, request.Role);

            try
            {
                //validate clerk token
                var validationResult = await _clerkAuthService.ValidateClerkToken(request.ClerkToken);

                //compare fetched with request data
                if (validationResult.ClerkUserData == null ||
                    validationResult.ClerkUserData.Email != request.Email ||
                    validationResult.ClerkUserData.ClerkId != request.ClerkId)
                {
                    _logger.LogWarning("Invalid Clerk token or mismatched user data during registration completion");
                    return BadRequest(new { message = "Invalid or expired registration data" });
                }

                //check if user already exists
                var existingUser = await _authService.GetUserByEmail(request.Email);
                if (existingUser != null)
                {
                    _logger.LogWarning("User already exists: {Email}", request.Email);
                    return BadRequest(new { message = "User already exists" });
                }

                //create user in the database
                var user = await _authService.CreateClerkUser(request.Email, request.ClerkId, request.Role);
                if (user == null)
                {
                    _logger.LogError("Failed to create user during Clerk registration completion");
                    return StatusCode(500, new { message = "Failed to create user account" });
                }

                _logger.LogInformation("Successfully created Clerk user: {UserId}, email: {Email}, role: {Role}",
                    user.UserId, user.Email, user.Role);

                // Generate tokens for the new user
                var jwtToken = _authService.GenerateJwtToken(user);
                var refreshToken = await _authService.GenerateRefreshToken(user);
                SetRefreshTokenCookie(refreshToken.Token);

                return Ok(new
                {
                    user.UserId,
                    user.Email,
                    user.Role,
                    hasCompletedProfile = false, //new users always need to complete profile
                    isNewUser = true,
                    token = jwtToken,
                    message = "Registration completed successfully",
                    requiresRoleSelection = false,
                    requiresProfileSetup = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception during Clerk registration completion");
                return StatusCode(500, new { message = "An error occurred during registration completion" });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            _logger.LogInformation("Received token refresh request");

            //get refresh token from cookie
            if (!Request.Cookies.TryGetValue("refresh_token", out var refreshToken))
            {
                _logger.LogWarning("Token refresh failed, no refresh_token cookie");
                return BadRequest(new { message = "Refresh token is required" });
            }

            _logger.LogInformation("refresh_token cookie found, validating token");

            var (user, newRefreshToken) = await _authService.ValidateRefreshToken(refreshToken);

            if (user == null || newRefreshToken == null)
            {
                _logger.LogWarning("token refresh failed, invalid or expired refresh token");
                return Unauthorized(new { message = "Invalid or expired refresh token" });
            }

            _logger.LogInformation("Refresh token validated for user {UserId}", user.UserId);

            //generate new JWT token
            var jwtToken = _authService.GenerateJwtToken(user);
            _logger.LogInformation("New JWT token generated for user {UserId}", user.UserId);

            //set new refresh token cookie
            SetRefreshTokenCookie(newRefreshToken.Token);
            _logger.LogInformation("New refresh token cookie set for user {UserId}", user.UserId);

            bool hasCompletedProfile = false;
            if (user.Role == UserRole.Student && user.StudentProfile != null)
            {
                hasCompletedProfile = true;
            }
            else if (user.Role == UserRole.Employer && user.EmployerProfile != null)
            {
                hasCompletedProfile = true;
            }

            return Ok(new
            {
                user.UserId,
                user.Email,
                user.Role,
                hasCompletedProfile,
                token = jwtToken,
                message = "Token refreshed successfully"
            });
        }

        [Authorize]
        [HttpPost("set-role")]
        public async Task<IActionResult> SetUserRole([FromBody] SetRoleRequest request)
        {
            try
            {
                // Get user ID from the JWT token
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int userIdInt))
                {
                    _logger.LogWarning("Invalid user ID in token: {UserId}", userId);
                    return BadRequest(new { message = "Invalid user ID" });
                }

                _logger.LogInformation("Setting role {Role} for user {UserId}", request.Role, userIdInt);

                var success = await _authService.UpdateUserRole(userIdInt, request.Role);

                if (!success)
                {
                    _logger.LogWarning("Failed to update role for user {UserId}", userIdInt);
                    return BadRequest(new { message = "Failed to update user role" });
                }

                _logger.LogInformation("Successfully updated role to {Role} for user {UserId}", request.Role, userIdInt);
                return Ok(new { message = "User role updated successfully", role = request.Role });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user role");
                return StatusCode(500, new { message = "An error occurred while updating the role" });
            }
        }

        private void SetRefreshTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                SameSite = SameSiteMode.Strict, //cookie not sent with cross-site requests
                Secure = true //only over https
            };

            Response.Cookies.Append("refresh_token", token, cookieOptions);
        }
    }
}