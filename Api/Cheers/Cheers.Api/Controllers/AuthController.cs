using AutoMapper;
using Cheers.Api.Models;
using Cheers.Core.DTOs;
using Cheers.Core.IRepository;
using Cheers.Core.IServices;
using Cheers.Service.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
        {
            try
            {
                // בדיקת תקינות המודל
                if (model == null)
                {
                    return BadRequest(new { message = "נתוני המשתמש לא תקינים" });
                }

                // בדיקת שדות חובה
                if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.PasswordHash))
                {
                    return BadRequest(new { message = "אימייל וסיסמה הם שדות חובה" });
                }

                Console.WriteLine($"Attempting to register user: {JsonSerializer.Serialize(model)}");

                // המרה ל-DTO
                var modelD = _mapper.Map<UserDTOs>(model);

                // נסיון ליצירת המשתמש - הבדיקות נעשות בשירות
                var newUser = await _userService.AddUserAsync(modelD);

                Console.WriteLine($"User created successfully: {newUser.Id}");

                // בדיקת קיומות התפקיד
                int roleId = await _roleRpository.GetIdByRoleAsync(model.RoleName);
                if (roleId == -1)
                {
                    return BadRequest(new { message = "התפקיד לא נמצא במערכת" });
                }

                // הוספת תפקיד למשתמש
                var userRole = await _userRoleService.AddAsync(model.RoleName, newUser.Id);
                if (userRole == null)
                {
                    return BadRequest(new { message = "שגיאה בהקצאת תפקיד למשתמש" });
                }

                // יצירת טוקן
                var token = _authService.GenerateJwtToken(model.Email, new[] { model.RoleName });

                return Ok(new
                {
                    message = "המשתמש נרשם בהצלחה",
                    token = token,
                    user = newUser
                });
            }
            catch (InvalidOperationException ex)
            {
                // שגיאות עסקיות (כמו כפילות אימייל/ת.ז)
                Console.WriteLine($"Business Error during registration: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                // שגיאות פרמטרים
                Console.WriteLine($"Parameter Error during registration: {ex.Message}");
                return BadRequest(new { message = "נתונים לא תקינים: " + ex.Message });
            }
            catch (Exception ex)
            {
                // שגיאות כלליות
                Console.WriteLine($"General Error during registration: {ex.Message}");
                return StatusCode(500, new { message = "שגיאה בשרת במהלך ההרשמה", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
        {
            Console.WriteLine($"Received login request:");
            Console.WriteLine($"Email: '{model?.Email}'");
            Console.WriteLine($"Password length: {model?.Password?.Length}");

            if (!ModelState.IsValid)
            {
                Console.WriteLine("Model validation failed:");
                foreach (var error in ModelState)
                {
                    Console.WriteLine($"Key: {error.Key}, Errors: {string.Join(", ", error.Value.Errors.Select(e => e.ErrorMessage))}");
                }
                return BadRequest(ModelState);
            }
            try
            {
                if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                {
                    return BadRequest(new { message = "אימייל וסיסמה נדרשים" });
                }

                // אימות המשתמש
                var roleName = await _userService.AuthenticateAsync(model.Email, model.Password);

                if (string.IsNullOrEmpty(roleName))
                {
                    return Unauthorized(new { message = "אימייל או סיסמה שגויים" });
                }

                // יצירת טוקן
                var token = _authService.GenerateJwtToken(model.Email, new[] { roleName });

                // קבלת פרטי המשתמש
                var user = await _userService.GetUserByEmailAsync(model.Email);

                return Ok(new
                {
                    message = "התחברות בוצעה בהצלחה",
                    token = token,
                    user = user
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during login: {ex.Message}");
                return StatusCode(500, new { message = "שגיאה בשרת במהלך ההתחברות" });
            }
        }
    }
}