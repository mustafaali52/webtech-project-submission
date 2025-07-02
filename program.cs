using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BookCart.Data;
using BookCart.Models;
using BookCart.Services;

var builder = WebApplication.CreateBuilder(args);

// Force Development environment for Swagger
builder.Environment.EnvironmentName = "Development";

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "BookCart API",
        Version = "v1",
        Description = "A comprehensive book shopping cart API with authentication"
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Add Entity Framework
builder.Services.AddDbContext<BookCartDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), 
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }));

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<BookCartDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

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
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IJwtService, JwtService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// app.UseHttpsRedirection(); // Temporarily disabled for development

// Enable Swagger in all environments
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "BookCart API V1");
    c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    c.DocumentTitle = "BookCart API Documentation";
});

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// Add a simple root endpoint for testing
app.MapGet("/health", () => "BookCart API is running! Swagger UI available at root /");
app.MapControllers();

// Seed roles and admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedRolesAndAdminUser(services);
    await SeedCategoriesAndBooks(services);
}

app.Run();

async Task SeedRolesAndAdminUser(IServiceProvider serviceProvider)
{
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    // Create roles
    string[] roleNames = { "Admin", "User" };
    foreach (var roleName in roleNames)
    {
        var roleExist = await roleManager.RoleExistsAsync(roleName);
        if (!roleExist)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }

    // Create admin user
    var adminEmail = "admin@bookcart.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);

    if (adminUser == null)
    {
        adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            FirstName = "Admin",
            LastName = "User",
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(adminUser, "Admin@123");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}

async Task SeedCategoriesAndBooks(IServiceProvider serviceProvider)
{
    var context = serviceProvider.GetRequiredService<BookCartDbContext>();
    var bookService = serviceProvider.GetRequiredService<IBookService>();

    // Check if categories already exist
    if (!context.Categories.Any())
    {
        var categories = new List<Category>
        {
            new Category { CategoryName = "Fiction", Description = "Fictional literature and novels" },
            new Category { CategoryName = "Non-Fiction", Description = "Non-fictional books and educational content" },
            new Category { CategoryName = "Science Fiction", Description = "Science fiction and fantasy books" },
            new Category { CategoryName = "Mystery & Thriller", Description = "Mystery, thriller, and suspense novels" },
            new Category { CategoryName = "Romance", Description = "Romance novels and love stories" },
            new Category { CategoryName = "Biography", Description = "Biographies and autobiographies" },
            new Category { CategoryName = "Self-Help", Description = "Self-help and personal development books" },
            new Category { CategoryName = "Technology", Description = "Technology and programming books" }
        };

        context.Categories.AddRange(categories);
        await context.SaveChangesAsync();
    }

    // Check if books already exist
    if (!context.Books.Any())
    {
        var categories = await context.Categories.ToListAsync();
        
        var books = new List<Book>
        {
            new Book
            {
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                Description = "A classic American novel about the Jazz Age and the American Dream.",
                Price = 12.99m,
                CategoryId = categories.First(c => c.CategoryName == "Fiction").CategoryId,
                StockQuantity = 25,
                ImageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            },
            new Book
            {
                Title = "To Kill a Mockingbird",
                Author = "Harper Lee",
                Description = "A powerful story about racial injustice and the loss of innocence.",
                Price = 14.99m,
                CategoryId = categories.First(c => c.CategoryName == "Fiction").CategoryId,
                StockQuantity = 30,
                ImageUrl = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            },
            new Book
            {
                Title = "1984",
                Author = "George Orwell",
                Description = "A dystopian novel about totalitarianism and surveillance society.",
                Price = 11.99m,
                CategoryId = categories.First(c => c.CategoryName == "Science Fiction").CategoryId,
                StockQuantity = 20,
                ImageUrl = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            },
            new Book
            {
                Title = "The Hobbit",
                Author = "J.R.R. Tolkien",
                Description = "A fantasy novel about Bilbo Baggins' journey with thirteen dwarves.",
                Price = 16.99m,
                CategoryId = categories.First(c => c.CategoryName == "Science Fiction").CategoryId,
                StockQuantity = 35,
                ImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            },
            new Book
            {
                Title = "Pride and Prejudice",
                Author = "Jane Austen",
                Description = "A classic romance novel about Elizabeth Bennet and Mr. Darcy.",
                Price = 13.99m,
                CategoryId = categories.First(c => c.CategoryName == "Romance").CategoryId,
                StockQuantity = 28,
                ImageUrl = "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            },
            new Book
            {
                Title = "The Da Vinci Code",
                Author = "Dan Brown",
                Description = "A mystery thriller about a murder in the Louvre Museum.",
                Price = 15.99m,
                CategoryId = categories.First(c => c.CategoryName == "Mystery & Thriller").CategoryId,
                StockQuantity = 22,
                ImageUrl = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            },
            new Book
            {
                Title = "Steve Jobs",
                Author = "Walter Isaacson",
                Description = "The biography of Apple's visionary co-founder Steve Jobs.",
                Price = 18.99m,
                CategoryId = categories.First(c => c.CategoryName == "Biography").CategoryId,
                StockQuantity = 15,
                ImageUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            },
            new Book
            {
                Title = "The 7 Habits of Highly Effective People",
                Author = "Stephen R. Covey",
                Description = "A self-help book about personal and professional effectiveness.",
                Price = 17.99m,
                CategoryId = categories.First(c => c.CategoryName == "Self-Help").CategoryId,
                StockQuantity = 40,
                ImageUrl = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            },
            new Book
            {
                Title = "Clean Code",
                Author = "Robert C. Martin",
                Description = "A guide to writing clean, maintainable code for software developers.",
                Price = 24.99m,
                CategoryId = categories.First(c => c.CategoryName == "Technology").CategoryId,
                StockQuantity = 18,
                ImageUrl = "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            },
            new Book
            {
                Title = "The Art of War",
                Author = "Sun Tzu",
                Description = "An ancient Chinese text on military strategy and tactics.",
                Price = 9.99m,
                CategoryId = categories.First(c => c.CategoryName == "Non-Fiction").CategoryId,
                StockQuantity = 32,
                ImageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            }
        };

        context.Books.AddRange(books);
        await context.SaveChangesAsync();
    }
}