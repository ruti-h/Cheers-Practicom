using Cheers.Api.Models;
using Cheers.Core.DTOs;
using Cheers.Core.IServices;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Cheers.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IServiceUser _userService;

        public UserController(IServiceUser userService)
        {
            _userService = userService;
        }

       
    }
}
