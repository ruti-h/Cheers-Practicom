using AutoMapper;
using Cheers.Api.Models;
using Cheers.Core.DTOs;
using Cheers.Core.IServices;
using Cheers.Service.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Cheers.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IServiceUser _userService;
        private readonly IMapper _mapper;


        public UserController(IServiceUser userService,IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CandidateDTOs>>> GetWomen()
        {
            var women = await _userService.GetAllUsersAsync();
            return Ok(women);
        }
        [HttpPost]
        public async Task<ActionResult<UserDTOs>> CreateUser([FromBody] UserDTOs userData)
        {
            try
            {
                Console.WriteLine($"Received data: {JsonSerializer.Serialize(userData)}");
                var createdUser = await _userService.AddUserAsync(userData);
                var userDto = _mapper.Map<UserDTOs>(createdUser);
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDTOs>> DeleteCandidate(int id)
        {
            var deletedCandidate = await _userService.DeleteUserAsync(id);
            //if (deletedCandidate == null) return NotFound();

            var deletedCandidateDto = _mapper.Map<UserDTOs>(deletedCandidate); // מיפוי חזרה ל-CandidateDTOs
            return Ok(deletedCandidateDto);
        }

    }
}
