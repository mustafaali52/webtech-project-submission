using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.Hosting;
// using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using QUIZGAME;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Builder;
// using QUIZGAME.Models;


// var host = Host.CreateDefaultBuilder(args)
//     .ConfigureServices((context, services) =>
//     {
//         // TODO: Later move this connection string to environment variables or config file
//         var connectionString = "server=localhost;port=3306;database=webtech_quizgame;user=root;password=;";

//         services.AddDbContext<MyDataContext>(options =>
//                 options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
//     })
//     .Build();

// using var scope = host.Services.CreateScope();
// var db = host.Services.GetRequiredService<MyDataContext>();

// static void FetchUsers(MyDataContext db)
// {
//     var users = db.Users.ToList(); 

//     foreach (var user in users)
//     {
//         Console.WriteLine($"ID: {user.Id}");
//         Console.WriteLine($"Username: {user.Username}");
//         Console.WriteLine($"Email: {user.Email}");
//         Console.WriteLine(new string('-', 30));
//     }
// }
// FetchUsers(db);

var builder = WebApplication.CreateBuilder(args);

// var connectionString = "server=localhost;port=3306;database=webtech_quizgame;user=root;password=;";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<MyDataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var tokenKey = builder.Configuration["TokenKey"] ?? "SuperSecretKeyIsThis";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    });


builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("TeacherOnly", policy => policy.RequireRole("Teacher"));
    options.AddPolicy("StudentOnly", policy => policy.RequireRole("Student"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowAllOrigins");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers(); // Maps routes like [Route("api/[controller]")]

app.Run();
