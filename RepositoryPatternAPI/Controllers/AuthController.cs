using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RepositoryPatternAPI.Domain.Entities;
using RepositoryPatternAPI.Services;

namespace RepositoryPatternAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // inject the service here

        // refer the word notes about jwt 

        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var students = await _authService.GetAllUsersAsync();
            return Ok(students);
        }



        //[Authorize]
        // the roles with Admin will not have Access to this controller
        [Authorize(Roles = "Admin")]
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddStudents([FromBody] UserCredentials stud)

        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createuser = await _authService.AddUserAsync(stud);
                return Ok(createuser);

            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }



        [AllowAnonymous]
        //the entire login logic is given in the Authservice.cs
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            var token = await _authService.AuthenticateAsync(login);
            if (token == null)
                return Unauthorized("Invalid username or password");

            return Ok(new { Token = token });
        }

    }
}
