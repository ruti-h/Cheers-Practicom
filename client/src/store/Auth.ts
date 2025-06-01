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
baseUrl:string
  constructor() {
    makeAutoObservable(this);
    // טעינת נתוני המשתמש מה-Session Storage בעת אתחול ה-store
    this.loadUserFromStorage();
    this.baseUrl = import.meta.env.VITE_API_URL;

  }

  // פונקציה לפענוח הטוקן ושליפת תפקיד המשתמש
  decodeTokenAndGetRole = (token: string): string | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // שליפת התפקיד מהטוקן
      return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (error) {
      console.error("שגיאה בפענוח הטוקן:", error);
      return null;
    }
  };

  // פונקציה לטעינת נתוני המשתמש מה-Session Storage
  loadUserFromStorage = () => {
    try {
      const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
      const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      const storedRole = sessionStorage.getItem(USER_ROLE_KEY);

      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
      
      if (storedToken) {
        this.token = storedToken;
      }
      
      if (storedRole) {
        this.userRole = storedRole;
      }
    } catch (error) {
      console.error("שגיאה בטעינת נתוני המשתמש מה-Session Storage:", error);
      // במקרה של שגיאה, נקה את ה-storage
      this.clearStorage();
    }
  };

  // פונקציה לשמירת נתוני המשתמש ב-Session Storage
  saveUserToStorage = (response: ServerResponse) => {
    try {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      sessionStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      console.log(this.token);

      // פענוח הטוקן ושמירת התפקיד
      const role = this.decodeTokenAndGetRole(response.token);
      if (role) {
        sessionStorage.setItem(USER_ROLE_KEY, role);
      }
    } catch (error) {
      console.error("שגיאה בשמירת נתוני המשתמש ב-Session Storage:", error);
    }
  };

  // פונקציה למחיקת נתוני המשתמש מה-Session Storage
  clearStorage = () => {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_ROLE_KEY);
  };

  // החזרת הנתיב המתאים לפי תפקיד המשתמש
  getRedirectPath = (): string => {
    if (!this.userRole) return "/";
    
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
      this.loading = true;
      this.error = null;
      
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

      runInAction(() => {
        const serverResponse = response.data;
        
        // שמירת נתוני המשתמש
        this.user = serverResponse.user;
        this.token = serverResponse.token;
        this.userRole = this.decodeTokenAndGetRole(serverResponse.token);
        
        // שמירת הנתונים ב-Session Storage
        this.saveUserToStorage(serverResponse);
        
        this.loading = false;
      });

      return true;
    } catch (error: any) {
      runInAction(() => {
        this.loading = false;
        this.error = error.response?.data?.message || "שגיאה בהתחברות, אנא נסה שנית";
      });

      return false;
    }
  };

  // פונקציה להרשמה
  register = async (registerData: RegisterData) => {
    try {
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

      runInAction(() => {
        const serverResponse = response.data;
        this.loading = false;
        this.registerSuccess = true;
        this.token = serverResponse.token;
        this.userRole = this.decodeTokenAndGetRole(serverResponse.token);
        
        // שמירת הנתונים ב-Session Storage
        this.saveUserToStorage(serverResponse);
      });

      return true;
    } catch (error: any) {
      runInAction(() => {
        this.loading = false;
        this.registerSuccess = false;
        this.error = error.response?.data?.message || "שגיאה בהרשמה, אנא נסה שנית";
      });

      return false;
    }
  };

  logout = () => {
    // מחיקת נתוני המשתמש מה-Session Storage
    this.clearStorage();
    
    // איפוס המצב ב-store
    this.user = null;
    this.token = null;
    this.userRole = null;
  };

  isLoggedIn = () => {
    return !!this.token && !!this.user;
  };

  // איפוס הודעות השגיאה וההצלחה
  resetMessages = () => {
    this.error = null;
    this.registerSuccess = false;
  };
}

// יצירת מופע אחד של ה-store שיהיה זמין בכל האפליקציה
const authStore = new AuthStore();
export default authStore;