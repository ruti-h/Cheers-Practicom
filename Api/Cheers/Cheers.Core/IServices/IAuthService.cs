using Cheers.Core.DTOs;
using Cheers.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.IServices
{
   public interface IAuthService
    {



        //    string GenerateToken(Candidate user);
        //Task<Candidate> AuthenticateUser(LoginDTOs loginDto);
        //Task<Candidate> RegisterUser(RegisterDTOs registerDto);
        //Task<Candidate> GetUserById(int id);
        //Task DeleteUser(int id);
        string GenerateJwtToken(string username, string[] roles);
    }
}
