
import { makeAutoObservable, runInAction } from "mobx";
import axios, { AxiosError } from "axios";
import { User, Candidate, ErrorResponse } from "../components/models/types";

const API_URL = import.meta.env.VITE_API_URL;;

class UserStore {
  users: User[] = [];
  currentUser: User | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async registerMale(userData: User): Promise<User> {
    this.loading = true;
    this.error = null;

    try {
     

      const response = await axios.post(`${API_URL}/user`, {
        ...userData
        
      });

      runInAction(() => {
        this.currentUser = response.data;
        this.loading = false;
      });

      return response.data;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          this.error = axiosError.response?.data?.message || "שגיאה ברישום מועמד";
        } else {
          this.error = "שגיאה לא ידועה ברישום מועמד";
        }
      });
      throw error;
    }
  }

 

  async getCandidateByTz(tz: string): Promise<Candidate | null> {
    this.loading = true;
    this.error = null;

    try {
      const response = await axios.get(`${API_URL}/user/${tz}`);
      runInAction(() => {
        this.currentUser = response.data;
        this.loading = false;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          this.error = axiosError.response?.data?.message || "שגיאה באחזור מועמד לפי תז";
        } else {
          this.error = "שגיאה לא ידועה באחזור מועמד לפי תז";
        }
      });
      return null;
    }
  }

 

  async updateCandidate(id: number, data: User): Promise<User> {
    this.loading = true;
    this.error = null;

    const url =`${API_URL}/user/${id}` ;

    try {
      const response = await axios.put(url, data);
      runInAction(() => {
        this.currentUser = response.data;
        this.loading = false;
      });
      return response.data;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        if (axios.isAxiosError(error)) { 
          const axiosError = error as AxiosError<ErrorResponse>;
          this.error = axiosError.response?.data?.message || "שגיאה בעדכון מועמד";
        } else {
          this.error = "שגיאה לא ידועה בעדכון מועמד";
        }
      });
      throw error;
    }
  }
}

export default new UserStore();
