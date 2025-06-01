// authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  username: string;
  email: string;    
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isFormCompleted: boolean | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}

// עדכן את LoginResponse לפי מה שהשרת באמת מחזיר
interface LoginResponse {
  token: string;
  user: {
    id: number;
    userName: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
  };
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isFormCompleted: null
};
const baseUrl= import.meta.env.VITE_API_URL;
// יצירת אסינכרון thunk עבור תהליך הלוגין
export const loginUser = createAsyncThunk<User, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      
      const response = await axios.post<LoginResponse>(
        `${baseUrl}/Auth/login`,
        {
          
          email: credentials.username, // השרת מצפה ל-email
          password: credentials.password
        }
      );
      
      
      // שמירת הטוקן וה-email ב-localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.user.email);
      
      // החזר אובייקט שתואם בדיוק ל-User interface
      const userData = {
        username: response.data.user.userName,
        email: response.data.user.email,
        token: response.data.token
      };
      
      return userData;
      
    } catch (error: any) {
      if (error.response) {
        console.error('📡 תגובת שרת:', error.response.data);
        return rejectWithValue(error.response.data.message || 'התחברות נכשלה');
      }
      return rejectWithValue('לא ניתן להתחבר לשרת');
    }
  }
);

// בדיקת השלמת טופס מועמד
export const checkCandidateCompletion = createAsyncThunk<boolean, string>(
  'auth/checkCompletion',
  async (email: string, { rejectWithValue }) => {
    try {
      
      const token = localStorage.getItem('token');
      const encodedEmail = encodeURIComponent(email);
      const url = `${baseUrl}/Candidate/check-completion/${encodedEmail}`;
      
      console.log('📡 שולח בקשה ל:', url);
      console.log('🔑 עם טוקן:', token ? 'קיים' : 'חסר');
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      
      const isCompleted = response.data.isCompleted;
      
      return isCompleted;
      
    } catch (error: any) {
    
      
      if (error.response?.status === 404) {
        console.log('📋 לא נמצא מועמד - מחזיר false');
        return false;
      }
      
      return rejectWithValue('שגיאה בבדיקת סטטוס המועמד');
    }
  }
);

// פונקציה לטעינת משתמש מ-localStorage (אם יש)
export const loadUserFromStorage = createAsyncThunk<User | null>(
  'auth/loadFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      
      if (token && userEmail) {
        
        // בדוק אם הטוקן עדיין תקף (אופציונלי)
        try {
          await axios.get(`${baseUrl}/Auth/verify`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          return null;
        }
        
        const userData: User = {
          username: userEmail.split('@')[0],
          email: userEmail,
          token: token
        };
        
        return userData;
      }
      
      console.log('❌ אין נתוני משתמש בזיכרון');
      return null;
    } catch (error) {
      return rejectWithValue('שגיאה בטעינת נתוני משתמש');
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isFormCompleted = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    },
    // איפוס סטטוס בדיקת טופס
    resetFormCompletionStatus: (state) => {
      state.isFormCompleted = null;
    },
    // סימון ידני שהטופס הושלם
    setFormCompleted: (state, action) => {
      console.log('✅ מסמן טופס כהושלם:', action.payload);
      state.isFormCompleted = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        console.log('⏳ מתחיל תהליך התחברות...');
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('✅ התחברות הושלמה בהצלחה');
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('❌ התחברות נכשלה:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })
 
  
  },
});

export const { logout, resetFormCompletionStatus, setFormCompleted } = authSlice.actions;
export default authSlice.reducer;