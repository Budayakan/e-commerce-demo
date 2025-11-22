"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useModal } from "../context/ModalContext"; // Import Modal
import { useRouter } from "next/navigation"; // Import Router
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const { theme } = useTheme();
  const { showAlert } = useModal(); 
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState(""); // State baru untuk Konfirmasi Password

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- VALIDASI PASSWORD ---
    if (pass !== confirmPass) {
      showAlert("Password dan Konfirmasi Password tidak cocok!", "error");
      return;
    }

    if (pass.length < 6) {
       showAlert("Password minimal 6 karakter.", "error");
       return;
    }

    // Panggil fungsi register
    const success = register(nama, email, pass, "pengunjung", whatsapp);

    if (success) {
      showAlert("Registrasi Berhasil! Selamat datang di Toko Warga.", "success");
      router.push("/"); 
    } else {
      showAlert("Email sudah terdaftar! Silakan gunakan email lain.", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-10">
      <div 
        className={`p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden border transition-colors duration-300 
        ${theme === 'light' 
          ? 'bg-white border-sky-100 shadow-sky-100/50' 
          : 'bg-gray-900 border-gray-800 shadow-black/50'}`}
      >
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-sky-400"></div>

        <div className="text-center mb-8">
            <h2 className={`text-3xl font-black mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Buat Akun Baru 🚀
            </h2>
            <p className={`font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Bergabunglah dengan komunitas Toko Warga.
            </p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Input Nama */}
          <div>
            <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium 
                ${theme === 'light' 
                  ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 placeholder-gray-400' 
                  : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 placeholder-gray-500'}`}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          {/* Input WhatsApp */}
          <div>
            <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              No. WhatsApp
            </label>
            <input
              type="number"
              required
              className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium 
                ${theme === 'light' 
                  ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 placeholder-gray-400' 
                  : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 placeholder-gray-500'}`}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Contoh: 08123456789"
            />
          </div>

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

          {/* Input Konfirmasi Password (BARU) */}
          <div>
            <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Konfirmasi Password
            </label>
            <input
              type="password"
              required
              className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium 
                ${theme === 'light' 
                  ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 placeholder-gray-400' 
                  : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 placeholder-gray-500'}`}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Ulangi password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white font-bold text-lg py-4 rounded-2xl transition shadow-lg shadow-teal-500/30 transform hover:-translate-y-1 mt-4 flex justify-center items-center gap-2"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className={`mt-8 text-center font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          Sudah punya akun?{" "}
          <Link href="/login" className="text-teal-500 hover:text-teal-400 font-bold hover:underline transition">
            Login disini
          </Link>
        </p>
      </div>
    </div>
  );
}