// import { makeAutoObservable, runInAction } from "mobx";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// // מפתח לשמירת נתוני המשתמש ב-Session Storage
// const USER_STORAGE_KEY = "current_user";
// const TOKEN_STORAGE_KEY = "auth_token";
// const USER_ROLE_KEY = "user_role";

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// interface User {
//   id: number;
//   userName: string;
//   email: string;
//   passwordHash: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ServerResponse {
//   token: string;
//   user: User;
// }

// interface DecodedToken {
//   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
//   "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
//   exp: number;
//   iss: string;
//   aud: string;
// }

// // ממשק לנתוני הרשמה
// interface RegisterData {
//   userName: string;
//   tz: string;
//   email: string;
//   passwordHash: string;
//   roleName: string;
//   createdAt: string;
// }

// class AuthStore {
//   user: User | null = null;
//   token: string | null = null;
//   userRole: string | null = null;
//   loading: boolean = false;
//   error: string | null = null;
//   registerSuccess: boolean = false;
// baseUrl:string
//   constructor() {
//     makeAutoObservable(this);
//     // טעינת נתוני המשתמש מה-Session Storage בעת אתחול ה-store
//     this.loadUserFromStorage();
//     this.baseUrl = import.meta.env.VITE_API_URL;

//   }

//   // פונקציה לפענוח הטוקן ושליפת תפקיד המשתמש
//   decodeTokenAndGetRole = (token: string): string | null => {
//     try {
//       const decoded = jwtDecode<DecodedToken>(token);
//       // שליפת התפקיד מהטוקן
//       return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
//     } catch (error) {
//       console.error("שגיאה בפענוח הטוקן:", error);
//       return null;
//     }
//   };

//   // פונקציה לטעינת נתוני המשתמש מה-Session Storage
//   loadUserFromStorage = () => {
//     try {
//       const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
//       const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
//       const storedRole = sessionStorage.getItem(USER_ROLE_KEY);

//       if (storedUser) {
//         this.user = JSON.parse(storedUser);
//       }
      
//       if (storedToken) {
//         this.token = storedToken;
//       }
      
//       if (storedRole) {
//         this.userRole = storedRole;
//       }
//     } catch (error) {
//       console.error("שגיאה בטעינת נתוני המשתמש מה-Session Storage:", error);
//       // במקרה של שגיאה, נקה את ה-storage
//       this.clearStorage();
//     }
//   };

//   // פונקציה לשמירת נתוני המשתמש ב-Session Storage
//   saveUserToStorage = (response: ServerResponse) => {
//     try {
//       sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
//       sessionStorage.setItem(TOKEN_STORAGE_KEY, response.token);
//       console.log("token",this.token);

//       // פענוח הטוקן ושמירת התפקיד
//       const role = this.decodeTokenAndGetRole(response.token);
//       if (role) {
//         sessionStorage.setItem(USER_ROLE_KEY, role);
//       }
//     } catch (error) {
//       console.error("שגיאה בשמירת נתוני המשתמש ב-Session Storage:", error);
//     }
//   };

//   // פונקציה למחיקת נתוני המשתמש מה-Session Storage
//   clearStorage = () => {
//     sessionStorage.removeItem(USER_STORAGE_KEY);
//     sessionStorage.removeItem(TOKEN_STORAGE_KEY);
//     sessionStorage.removeItem(USER_ROLE_KEY);
//   };

//   // החזרת הנתיב המתאים לפי תפקיד המשתמש
//   getRedirectPath = (): string => {
//     if (!this.userRole) return "/";
    
//     // הוסף סלאש בהתחלה לפני שם התפקיד
//     switch (this.userRole) {
//       case "Shadchan":
//         return "/Shadchan";
//       case "Candidate":
//         return "/candidate-gender";
//       default:
//         return "/";
//     }
//   };

//   login = async (credentials: LoginCredentials) => {
//     try {
//       this.loading = true;
//       this.error = null;
      
//       // קריאת שרת ללוגין
//       const response = await axios.post<ServerResponse>(
//         `${this.baseUrl}/Auth/login`,
//         credentials,
//         {
//           headers: {
//             "Content-Type": "application/json"
//           },
//         }
//       );

//       runInAction(() => {
//         const serverResponse = response.data;
        
//         // שמירת נתוני המשתמש
//         this.user = serverResponse.user;
//         this.token = serverResponse.token;
//         this.userRole = this.decodeTokenAndGetRole(serverResponse.token);
        
//         // שמירת הנתונים ב-Session Storage
//         this.saveUserToStorage(serverResponse);
        
//         this.loading = false;
//       });

//       return true;
//     } catch (error: any) {
//       runInAction(() => {
//         this.loading = false;
//         this.error = error.response?.data?.message || "שגיאה בהתחברות, אנא נסה שנית";
//       });

//       return false;
//     }
//   };

//   // פונקציה להרשמה
//   register = async (registerData: RegisterData) => {
//     try {
//       this.loading = true;
//       this.error = null;
//       this.registerSuccess = false;
      
//       // קריאת שרת להרשמה
//       const response = await axios.post(
//        `${this.baseUrl}/Auth/register`,
       
//         registerData,
//         {
//           headers: {
//             "Content-Type": "application/json"
//           },

//         }

//       );

//       runInAction(() => {
//         const serverResponse = response.data;
//         this.loading = false;
//         this.registerSuccess = true;
//         this.token = serverResponse.token;
//         this.userRole = this.decodeTokenAndGetRole(serverResponse.token);
        
//         // שמירת הנתונים ב-Session Storage
//         this.saveUserToStorage(serverResponse);
//       });

//       return true;
//     } catch (error: any) {
//       runInAction(() => {
//         this.loading = false;
//         this.registerSuccess = false;
//         this.error = error.response?.data?.message || "שגיאה בהרשמה, אנא נסה שנית";
//       });

//       return false;
//     }
//   };

//   logout = () => {
//     // מחיקת נתוני המשתמש מה-Session Storage
//     this.clearStorage();
    
//     // איפוס המצב ב-store
//     this.user = null;
//     this.token = null;
//     this.userRole = null;
//   };

//   isLoggedIn = () => {
//     return !!this.token && !!this.user;
//   };

//   // איפוס הודעות השגיאה וההצלחה
//   resetMessages = () => {
//     this.error = null;
//     this.registerSuccess = false;
//   };
// }

// // יצירת מופע אחד של ה-store שיהיה זמין בכל האפליקציה
// const authStore = new AuthStore();
// export default authStore;

import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// מפתח לשמירת נתוני המשתמש ב-Session Storage
const USER_STORAGE_KEY = "current_user";
const TOKEN_STORAGE_KEY = "auth_token";
const USER_ROLE_KEY = "user_role";

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  userName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

interface ServerResponse {
  token: string;
  user: User;
}

interface DecodedToken {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iss: string;
  aud: string;
}

// ממשק לנתוני הרשמה
interface RegisterData {
  userName: string;
  tz: string;
  email: string;
  passwordHash: string;
  roleName: string;
  createdAt: string;
}

class AuthStore {
  user: User | null = null;
  token: string | null = null;
  userRole: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  registerSuccess: boolean = false;
  baseUrl: string;

  constructor() {
    makeAutoObservable(this);
  //  this.baseUrl="https://localhost:7215/api"
    this.baseUrl = import.meta.env.VITE_API_URL ;

    // טעינת נתוני המשתמש מה-Session Storage בעת אתחול ה-store
    this.loadUserFromStorage();
  }

  // בדיקה אם הטוקן תקין לפני פענוח
  isValidToken = (token: any): token is string => {
    return typeof token === 'string' && 
           token.length > 0 && 
           token !== 'null' && 
           token !== 'undefined' &&
           token.split('.').length === 3; // בדיקה בסיסית של JWT
  };

  // פונקציה לפענוח הטוקן ושליפת תפקיד המשתמש - מתוקנת
  decodeTokenAndGetRole = (token: string | null): string | null => {
    if (!this.isValidToken(token)) {
      console.warn("טוקן לא תקין עבור פענוח:", token);
      return null;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("טוקן פוענח בהצלחה:", decoded);
      
      // בדיקת תפוגה
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        console.warn("טוקן פג תוקף");
        this.clearStorage(); // נקה אוטומטי
        return null;
      }
      
      // שליפת התפקיד מהטוקן
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log("תפקיד משתמש מהטוקן:", role);
      return role || null;
    } catch (error) {
      console.error("שגיאה בפענוח הטוקן:", error);
      // במקרה של שגיאה, נקה את הטוקן הפגום
      this.clearStorage();
      return null;
    }
  };

  // פונקציה לטעינת נתוני המשתמש מה-Session Storage - מתוקנת
  loadUserFromStorage = () => {
    try {
      console.log("🔄 טוען נתוני משתמש מ-Session Storage...");
      
      const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
      const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      const storedRole = sessionStorage.getItem(USER_ROLE_KEY);

      console.log("נתונים שנמצאו:", { 
        hasUser: !!storedUser, 
        hasToken: !!storedToken, 
        hasRole: !!storedRole 
      });

      // בדיקה מפורטת של הטוקן
      if (storedToken) {
        if (this.isValidToken(storedToken)) {
          this.token = storedToken;
          console.log("✅ טוקן נטען בהצלחה");
          
          // נסה לפענח ולקבל תפקיד
          const decodedRole = this.decodeTokenAndGetRole(storedToken);
          if (decodedRole) {
            this.userRole = decodedRole;
          } else if (storedRole) {
            // אם פענוח נכשל, השתמש בתפקיד השמור
            this.userRole = storedRole;
          }
        } else {
          console.warn("⚠️ טוקן לא תקין נמצא ב-storage, מנקה...");
          this.clearStorage();
          return;
        }
      }

      // טעינת נתוני משתמש רק אם יש טוקן תקין
      if (storedUser && this.token) {
        try {
          this.user = JSON.parse(storedUser);
          console.log("✅ נתוני משתמש נטענו בהצלחה");
        } catch (parseError) {
          console.error("שגיאה בפענוח נתוני משתמש:", parseError);
          this.clearStorage();
        }
      }

      console.log("מצב אחרי טעינה:", {
        hasUser: !!this.user,
        hasToken: !!this.token,
        userRole: this.userRole
      });

    } catch (error) {
      console.error("שגיאה בטעינת נתוני המשתמש מה-Session Storage:", error);
      // במקרה של שגיאה, נקה את ה-storage
      this.clearStorage();
    }
  };

  // פונקציה לשמירת נתוני המשתמש ב-Session Storage - מתוקנת
  saveUserToStorage = (response: ServerResponse) => {
    try {
      if (!response.token || !this.isValidToken(response.token)) {
        console.error("מנסה לשמור טוקן לא תקין:", response.token);
        return;
      }

      console.log("💾 שומר נתוני משתמש ב-Session Storage...");
      
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      sessionStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      
      console.log("token saved:", response.token);

      // פענוח הטוקן ושמירת התפקיד
      const role = this.decodeTokenAndGetRole(response.token);
      if (role) {
        sessionStorage.setItem(USER_ROLE_KEY, role);
        console.log("role saved:", role);
      }

      console.log("✅ נתונים נשמרו בהצלחה");
    } catch (error) {
      console.error("שגיאה בשמירת נתוני המשתמש ב-Session Storage:", error);
    }
  };

  // פונקציה למחיקת נתוני המשתמש מה-Session Storage
  clearStorage = () => {
    try {
      console.log("🧹 מנקה Session Storage...");
      sessionStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(USER_ROLE_KEY);
      
      // איפוס המצב המקומי
      this.user = null;
      this.token = null;
      this.userRole = null;
      
      console.log("✅ Session Storage נוקה");
    } catch (error) {
      console.error("שגיאה במחיקת Session Storage:", error);
    }
  };

  // החזרת הנתיב המתאים לפי תפקיד המשתמש
  getRedirectPath = (): string => {
    if (!this.userRole) {
      console.log("אין תפקיד משתמש, מנתב לעמוד הבית");
      return "/";
    }
    
    console.log("מנתב לפי תפקיד:", this.userRole);
    
    // הוסף סלאש בהתחלה לפני שם התפקיד
    switch (this.userRole) {
      case "Shadchan":
        return "/Shadchan";
      case "Candidate":
        return "/candidate-gender";
      default:
        return "/";
    }
  };

  login = async (credentials: LoginCredentials) => {
    try {
      console.log("🚀 מתחיל תהליך התחברות...");
      
      this.loading = true;
      this.error = null;
      console.log('baseUrl:',this.baseUrl);
      
      // קריאת שרת ללוגין
      const response = await axios.post<ServerResponse>(
        `${this.baseUrl}/Auth/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      console.log("📡 קיבל תגובה מהשרת:", response.status);

      runInAction(() => {
        const serverResponse = response.data;
        
        // בדיקה שהתגובה תקינה
        if (!serverResponse.token || !this.isValidToken(serverResponse.token)) {
          throw new Error("התקבל טוקן לא תקין מהשרת");
        }
        
        // שמירת נתוני המשתמש
        this.user = serverResponse.user;
        this.token = serverResponse.token;
        this.userRole = this.decodeTokenAndGetRole(serverResponse.token);
        
        // שמירת הנתונים ב-Session Storage
        this.saveUserToStorage(serverResponse);
        
        this.loading = false;
        console.log("✅ התחברות הושלמה בהצלחה");
      });

      return true;
    } catch (error: any) {
      console.error("❌ שגיאה בהתחברות:", error);
      
      runInAction(() => {
        this.loading = false;
        this.error = error.response?.data?.message || error.message || "שגיאה בהתחברות, אנא נסה שנית";
      });

      return false;
    }
  };

  // פונקציה להרשמה - מתוקנת
  register = async (registerData: RegisterData) => {
    try {
      console.log("📝 מתחיל תהליך הרשמה...");
      
      this.loading = true;
      this.error = null;
      this.registerSuccess = false;
      
      // קריאת שרת להרשמה
      const response = await axios.post(
        `${this.baseUrl}/Auth/register`,
        registerData,
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      console.log("📡 קיבל תגובה מהשרת להרשמה:", response.status);

      runInAction(() => {
        const serverResponse = response.data;
        
        this.loading = false;
        this.registerSuccess = true;
        
        // רק אם קיבלנו טוקן תקין
        if (serverResponse.token && this.isValidToken(serverResponse.token)) {
          this.token = serverResponse.token;
          this.userRole = this.decodeTokenAndGetRole(serverResponse.token);
          
          // שמירת הנתונים ב-Session Storage
          this.saveUserToStorage(serverResponse);
          console.log("✅ הרשמה הושלמה עם אימות אוטומטי");
        } else {
          console.log("✅ הרשמה הושלמה - נדרשת התחברות נפרדת");
        }
      });

      return true;
    } catch (error: any) {
      console.error("❌ שגיאה בהרשמה:", error);
      
      runInAction(() => {
        this.loading = false;
        this.registerSuccess = false;
        this.error = error.response?.data?.message || error.message || "שגיאה בהרשמה, אנא נסה שנית";
      });

      return false;
    }
  };

  logout = () => {
    console.log("👋 מתנתק מהמערכת...");
    
    // מחיקת נתוני המשתמש מה-Session Storage
    this.clearStorage();
    
    console.log("✅ התנתקות הושלמה");
  };

  isLoggedIn = () => {
    const loggedIn = !!this.token && !!this.user && this.isValidToken(this.token);
    console.log("בדיקת מצב התחברות:", loggedIn);
    return loggedIn;
  };

  // איפוס הודעות השגיאה וההצלחה
  resetMessages = () => {
    this.error = null;
    this.registerSuccess = false;
  };

  // פונקציה לניקוי חירום
  emergencyClean = () => {
    console.log("🆘 ניקוי חירום מופעל!");
    try {
      sessionStorage.clear();
      localStorage.clear();
      this.user = null;
      this.token = null;
      this.userRole = null;
      this.error = null;
      this.registerSuccess = false;
      this.loading = false;
      console.log("✅ ניקוי חירום הושלם");
    } catch (error) {
      console.error("שגיאה בניקוי חירום:", error);
    }
  };
}

// יצירת מופע אחד של ה-store שיהיה זמין בכל האפליקציה
const authStore = new AuthStore();

// הוספת פונקציה גלובלית לניקוי (לדיבוג)
(window as any).authStore = authStore;
(window as any).emergencyClean = () => authStore.emergencyClean();

export default authStore;