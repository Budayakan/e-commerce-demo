"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Default ke 'light' agar sesuai dengan tone biru muda yang diinginkan
  const [theme, setTheme] = useState<Theme>("light");

  // Efek untuk mengubah class pada body saat tema berubah
  useEffect(() => {
    const body = document.body;
    
    // Reset class lama
    body.classList.remove("bg-sky-100", "text-gray-900", "bg-gray-950", "text-gray-100");

    if (theme === "light") {
      // TEMA LIGHT: Background Biru Muda (sky-100), Teks Gelap
      body.classList.add("bg-sky-100", "text-gray-900");
    } else {
      // TEMA DARK: Background Gelap (gray-950), Teks Putih
      body.classList.add("bg-gray-950", "text-gray-100");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};