using Cheers.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.IRepository
{
   public interface IRepositoryUser
    {
       
        // Task<string> AuthenticateAsync(string email, string password);


        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> AddUserAsync(User user);
        Task<User> UpdateUserAsync(int id, User user);
        Task<bool> DeleteUserAsync(int id);
        Task<User> GetByUserByEmailAsync(string email);
    }
}

