using Cheers.Core.Entities;
using Cheers.Core.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cheers.Data.Repositories
{
    public class RepositoryUsers : IRepositoryUser
    {
        private readonly DataContext _dataContext;

        public RepositoryUsers(DataContext context)
        {
            _dataContext = context;
        }
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _dataContext.Users.ToListAsync();
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _dataContext.Users.FindAsync(id);
        }

        public async Task<User> GetByUserByEmailAsync(string email)
        {
             return await _dataContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
        public async Task<User> AddUserAsync(User user)
        {
           await _dataContext.Users.AddAsync(user);
           await _dataContext.SaveChangesAsync();
             return user;
        }
        public async Task<User> UpdateUserAsync(int id, User user)
        {
            var existingUser = await GetByIdAsync(id);
                 if (existingUser == null) return null;
                 existingUser.Id = id;
            await _dataContext.SaveChangesAsync();
            //    existingUser.CreatedAt = user.CreatedAt;

            return user;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await GetByIdAsync(id);
            if (user == null) return false;

            _dataContext.Users.Remove(user);
            return await _dataContext.SaveChangesAsync() > 0;
        }
    //    preturn await _dataContext.SaveChangesAsync() > 0;ublic async Task<IEnumerable<User>> GetAllUsersAsync()
    //    {
    //        return await _dataContext.Users.ToListAsync();
    //    }

    //    public async Task<User> GetUserByIdAsync(int id)
    //    {
    //        return await _dataContext.Users.FindAsync(id);
    //    }

    //    public async Task<User> AddUserAsync(User user)
    //    {
    //        await _dataContext.Users.AddAsync(user);
    //        return user;
    //    }

    //    public async Task<User> UpdateUserAsync(int id, User user)
    //    {
    //        var existingUser = await GetUserByIdAsync(id);
    //        if (existingUser == null) return null;
    //        existingUser.Id = id;
    //        existingUser.FirstName = user.FirstName;
    //        existingUser.LastName = user.LastName;
    //        existingUser.Email = user.Email;
    //        existingUser.Password = user.Password;
    //        existingUser.CreatedAt = user.CreatedAt;

    //        return user;
    //    }

    //    public async Task<bool> DeleteUserAsync(int id)
    //    {
    //        var user = await GetUserByIdAsync(id);
    //        if (user == null) return false;

    //        _dataContext.Users.Remove(user);
    //        return await _dataContext.SaveChangesAsync() > 0;
    //    }
    //    public async Task<User> GetByUserByEmailAsync(string email)
    //    {
    //        return await _dataContext.Users.FirstOrDefaultAsync(u => u.Email == email);
    //    }
    //}

    //    public async Task<IEnumerable<T>> GetAllAsync()
    //    {
    //        return await _context.Set<T>().ToListAsync();
    //    }

    //    public async Task<T> GetByIdAsync(int id)
    //    {
    //        return await _context.Set<T>().FindAsync(id);
    //    }

    //    public async Task<T> AddAsync(T entity)
    //    {
    //        await _context.Set<T>().AddAsync(entity);
    //        await _context.SaveChangesAsync();
    //        return entity;
    //    }

    //    public async Task<T> UpdateAsync(int id, T entity)
    //    {
    //        _context.Set<T>().Update(entity);
    //        await _context.SaveChangesAsync();
    //        return entity;
    //    }

    //    public async Task<T> DeleteAsync(int id)
    //    {
    //        var entity = await _context.Set<T>().FindAsync(id);
    //        if (entity != null)
    //        {
    //            _context.Set<T>().Remove(entity);
    //            await _context.SaveChangesAsync();
    //        }
    //        return entity;
    //    }
    //}




}
}
