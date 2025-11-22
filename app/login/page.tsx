"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useModal } from "../context/ModalContext"; // Import Modal
import { useRouter } from "next/navigation"; // Import Router
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const { showAlert } = useModal(); // Gunakan Modal Custom
  const router = useRouter(); // Gunakan Router
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, pass);
    
    if (success) {
      // Tampilkan popup sukses dan redirect
      showAlert("Login Berhasil! Selamat datang kembali.", "success");
      // Redirect dilakukan manual di sini karena AuthContext hanya mengembalikan boolean
      router.push("/"); 
    } else {
      // Tampilkan popup error
      showAlert("Email atau password salah! (Coba: admin@admin.com / 123)", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      {/* Container Utama: Warna dinamis berdasarkan tema */}
      <div 
        className={`p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden border transition-colors duration-300 
        ${theme === 'light' 
          ? 'bg-white border-sky-100 shadow-sky-100/50' 
          : 'bg-gray-900 border-gray-800 shadow-black/50'}`}
      >
        
        {/* Hiasan Background Blur */}
        <div className={`absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 rounded-full opacity-60 blur-3xl ${theme === 'light' ? 'bg-teal-50' : 'bg-teal-900/20'}`}></div>
        <div className={`absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 rounded-full opacity-60 blur-3xl ${theme === 'light' ? 'bg-sky-50' : 'bg-blue-900/20'}`}></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-black mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Selamat Datang! 👋
            </h2>
            <p className={`font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Masuk untuk mulai belanja.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Email
              </label>
              <input
                type="email"
                required
                className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium 
                  ${theme === 'light' 
                    ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 placeholder-gray-400' 
                    : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 placeholder-gray-500'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
              />
            </div>

            {/* Input Password */}
            <div>
              <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Password
              </label>
              <input
                type="password"
                required
                className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium 
                  ${theme === 'light' 
                    ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 placeholder-gray-400' 
                    : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 placeholder-gray-500'}`}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            {/* Tombol Masuk */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white font-bold text-lg py-4 rounded-2xl transition shadow-lg shadow-teal-500/30 transform hover:-translate-y-1 mt-4 flex justify-center items-center gap-2"
            >
              Masuk Sekarang
            </button>
          </form>

          {/* Link Daftar */}
          <p className={`mt-8 text-center font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Belum punya akun?{" "}
            <Link href="/register" className="text-teal-500 hover:text-teal-400 font-bold hover:underline transition">
              Daftar disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}