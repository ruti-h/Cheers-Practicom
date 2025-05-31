using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.DTOs
{
    public class UserDTOs
    {
        public int Id { get; set; } // מזהה ייחודי (PK)

        public string UserName { get; set; } // שם משתמש - חייב להיות ייחודי

        public string Email { get; set; } // אימייל - חייב להיות ייחודי

        public string PasswordHash { get; set; } // Hash של הסיסמה (128 תווים מומלץ)ד

        public DateTime CreatedAt { get; set; } // תאריך יצירת המשתמש

        public DateTime UpdatedAt { get; set; } // תאריך עדכון אחרון
        public string? UserRole { get; set; }  // 🆕 תפקיד יחיד (Admin/Candidate/MatchMaker)
        public CandidateDTOs? CandidateDetails { get; set; } // 🆕 פרטי מועמד


    }
}
