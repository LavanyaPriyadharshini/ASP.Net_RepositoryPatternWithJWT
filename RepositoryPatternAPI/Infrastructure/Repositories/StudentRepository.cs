using Microsoft.EntityFrameworkCore;
using RepositoryPatternAPI.Domain.Entities;
using RepositoryPatternAPI.Infrastructure.Data;
namespace RepositoryPatternAPI.Infrastructure.Repositories
{

       // IstudentRepository + studentRepository = RepositoryLayer or service layer

        // here is the place where the business logic exists which serves as the bridge between the repository and the controller

    //next is to create the service layer which communicates with the repositories

    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _context;

        public StudentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            return await _context.Students.ToListAsync();
        }

        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            return await _context.Students.FindAsync(id);
        }

        public async Task<Student> AddStudentAsync(Student student)
        {
            //here it saves the record to the database
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return student;
        }

        public async Task<Student?> UpdateStudentAsync(Student student)
        {
            var existing = await _context.Students.FindAsync(student.Id);
            if (existing == null)
                return null;

            _context.Entry(existing).CurrentValues.SetValues(student);
            await _context.SaveChangesAsync();
            return student;
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return false;

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}