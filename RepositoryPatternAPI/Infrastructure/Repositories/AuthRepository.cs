using Microsoft.EntityFrameworkCore;
using RepositoryPatternAPI.Domain.Entities;
using RepositoryPatternAPI.Infrastructure.Data;

namespace RepositoryPatternAPI.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {

        private readonly AppDbContext _context;

        public AuthRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<UserCredentials>> GetAllUsersAsync()
        {
            return await _context.UserCredentials_Tbl.ToListAsync();
        }



        // Simulating database validation
        public async Task<UserCredentials> AddUserAsync(UserCredentials userdetails)
        {
            //here it saves the record to the database
            _context.UserCredentials_Tbl.Add(userdetails);
            await _context.SaveChangesAsync();
            return userdetails;
        }



        public async Task<UserCredentials?> GetUserByCredentialsAsync(Login login)
        {
            // Hash the entered password to compare
            string hashedPassword = HashPassword(login.Password);

            return await _context.UserCredentials_Tbl
                .FirstOrDefaultAsync(u => u.Username == login.Username && u.Password == hashedPassword);
        }



        // Simulating database validation
        //public async Task<bool> ValidateUserAsync(Login login)
        //{
        //    // Hash the incoming password using the same method
        //    var hashedPassword = HashPassword(login.Password);

        //    var user = await _context.UserCredentials_Tbl
        //        .FirstOrDefaultAsync(u =>
        //            u.Username == login.Username &&
        //            u.Password == hashedPassword);

        //    return user != null;


        //    // Hardcoded user for demo
        //    //return login.Username == "admin" && login.Password == "123";
        //}



        // 🔐 Same hashing method used while saving user
        private string HashPassword(string password)
        {
            using (var sha = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(password);
                var hash = sha.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }




        // Get a user by username
        //public async Task<UserCredentials?> GetUserByUsernameAsync(string username)
        //{
        //    return await _context.UserCredentials_Tbl
        //        .FirstOrDefaultAsync(u => u.Username == username);
        //}


    }
}
