using RepositoryPatternAPI.Domain.Entities;

namespace RepositoryPatternAPI.Services
{
    public interface IAuthService
    {
        Task<UserCredentials> AddUserAsync(UserCredentials userdetails);

        Task<IEnumerable<UserCredentials>> GetAllUsersAsync();

        Task<string?> AuthenticateAsync(Login login);
    }
}
