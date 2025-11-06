using Microsoft.EntityFrameworkCore;
using RepositoryPatternAPI.Infrastructure.Data;
using RepositoryPatternAPI.Infrastructure.Repositories;
using RepositoryPatternAPI.Services;

//using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("RepoConnection")));


//  ------------------------------  JWT WEB TOKEN AUTHENTICATION AND AUTHORIZATION -------------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // ✅ Add JWT Auth to Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token in the text input.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\""
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
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


// ✅ Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});



builder.Services.AddAuthorization();




// ------IMPORTANT -------
//HERE IF YOU GET ERROR WHILE INJECTING THE INTERFACE HERE , THEN YOU CAN MENTION THE TYPEOF LIKE THIS
//Here, you’re telling the compiler exactly which namespace and project each class belongs to —
//so it doesn’t need to look them up via a using statement.

// Use fully qualified names
builder.Services.AddScoped(
    typeof(RepositoryPatternAPI.Infrastructure.Repositories.IStudentRepository),
    typeof(RepositoryPatternAPI.Infrastructure.Repositories.StudentRepository)
);

builder.Services.AddScoped<IStudentService, StudentService>();


// ------------------- REGISTER CREATED JWT SERVICES AND REPOSITORY HERE ---------------------------------------------------------------

builder.Services.AddScoped<IAuthRepository, AuthRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseAuthentication(); // 👈 Add this before Authorization

app.UseAuthorization();


app.MapControllers();

app.Run();