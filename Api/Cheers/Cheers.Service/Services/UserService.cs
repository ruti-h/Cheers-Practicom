using AutoMapper;
using Cheers.Core.DTOs;
using Cheers.Core.Entities;
using Cheers.Core.IRepository;
using Cheers.Core.IServices;
using Cheers.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using BCryptNet = BCrypt.Net.BCrypt; // Alias לפתרון התנגשות השמות
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cheers.Service.Services
{
    public class UserService : IServiceUser
    {
        private readonly IRepositoryUser _userRepository;
        private readonly IUserRoleRepository _userrolerepository;
        private readonly IRoleRepository _rolerepository;
        private readonly IMapper _mapper;

        public UserService(IRepositoryUser userRepository, IUserRoleRepository userRoleRepository, IRoleRepository roleRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _userrolerepository = userRoleRepository;
            _rolerepository = roleRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserDTOs>> GetAllUsersAsync()
        {
            var women = await _userRepository.GetListOfUsernAsync();
            return _mapper.Map<IEnumerable<UserDTOs>>(women);
        }

        public async Task<UserDTOs> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return _mapper.Map<UserDTOs>(user);
        }

        // תיקון הפונקציה - החזרת UserDTOs ותיקון הצפנת הסיסמה
        public async Task<UserDTOs> AddUserAsync(UserDTOs userDto)
        {
            // קבלת כל המשתמשים קיימים לבדיקה
            var existingUsers = await _userRepository.GetListOfUsernAsync();

            // בדיקת כפילות אימייל
            if (existingUsers.Any(u => u.Email.ToLower() == userDto.Email.ToLower()))
            {
                throw new InvalidOperationException("האימייל כבר קיים במערכת");
            }

            // יצירת משתמש חדש
            var user = _mapper.Map<User>(userDto);

            // הצפנת סיסמה עם BCrypt.Net-Next (עם alias)
            user.PasswordHash = BCryptNet.HashPassword(userDto.PasswordHash);
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            // הוספת המשתמש לבסיס הנתונים
            var addedUser = await _userRepository.AddUserAsync(user);

            // החזרת DTO במקום Entity
            return _mapper.Map<UserDTOs>(addedUser);
        }

        public async Task<UserDTOs> DeleteUserAsync(int userId)
        {
            var deletedCandidate = await _userRepository.DeleteUserAsync(userId);
            return _mapper.Map<UserDTOs>(deletedCandidate);
        }

        public async Task<UserDTOs> UpdateUserAsync(int id, UserDTOs userDto)
        {
            var user = _mapper.Map<User>(userDto);
            var updatedUser = await _userRepository.UpdateUserAsync(id, user);
            return _mapper.Map<UserDTOs>(updatedUser);
        }

        public async Task<UserDTOs> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetByUserByEmailAsync(email);
            return _mapper.Map<UserDTOs>(user);
        }

        public async Task<string> AuthenticateAsync(string email, string password)
        {
            User user = await _userRepository.GetByUserByEmailAsync(email);

            // תיקון אימות הסיסמה עם BCrypt.Net-Next (עם alias)
            if (user == null || !BCryptNet.Verify(password, user.PasswordHash))
            {
                return null;
            }

            var userRole = await _userrolerepository.GetByUserIdAsync(user.Id);
            if (userRole == null)
                return null;

            return userRole.Role.RoleName;
        }

        public async Task<IEnumerable<MonthlyRegistrationsDto>> GetMonthlyRegistrationsAsync()
        {
            var users = await _userRepository.GetListOfUsernAsync();
            var monthlyRegistrations = users
                .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
                .Select(g => new MonthlyRegistrationsDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                }).ToList();

            return monthlyRegistrations;
        }

        public async Task<UserDTOs> RegisterOrUpdateUserAsync(UserDTOs userDto)
        {
            var existingUser = await _userRepository.GetByUserByEmailAsync(userDto.Email);

            if (existingUser == null)
            {
                var newUser = _mapper.Map<User>(userDto);
                newUser.CreatedAt = DateTime.Now;
                var addedUser = await _userRepository.AddUserAsync(newUser);

                // שייכות לתפקיד אם צריך
                int roleId = await _rolerepository.GetIdByRoleAsync("User");
                await _userrolerepository.AddAsync(new UserRole { UserId = addedUser.Id, RoleId = roleId });

                return _mapper.Map<UserDTOs>(addedUser);
            }
            else
            {
                // אם רוצים לעדכן פרטים קיימים כמו שם, עושים את זה פה
                existingUser.UserName = userDto.UserName;
                var updatedUser = await _userRepository.UpdateUserAsync(existingUser.Id, existingUser);
                return _mapper.Map<UserDTOs>(updatedUser);
            }
        }
    }
}