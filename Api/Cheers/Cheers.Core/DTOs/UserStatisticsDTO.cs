using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.DTOs
{
  public  class UserStatisticsDTO
    {
        public int TotalUsers { get; set; }
        public int TotalCandidates { get; set; }
        public int UsersWithCandidateProfile { get; set; }
    }
}
