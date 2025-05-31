using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.DTOs
{
   public class MatchResult
    {
        public int UserId { get; set; }      // נשמור את ה-ID
        public int Score { get; set; }
        public List<string> Comment { get; set; }

    }
}
