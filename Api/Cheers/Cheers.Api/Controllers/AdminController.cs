using Cheers.Core.DTOs;
using Cheers.Core.Entities;
using Cheers.Core.IServices;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Cheers.Api.Controllers
{
    //[Authorize(Roles = "Admin")] // 👑 רק המנהל יכול לגשת לפה!
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IAuthService _authService;

        public AdminController(IConfiguration config, IAuthService authService)
        {
            _config = config;
            _authService = authService;
        }
   
    }
}
