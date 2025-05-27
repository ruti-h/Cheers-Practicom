using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.Entities
{
  public  class Permission
    {

        [Key]
        public int Id { get; set; } // מזהה ייחודי
        public string PermissionName { get; set; } // שם ההרשאה
        public string Description { get; set; } // תיאור ההרשאה
    }
}
