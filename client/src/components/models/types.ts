// src/types/models.ts

// טיפוסי המודלים הבסיסיים

// טיפוס בסיסי למועמד
export interface Candidate {
    id?: number;
    firstName: string;
    lastName: string;
    country?: string;
    city?: string;
    street?: string;
    numberHouse?: number;
    tz: string;
    backGround?: string;
    openness?: string;
    burnDate?: Date | string;
    healthCondition?: boolean;
    status?: string;
    height?: number;
    phone?: string;
    email?: string;
    appearance?: string;
    fatherPhone?: string;
    motherPhone?: string;
    class?: string;
    expectationsFromPartner?: string;
    club?: string;
    ageFrom?: number;
    ageTo?: number;
    importantTraitsInMe?: string;
    importantTraitsIAmLookingFor?: string;
//male
smoker?: boolean;
    beard?: string;
    hat?: string;
    suit?: string;
    driversLicense?: boolean;
    isLearning?: string;
    yeshiva?: string;
    preferredSeminarStyle?: string;
    preferredProfessional?: string;
    preferredHeadCovering?: string;
    preferredAnOutsider?: string;
    //woman
    seminar?: string;
    anOutsider?: boolean;
    prefferedIsLearning?: string;
    prefferedYeshivaStyle?: string;
    professional?: string;
    headCovering?: string;
  }
  

  
  // טיפוס מועמדת אישה המרחיב את הטיפוס הבסיסי
  export interface User {
   
    userName?: string;
    passwordHash?: string;
    email?: string;
    role?: string;
    tz?: string;

  }

  // טיפוסים לבקשות API
  
  
  // טיפוס לתגובת לוגין
  export interface LoginResponse {
    token: string;
    role: UserRole;
    id?: string | number;
    user?: any;
  }
  
  // טיפוס לתפקיד משתמש
  export type UserRole = "Male" | "Woman" | "MatchMaker";
  
  // טיפוס לבקשת לוגין
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  // טיפוס לבקשת רישום
  export interface RegisterRequest {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email?: string;
    role: UserRole;
  }
  
  // טיפוס לטופס רישום מפושט
  export interface SimpleRegistrationForm {
    tz: string;
    gender: UserRole;
    firstName: string;
    lastName: string;
    birthDate: string;
    status: string;
    height?: string;
    background?: string;
    smoker?: boolean;
    beard?: string;
    isLearning?: string;
    yeshiva?: string;
    seminar?: string;
    professional?: string;
    fatherName?: string;
    motherName?: string;
    fatherOrigin?: string;
    motherOrigin?: string;
    address?: string;
    city: string;
    phone: string;
    email?: string;
    fatherPhone?: string;
    motherPhone?: string;
  }
  
  // טיפוס לתגובות שגיאה
  export interface ErrorResponse {
    message?: string;
    status?: number;
    [key: string]: any;
  }