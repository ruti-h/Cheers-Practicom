using Cheers.Core.DTOs;
using Cheers.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.IServices
{
    public interface IServiceUser
    {
        //      Task<IEnumerable<UserDTOs>> GetAllUsersAsync();
        //      Task<UserDTOs> GetUserByIdAsync(int id);
        //      Task<UserDTOs> AddUserAsync(UserDTOs userDto);
        //      Task<bool> DeleteUserAsync(int id);
        //      Task<UserDTOs> UpdateUserAsync(int id, UserDTOs userDto);
        //  Task<string> AuthenticateAsync(string email, string password);

        //  Task<IEnumerable<MonthlyRegistrationsDto>> GetMonthlyRegistrationsAsync();




        //Task<UserDTOs> GetUserByEmailAsync(string email);

        Task<IEnumerable<UserDTOs>> GetAllUsersAsync();
        Task<UserDTOs> GetUserByIdAsync(int id);
        Task<UserDTOs> AddUserAsync(UserDTOs user);
        Task<UserDTOs> UpdateUserAsync(int id, UserDTOs user);
        Task<bool> DeleteUserAsync(int id);
        Task<UserDTOs> GetUserByEmailAsync(string email);
        Task<string> AuthenticateAsync(string email, string password);
        Task<IEnumerable<MonthlyRegistrationsDto>> GetMonthlyRegistrationsAsync();
        public Task<UserDTOs> RegisterOrUpdateUserAsync(UserDTOs userDto);


    }

}

