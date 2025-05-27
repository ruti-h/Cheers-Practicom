using Cheers.Core.DTOs;
using Cheers.Core.Entities;
using Cheers.Core.IServices;
using Cheers.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Service.Services
{
    public class AuthService :IAuthService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(DataContext context, IConfiguration config)
        {
            _context = context;
            _configuration = config;
        }

        //public async Task<BaseUser> AuthenticateUser(LoginDTO loginDto)
        //{
        //    //// 🔥 בדיקה אם המשתמש הוא המנהל עם פרטים קבועים
        //    //if (loginDto.Username == "etti0475@gmail.com" && loginDto.Password == "Admin123!")
        //    //{
        //    //    return new BaseUser
        //    //    {
        //    //        Id = 999, // מספר מזהה קבוע למנהל
        //    //        Username = "etti0475@gmail.com",
        //    //        Password = "Admin123!",
        //    //        Role = "Admin"
        //    //    };
        //    //}

        //    // חיפוש משתמש רגיל במסד הנתונים
        //    return await _context.Users
        //        .FirstOrDefaultAsync(u => u.Username == loginDto.Username && u.Password == loginDto.Password);
        //}
        //public async Task<User> AuthenticateUser(LoginDTOs loginDto)
        //{
        //    return await _context.Users
        //        .FirstOrDefaultAsync(u => u.FirstName == loginDto.Username && u.Password == loginDto.Password);
        //}

        //public async Task<Candidate> RegisterUser(RegisterDTOs registerDto)
        //{
        //    //todo
        //    // 🔍 בדיקה אם המשתמש כבר קיים
        //    //var existingUser = await _context.Users
        //    //    .FirstOrDefaultAsync(u => u.Username == registerDto.Username);

        //    //if (existingUser != null)
        //    //{
        //    //    throw new InvalidOperationException("⚠ המשתמש כבר קיים במערכת!");
        //    //}

        //    Candidate user;

        //    // 📌 יצירת מופע מתאים לפי התפקיד
        //    switch (registerDto.Role.ToLower())
        //    {
        //        case "matchmaker":
        //            user = new MatchMaker
        //            {
        //                FirstName = registerDto.FirstName,
        //                LastName = registerDto.LastName,
                   
        //                Role = "MatchMaker",
        //                //NumberOfClients = 0  // נניח שמתחיל עם 0 לקוחות
        //            };
        //            break;

        //        case "Candidate":
        //            user = new Candidate
        //            {
        //                FirstName = registerDto.FirstName,
        //                LastName = registerDto.LastName,
                     
        //                Role = "Candidate"
        //            };
        //            break;

        //        case "Candidate":
        //            user = new Candidate
        //            {
        //                FirstName = registerDto.FirstName,
        //                LastName = registerDto.LastName,
                      
        //                Role = "Women"
        //            };
        //            break;

        //        default:
        //            throw new ArgumentException("⚠ סוג משתמש לא תקין!");
        //    }

        //    _context.Users.Add(user);
        //    await _context.SaveChangesAsync();

        //    return user;
        //}

        //public string GenerateToken(Candidate user)
        //{

        //    var keyString = _config["Jwt:Key"];
        //    if (keyString != null)
        //    {
        //        Console.WriteLine($"🔑 Key used to generate token: {keyString}");
        //    }
        //    else
        //    {
        //        Console.WriteLine("token is null");
        //    }



        //    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        //    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //    var claims = new[]
        //    {
        //        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        //       // new Claim(ClaimTypes.Name, user.Username),
        //        new Claim(ClaimTypes.Role, user.Role)
        //    };

        //    var token = new JwtSecurityToken(
        //        _config["Jwt:Issuer"],
        //        _config["Jwt:Audience"],
        //        claims,
        //        expires: DateTime.Now.AddHours(3),
        //        signingCredentials: credentials
        //    );

        //    return new JwtSecurityTokenHandler().WriteToken(token);
        //}
        //public async Task<Candidate> GetUserById(int id)
        //{
        //    return await _context.Users.FindAsync(id);
        //}

        //public async Task DeleteUser(int id)
        //{
        //    var user = await _context.Users.FindAsync(id);
        //    if (user == null) throw new InvalidOperationException("❌ משתמש לא נמצא!");

        //    _context.Users.Remove(user);
        //    await _context.SaveChangesAsync();
        //}



        public string GenerateJwtToken(string username, string[] roles)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, username)
        };

            // הוספת תפקידים כ-Claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
