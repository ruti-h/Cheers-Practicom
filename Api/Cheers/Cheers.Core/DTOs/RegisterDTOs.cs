using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.DTOs
{
  public  class RegisterDTOs
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // "Candidate", "Women", "Shadchanit"

    }
}
