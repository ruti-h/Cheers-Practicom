using AutoMapper;
using Cheers.Api.Models;
using Cheers.Core.DTOs;
using Cheers.Core.IRepository;
using Cheers.Core.IServices;
using Cheers.Service.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Cheers.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
          private readonly IAuthService _authService;
        private readonly IServiceUser _userService;
        private readonly IMapper _mapper;
        private readonly IUserRoleService _userRoleService;
        private readonly IRoleRepository _roleRpository;
        public AuthController(IAuthService authService, IServiceUser userService, IMapper mapper, IUserRoleService userRoleService, IRoleRepository roleRpository)
        {
            _authService = authService;
            _userService = userService;
            _mapper = mapper;
            _userRoleService = userRoleService;
            _roleRpository = roleRpository;
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
        {
            var roleName = await _userService.AuthenticateAsync(model.Email, model.Password);
            var user = await _userService.GetUserByEmailAsync(model.Email);
            if (roleName == "Admin")
            {
                var token = _authService.GenerateJwtToken(model.Email, new[] { "Admin" });
                return Ok(new { Token = token, User = user });
            }

            else if (roleName == "Shadchan")
            {
                var token = _authService.GenerateJwtToken(model.Email, new[] { "Shadchan" });
                return Ok(new { Token = token, User = user });
            }

            else if (roleName == "Candidate")
            {
                var token = _authService.GenerateJwtToken(model.Email, new[] { "Candidate" });
                return Ok(new { Token = token, User = user });
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
        {
            if (model == null)
            {
                return Conflict("User is not valid");
            }

            var modelD = _mapper.Map<UserDTOs>(model);
            var existingUser = await _userService.AddUserAsync(modelD);
            if (existingUser == null)
                return BadRequest("User could not be created.");

            // Check if the role exists
            int roleId = await _roleRpository.GetIdByRoleAsync(model.RoleName);
            if (roleId == -1)
            {
                return BadRequest("Role not found.");
            }

            var userRole = await _userRoleService.AddAsync(model.RoleName, existingUser.Id);
            if (userRole == null)
                return BadRequest("Error assigning role to user.");
            //existingUser.Role = model.RoleName;
            var token = _authService.GenerateJwtToken(model.Email, new[] { model.RoleName });
            return Ok(new { Token = token, User = existingUser });
        }


    }
}
