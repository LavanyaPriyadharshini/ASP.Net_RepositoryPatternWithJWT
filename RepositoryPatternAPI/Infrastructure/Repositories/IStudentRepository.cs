using RepositoryPatternAPI.Domain.Entities;
namespace RepositoryPatternAPI.Infrastructure.Repositories
{

    //Task means asynchronous operation - refer the word document of why we use task
    //WHY USE IEnumerbales - represents a collection of items

    public interface IStudentRepository
    {
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        // this method will asynchronously fetch multiple students and return them as a collection once the db query finishes


        Task<Student?> GetStudentByIdAsync(int id);
        ///This method will asynchronously fetch one student (or null if not found).”
        
        Task<Student> AddStudentAsync(Student student);
        Task<Student?> UpdateStudentAsync(Student student);
        Task<bool> DeleteStudentAsync(int id);
    }
}


// --------------------------- IMPORTANT -----------------------

//This defines an interface — IStudentRepository — that lists the operations your “Student repository” must provide.
//It’s not actual working code — it’s a contract that promises:
//“Any class that implements me must provide these methods (with these exact signatures).”
//This is part of the Repository Pattern, which is a design approach used to separate the business logic from the data access logic.

//implement these interface methods in the studentrepository.cs


//this pattern alllows loose coupling - your controllers will not depend directly on EF Core or AppDbContext.
// Easier to maintain or extend — if you ever change the DB from sql to mongo, all code using EF neeed not be rewritten.

//here the interface defines what the class must do , now how it does it

// here the repo pattern Separates business logic from data access

//In C#, when you use Entity Framework (EF Core) to talk to the database,
//these operations(like fetching, saving, updating) are I/O bound — meaning they take time because they interact with external resources (the database).