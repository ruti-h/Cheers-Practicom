// hooks.ts
import { useSelector, useDispatch } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// יצירת הוקים מותאמים עם טיפוסים
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// הוק נוח לבדיקת מצב האותנטיקציה
export const useAuth = () => {
  return useAppSelector((state) => ({
    isAuthenticated: !!state.auth.user,
    user: state.auth.user,
    loading: state.auth.loading,
    error: state.auth.error
  }));
};