using Microsoft.IdentityModel.Tokens;
using System.Text;
using RepositoryPatternAPI.Domain.Entities;
using RepositoryPatternAPI.Infrastructure.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RepositoryPatternAPI.Services
{
    public class AuthService : IAuthService
    {

        //injecting the repository here
        private readonly IAuthRepository _authRepository;

        private readonly IConfiguration _config;

        public AuthService(IAuthRepository authRepository, IConfiguration config)
        {
            _authRepository = authRepository;
            _config = config;
        }



        // Get all students
        public async Task<IEnumerable<UserCredentials>> GetAllUsersAsync()
        {
            return await _authRepository.GetAllUsersAsync();
        }


        // post the user -add the user credentials with role in the usercredentials table
        public async Task<UserCredentials> AddUserAsync(UserCredentials userDetails)
        {
            // 1️⃣ Check for duplicate email or username before adding
            var allUsers = await _authRepository.GetAllUsersAsync();

            if (allUsers.Any(u => u.Email == userDetails.Email))
                throw new Exception("Email already exists!");

            if (allUsers.Any(u => u.Username == userDetails.Username))
                throw new Exception("Username already exists!");

            // 2️⃣ Hash the password before saving (recommended for security)
            userDetails.Password = HashPassword(userDetails.Password);

            // 3️⃣ Set default values
            userDetails.Date = DateTime.Now;
            userDetails.Role = string.IsNullOrEmpty(userDetails.Role) ? "User" : userDetails.Role;

            // 4️⃣ Save user to repository
            return await _authRepository.AddUserAsync(userDetails);
        }

        // password hashing while creating the user credentials
        private string HashPassword(string password)
        {
            using (var sha = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(password);
                var hash = sha.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }



        // Login logic is given herer
        public async Task<string?> AuthenticateAsync(Login login)
        {
            var user = await _authRepository.GetUserByCredentialsAsync(login);

            if (user == null)
                return null;

            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role)
    };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["DurationInMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    }
