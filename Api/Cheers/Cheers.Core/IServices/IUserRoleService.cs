using Cheers.Core.DTOs;
using Cheers.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.IServices
{
 public   interface IUserRoleService
    {
        //public Task<IEnumerable<CandidateDTOs>> GetListOfUsernAsync();

        public Task<UserRole> AddAsync(string role, int userId);


    }
}
