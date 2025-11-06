using RepositoryPatternAPI.Domain.Entities;
using RepositoryPatternAPI.Infrastructure.Repositories;

namespace RepositoryPatternAPI.Services
{
    //------------------------------ BUSINESS LOGIC ---------------------------

    // here the logic communicates with the repository, the repository interacts with the database

    //This means your repository stays clean for data access only.
// Your service focuses on rules and logic.

    //the next is the controller code, the controller communicates with this service layer
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository; // injecting the repository here , in repository we will be injecting the database so it communicates with the db
        // which then communicates with this service layer , here since we are using the repository here, if the db changes to mongo or postgery, it dosent affect this, we shall do the 
        //changes in the repository layer itself since we are calling the repository alone here  and not db


        // Constructor dependency injection
        public StudentService(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }


        // Get all students
        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            return await _studentRepository.GetAllStudentsAsync();
        }

        // Get student by ID
        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            return await _studentRepository.GetStudentByIdAsync(id);
        }


        // Add new student
        public async Task<Student> AddStudentAsync(Student student)
        {
            // 🧠 Example business rule: Calculate age automatically
            student.Age = DateTime.Now.Year - student.DateOfBirth.Year;

            // 🧠 Example validation: Check for duplicate Email ID
            var allStudents = await _studentRepository.GetAllStudentsAsync();
            if (allStudents.Any(s => s.EmailId == student.EmailId))
                throw new Exception("Email ID already exists!");

            //calling the repository here
            return await _studentRepository.AddStudentAsync(student);
        }


        // Update student
        public async Task<Student?> UpdateStudentAsync(Student student)
        {
            return await _studentRepository.UpdateStudentAsync(student);
        }



        // Delete student
        public async Task<bool> DeleteStudentAsync(int id)
        {
            return await _studentRepository.DeleteStudentAsync(id);
        }

    }
}
