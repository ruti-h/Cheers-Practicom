using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.Entities
{
    public class User
    {
        public int Id { get; set; } // מזהה ייחודי (PK)

        public string UserName { get; set; } // שם משתמש - חייב להיות ייחודי

        public string Email { get; set; } // אימייל - חייב להיות ייחודי

        public string PasswordHash { get; set; } // Hash של הסיסמה (128 תווים מומלץ)ד

        public DateTime CreatedAt { get; set; } // תאריך יצירת המשתמש

        public DateTime UpdatedAt { get; set; } // תאריך עדכון אחרון
    }
}
