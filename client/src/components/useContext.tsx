// src/context/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  Id: number;
  UserName: string;
  Name: string;
  Phone: string;
  Email: string;
  Tz: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

 export const UserContext = createContext<UserContextType>({
    user: null,
    login: () => {},
    logout: () => {},
  });
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // שמירה מקומית (אופציונלי)
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);

