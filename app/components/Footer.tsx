"use client";

import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer 
      className={`p-6 text-center mt-auto border-t-4 transition-colors duration-300 
      ${theme === 'light' 
        ? 'bg-white text-gray-600 border-sky-200' 
        : 'bg-black text-teal-100 border-teal-600'}`}
    >
      <p className="font-medium">
        &copy; {new Date().getFullYear()} E-Commerce Warga. 
        <span className={`font-bold ml-1 ${theme === 'light' ? 'text-teal-600' : 'text-teal-400'}`}>
          Belanja Mudah & Aman.
        </span>
      </p>
    </footer>
  );
}