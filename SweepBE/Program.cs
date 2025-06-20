using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using SWEEP.Data;
using SWEEP.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

//prod - render
if (!builder.Environment.IsDevelopment())
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

//Clerk config
var clerkPublicKey = builder.Configuration["Clerk:PublicKey"];
var clerkSecretKey = builder.Configuration["Clerk:SecretKey"];
if (string.IsNullOrEmpty(clerkPublicKey) || string.IsNullOrEmpty(clerkSecretKey))
{
    throw new Exception("Clerk API keys are not configured properly.");
}

//JWT configuration
var jwtKey = builder.Configuration["JWT:Secret"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("JWT Secret key is not configured properly.");
}

//JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddDbContext<SweepDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
));

//HttpClient for Clerk API calls
builder.Services.AddHttpClient("ClerkAPI");

//authentication services
builder.Services.AddScoped<ClerkAuthService>();
builder.Services.AddScoped<AuthService>();

//task service
builder.Services.AddScoped<TaskService>();

//cloudinary service
builder.Services.AddScoped<CloudinaryService>();

//file upload config
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 50 * 1024 * 1024; // 50 MB
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 50 * 1024 * 1024; // 50 MB
});

//cors for frontend integration - Updated for production flexibility
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        //localhost for dev
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

//services 
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//remove HTTPS redirection for Render
if (!app.Environment.IsDevelopment())
{
    // app.UseHttpsRedirection(); //disabled
}
else
{
    //keep HTTPS redirect for development
    app.UseHttpsRedirection();
}

// Enable CORS
app.UseCors();

//auth middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();