using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.Entities
{
  public  class Role
    {
        [Key]
        public int Id { get; set; } // מזהה ייחודי
        public string RoleName { get; set; } // שם התפקיד
        public string Description { get; set; } // תיאור התפקיד
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // תאריך יצירה
        public DateTime? UpdatedAt { get; set; } // תאריך עדכון אחרון

    }
}
