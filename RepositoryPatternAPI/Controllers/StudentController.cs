using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RepositoryPatternAPI.Domain.Entities;
using RepositoryPatternAPI.Services;

namespace RepositoryPatternAPI.Controllers
{

    // ----------------- THE CLEAR EXPLANATION OF THE FLOW OF THE PROGRAM AND FOLDER STRUCTURE IS MENTIONED CLEARLY IN THE WORD FILE
    // --------- KEEP BREAKPOINT IN THE CONTROLLER AND ALSO YOU CAN TEST

    // After creating the service layer, we have to write down the controller code
    //here the controller communicates with the service layer where the service layer communicates witht eh respoistories where the repositories
    //communicates with the database and fetches the result

    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        //INJECT THE SERVICE HERE, SO WHEN A API ENDPOINT IS CALLED , IT HITS THE METHOD IN THE STUDENTSERVICE.CS

        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }


        // ✅ GET: api/student
        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _studentService.GetAllStudentsAsync();
            return Ok(students);
        }

        [Authorize]
        [HttpPost("AddStudent")]
        public async Task<IActionResult> AddStudents([FromBody] Student stud)

        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createstudent = await _studentService.AddStudentAsync(stud);
                return Ok(createstudent);

            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

            [HttpPut("updateById")]
            public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student student)
            {
                if (id != student.Id)
                    return BadRequest("Student ID mismatch.");

                var updatedStudent = await _studentService.UpdateStudentAsync(student);
                if (updatedStudent == null)
                    return NotFound($"Student with ID {id} not found.");

                return Ok(updatedStudent);
            }
        


        // ✅ DELETE: api/student/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var deleted = await _studentService.DeleteStudentAsync(id);
            if (!deleted)
                return NotFound($"Student with ID {id} not found.");

            return Ok($"Student with ID {id} deleted successfully.");
        }


    }
    }
