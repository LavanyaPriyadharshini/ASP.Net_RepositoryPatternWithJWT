using RepositoryPatternAPI.Domain.Entities;

namespace RepositoryPatternAPI.Services
{
    //refer notes in the word documnet , page 12,13,14

    ///This defines what operations the service must provide.
    ///It is similar to your repository interface, but here you can add business-level methods later.
    ///The controller will use this interface — not the concrete class — for loose coupling.
   
    public interface IStudentService
    {
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        Task<Student?> GetStudentByIdAsync(int id);
        Task<Student> AddStudentAsync(Student student);
        Task<Student?> UpdateStudentAsync(Student student);
        Task<bool> DeleteStudentAsync(int id);
    }
}
