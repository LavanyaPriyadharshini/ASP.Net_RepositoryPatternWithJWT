using RepositoryPatternAPI.Domain.Entities;

namespace RepositoryPatternAPI.Infrastructure.Repositories
{
    public interface IAuthRepository
    {

        // this method is used for posting the user to the usercredential table
        Task<UserCredentials> AddUserAsync(UserCredentials userdetails);

        Task<IEnumerable<UserCredentials>> GetAllUsersAsync();


      //  Task<IEnumerable<UserCredentials>> GetUserByUsernameAsync();



        // implement this method in the Auth repository
        //Task<bool> ValidateUserAsync(Login login);


        // use this logic for newer versions
        Task<UserCredentials?> GetUserByCredentialsAsync(Login login);

    }
}
