using System.ComponentModel.DataAnnotations;

namespace RepositoryPatternAPI.Domain.Entities
{
    ///Think of it as a blueprint for the Student table that EF Core will create in the database later.
    public class Student
    {
        [Key]
        public int Id { get; set; }                    // Primary Key
        public string StudentName { get; set; } = "";  // Unique student name
        public DateTime DateOfBirth { get; set; }      // Student's date of birth
        public int Age { get; set; }                   // Calculated or entered age
        public string MaritalStatus { get; set; } = "";
        public string Gender { get; set; } = "";
        public double Percentage { get; set; }
        public string Address { get; set; } = "";
        public string EmailId { get; set; } = "";
        public string ContactNo { get; set; } = "";
    }
}
