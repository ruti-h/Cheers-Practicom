using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.DTOs
{
  public   class UserSearchDTO
    {
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? Role { get; set; }
        public bool? HasCandidate { get; set; }
    }
}
