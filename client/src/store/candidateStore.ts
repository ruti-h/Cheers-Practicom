import { makeAutoObservable } from "mobx";
import axios from "axios";

// סוגי מין
export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

// ממשק נתוני מועמד
export interface CandidateData {
  //שדות משותפים לשני המינים
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  street: string;
  numberHouse: number;
  tz: string;
  backGround: string;
  openness: string;
  burnDate: string;
  healthCondition: boolean;
  status: string;
  height: number;
  phone: string;
  email: string;
  appearance: string;
  fatherPhone: string;
  motherPhone: string;
  class: string;
  expectationsFromPartner: string;
  club: string;
  ageFrom: number;
  ageTo: number;
  importantTraitsInMe: string;
  importantTraitsIAmLookingFor: string;
  gender: string;
  // שדות לגברים
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
  // שדות לנשים
  seminar?: string;
  anOutsider?: boolean;
  prefferedIsLearning?: string;
  prefferedYeshivaStyle?: string;
  professional?: string;
  headCovering?: string;
}

class CandidateStore {
  registerData: CandidateData | null = null;
  loading: boolean = false;
  error: string | null = null;
  success: boolean = false;
  selectedGender: Gender | null = null;
  baseUrl: string
  constructor() {
    makeAutoObservable(this);
    this.baseUrl = import.meta.env.VITE_API_URL;
  }

  // עדכון מגדר נבחר
  setGender(gender: Gender) {
    this.selectedGender = gender;
  }

  // איפוס הודעות ומצבים
  resetMessages() {
    this.error = null;
    this.success = false;
  }

  // יצירת אובייקט ריק עם ערכי ברירת מחדל
  initializeEmptyCandidate() {
    this.registerData = {
      firstName: "",
      lastName: "",
      country: "",
      city: "",
      street: "",
      numberHouse: 0,
      tz: "",
      backGround: "",
      openness: "",
      burnDate: new Date().toISOString(),
      healthCondition: true,
      status: "",
      height: 0,
      phone: "",
      email: "",
      appearance: "",
      fatherPhone: "",
      motherPhone: "",
      class: "",
      expectationsFromPartner: "",
      club: "",
      ageFrom: 20,
      ageTo: 30,
      importantTraitsInMe: "",
      importantTraitsIAmLookingFor: "",
      gender: ""
    };

    // הוספת שדות לפי מגדר
    if (this.selectedGender === Gender.MALE) {
      this.registerData = {
        ...this.registerData,
        smoker: false,
        beard: "",
        hat: "",
        suit: "",
        driversLicense: false,
        isLearning: "",
        yeshiva: "",
        preferredSeminarStyle: "",
        preferredProfessional: "",
        preferredHeadCovering: "",
        preferredAnOutsider: "",
        gender: "male"
      };
    } else if (this.selectedGender === Gender.FEMALE) {
      this.registerData = {
        ...this.registerData,
        seminar: "",
        anOutsider: false,
        prefferedIsLearning: "",
        prefferedYeshivaStyle: "",
        professional: "",
        headCovering: "",
        gender: "female"
      };
    }
  }

  // עדכון נתון בודד
  updateField(field: string, value: any) {
    if (this.registerData) {
      this.registerData = {
        ...this.registerData,
        [field]: value
      };
    }
  }

  // שליחת הנתונים לשרת
  async registerCandidate() {
    if (!this.registerData) {
      this.error = "לא נמצאו נתונים להרשמה";
      return false;
    }

    this.loading = true;
    this.error = null;
    this.success = false;

    try {
      await axios.post(
       `${this.baseUrl}/Candidate`,
        this.registerData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      this.success = true;
      this.loading = false;
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.error = error.response?.data?.message || "אירעה שגיאה בעת הרשמת המועמד";
      } else {
        this.error = "אירעה שגיאה בלתי צפויה";
      }
      this.loading = false;
      return false;
    }
  }
}

const candidateStore = new CandidateStore();
export default candidateStore;