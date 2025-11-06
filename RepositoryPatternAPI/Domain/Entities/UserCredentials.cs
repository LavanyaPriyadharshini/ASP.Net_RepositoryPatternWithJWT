using System.ComponentModel.DataAnnotations;

namespace RepositoryPatternAPI.Domain.Entities
{
    public class UserCredentials
    {
        [Key]
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // (hashed later)
        public string Role { get; set; } = "";      // default role;
        public string Email { get; set; } = string.Empty;

        public long ContactNumber { get; set; } 
        public DateTime Date { get; set; }
    }
}
