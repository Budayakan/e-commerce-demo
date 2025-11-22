"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  nama: string;
  email: string;
  pass: string;
  role: string;
  photo?: string;
  whatsapp?: string;
}

interface AuthContextType {
  user: string | null;
  role: string | null;
  photo: string | null;
  login: (email: string, pass: string) => boolean;
  register: (nama: string, email: string, pass: string, role: string, whatsapp: string) => boolean;
  logout: () => void;
  getAllUsers: () => UserData[];
  changeUserRole: (email: string, newRole: string) => void;
  getCurrentUserData: () => UserData | null;
  updateProfile: (newName: string, newEmail: string, newPass: string, newPhoto: string, newWhatsapp: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();

  const DB_KEY = "users_db_local";

  useEffect(() => {
    const loggedInUser = localStorage.getItem("currentUser");
    const loggedInRole = localStorage.getItem("currentRole");
    const loggedInPhoto = localStorage.getItem("currentPhoto");

    if (loggedInUser && loggedInRole) {
      setUser(loggedInUser);
      setRole(loggedInRole);
      setPhoto(loggedInPhoto || null);
    }
  }, []);

  const getAllUsers = (): UserData[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  };

  const getCurrentUserData = (): UserData | null => {
    const users = getAllUsers();
    const currentUserData = users.find(u => u.nama === user);
    
    if (!currentUserData && user === "Super Admin") {
        return { 
          nama: "Super Admin", 
          email: "admin@admin.com", 
          pass: "123", 
          role: "admin", 
          photo: "", 
          whatsapp: "08123456789" 
        };
    }

    return currentUserData || null;
  };

  const updateProfile = (newName: string, newEmail: string, newPass: string, newPhoto: string, newWhatsapp: string): boolean => {
    const users = getAllUsers();
    const currentUserData = getCurrentUserData();

    if (!currentUserData) return false;

    // Cek duplikat email hanya jika email berubah
    if (newEmail !== currentUserData.email) {
        const isEmailTaken = users.some(u => u.email === newEmail);
        if (isEmailTaken) return false;
    }

    const updatedUsers = users.map(u => {
      if (u.email === currentUserData.email) {
        return { 
          ...u, 
          nama: newName, 
          email: newEmail, 
          pass: newPass, 
          photo: newPhoto, 
          whatsapp: newWhatsapp 
        };
      }
      return u;
    });

    localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));

    setUser(newName);
    setPhoto(newPhoto);
    localStorage.setItem("currentUser", newName);
    localStorage.setItem("currentPhoto", newPhoto);
    
    return true;
  };

  const login = (email: string, pass: string): boolean => {
    if (email === "admin@admin.com" && pass === "123") {
      setUser("Super Admin");
      setRole("admin");
      setPhoto(null);
      localStorage.setItem("currentUser", "Super Admin");
      localStorage.setItem("currentRole", "admin");
      return true;
    }

    const users = getAllUsers();
    const foundUser = users.find((u) => u.email === email && u.pass === pass);

    if (foundUser) {
      setUser(foundUser.nama);
      setRole(foundUser.role);
      setPhoto(foundUser.photo || null);

      localStorage.setItem("currentUser", foundUser.nama);
      localStorage.setItem("currentRole", foundUser.role);
      localStorage.setItem("currentPhoto", foundUser.photo || "");
      return true;
    }
    return false;
  };

  const register = (nama: string, email: string, pass: string, roleInput: string, whatsapp: string): boolean => {
    const users = getAllUsers();
    if (users.find(u => u.email === email)) return false;
    
    const newUser: UserData = { nama, email, pass, role: roleInput, photo: "", whatsapp };
    const newUsersList = [...users, newUser];
    
    localStorage.setItem(DB_KEY, JSON.stringify(newUsersList));
    
    setUser(nama);
    setRole(roleInput);
    setPhoto(null);

    localStorage.setItem("currentUser", nama);
    localStorage.setItem("currentRole", roleInput);
    localStorage.setItem("currentPhoto", "");
    
    return true;
  };

  const changeUserRole = (targetEmail: string, newRole: string) => {
    const users = getAllUsers();
    const updatedUsers = users.map((u) => {
      if (u.email === targetEmail) { return { ...u, role: newRole }; }
      return u;
    });
    localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
    
    const currentUserData = getCurrentUserData();
    if (currentUserData && currentUserData.email === targetEmail) {
        setRole(newRole);
        localStorage.setItem("currentRole", newRole);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setPhoto(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentRole");
    localStorage.removeItem("currentPhoto");
    router.push("/"); 
  };

  return (
    <AuthContext.Provider value={{ 
      user, role, photo, login, register, logout, 
      getAllUsers, changeUserRole, getCurrentUserData, updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- BAGIAN INI YANG SEBELUMNYA MUNGKIN HILANG/SALAH ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth error");
  return context;
};