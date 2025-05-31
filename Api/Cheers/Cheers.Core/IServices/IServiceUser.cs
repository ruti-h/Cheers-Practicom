//using Cheers.Core.DTOs;
//using Cheers.Core.Entities;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Cheers.Core.IServices
//{
//    public interface IServiceUser
//    {
//        #region פונקציות קיימות - כמו שהיו

//        /// <summary>
//        /// קבלת כל המשתמשים (רגיל)
//        /// </summary>
//        Task<IEnumerable<UserDTOs>> GetAllUsersAsync();

//        /// <summary>
//        /// קבלת משתמש לפי ID
//        /// </summary>
//        Task<UserDTOs> GetUserByIdAsync(int id);

//        /// <summary>
//        /// הוספת משתמש חדש
//        /// </summary>
//        Task<UserDTOs> AddUserAsync(UserDTOs user);

//        /// <summary>
//        /// עדכון משתמש
//        /// </summary>
//        Task<UserDTOs> UpdateUserAsync(int id, UserDTOs user);

//        /// <summary>
//        /// מחיקת משתמש
//        /// </summary>
//        Task<bool> DeleteUserAsync(int id);

//        /// <summary>
//        /// קבלת משתמש לפי אימייל
//        /// </summary>
//        Task<UserDTOs> GetUserByEmailAsync(string email);

//        /// <summary>
//        /// אימות משתמש
//        /// </summary>
//        Task<string> AuthenticateAsync(string email, string password);

//        /// <summary>
//        /// סטטיסטיקות רישומים חודשיות
//        /// </summary>
//        Task<IEnumerable<MonthlyRegistrationsDto>> GetMonthlyRegistrationsAsync();

//        /// <summary>
//        /// רישום או עדכון משתמש
//        /// </summary>
//        Task<UserDTOs> RegisterOrUpdateUserAsync(UserDTOs userDto);

//        #endregion

//        #region 🎯 רק 2 פונקציות חדשות שאת באמת צריכה

//        /// <summary>
//        /// הפונקציה הכי חשובה - כל המשתמשים עם פרטי מועמד
//        /// </summary>
//        Task<IEnumerable<UserDTOs>> GetAllUsersWithDetailsAsync();

//        /// <summary>
//        /// משתמש יחיד עם פרטי מועמד
//        /// </summary>
//        Task<UserDTOs?> GetUserWithDetailsAsync(int id);

//        #endregion

//        #region פונקציות ריקות - כדי שלא תהיינה שגיאות קימפול

//        /// <summary>
//        /// לא בשימוש - אבל צריך לקימפול
//        /// </summary>
//        Task<bool> AddRoleToUserAsync(int userId, string roleName);

//        /// <summary>
//        /// לא בשימוש - אבל צריך לקימפול
//        /// </summary>
//        Task<bool> RemoveRoleFromUserAsync(int userId, string roleName);

//        /// <summary>
//        /// לא בשימוש - אבל צריך לקימפול
//        /// </summary>
//        Task<List<string>> GetUserRolesAsync(int userId);

//        #endregion
//    }
//}

using Cheers.Core.DTOs;
using Cheers.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cheers.Core.IServices
{
    public interface IServiceUser
    {
        Task<IEnumerable<UserDTOs>> GetAllUsersAsync();
        Task<UserDTOs> GetUserByIdAsync(int id);
        Task<UserDTOs> AddUserAsync(UserDTOs user);
        Task<UserDTOs> UpdateUserAsync(int id, UserDTOs user);
        Task<UserDTOs> DeleteUserAsync(int userId);
        Task<UserDTOs> GetUserByEmailAsync(string email);
        Task<string> AuthenticateAsync(string email, string password);
        Task<IEnumerable<MonthlyRegistrationsDto>> GetMonthlyRegistrationsAsync();
        public Task<UserDTOs> RegisterOrUpdateUserAsync(UserDTOs userDto);
        
    }
}