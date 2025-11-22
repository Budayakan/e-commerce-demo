"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- PERBAIKAN IMPORT ---
// Gunakan "../" (titik dua) untuk keluar dari folder 'profile' dan masuk ke 'context'
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; 
import { useModal } from "../context/ModalContext";

export default function ProfilePage() {
  const { user, getCurrentUserData, updateProfile } = useAuth();
  const { theme } = useTheme();
  const { showConfirm, showAlert } = useModal(); 
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    whatsapp: "",
    pass: "",
    confirmPass: "", 
    photo: ""
  });

  // Load data user saat halaman dibuka
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const data = getCurrentUserData();
    if (data) {
      setFormData({
        nama: data.nama,
        email: data.email,
        whatsapp: data.whatsapp || "",
        pass: data.pass,
        confirmPass: data.pass,
        photo: data.photo || ""
      });
    }
  }, [getCurrentUserData, router]);

  // Logika upload gambar
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1000000) {
        showAlert("Ukuran gambar terlalu besar! Maksimal 1MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user === "Super Admin") {
        showAlert("Akun Super Admin tidak dapat diubah!", "error");
        return;
    }

    // Validasi Password
    if (formData.pass !== formData.confirmPass) {
        showAlert("Konfirmasi Password tidak cocok!", "error");
        return;
    }
    if (formData.pass.length < 6) {
        showAlert("Password minimal 6 karakter.", "error");
        return;
    }

    // Konfirmasi Simpan
    showConfirm("Apakah Anda yakin ingin menyimpan perubahan profil ini?", () => {
        const success = updateProfile(formData.nama, formData.email, formData.pass, formData.photo, formData.whatsapp);
        
        if (success) {
            setTimeout(() => {
                showAlert("Profil berhasil diperbarui!", "success");
                router.push("/"); 
            }, 300);
        } else {
            setTimeout(() => {
                showAlert("Gagal memperbarui profil. Email mungkin sudah digunakan.", "error");
            }, 300);
        }
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 pb-20">
      <div 
        className={`p-8 md:p-12 rounded-[2.5rem] shadow-xl border transition-colors duration-300 
        ${theme === 'light' 
          ? 'bg-white border-sky-100' 
          : 'bg-gray-900 border-gray-800'}`}
      >
        
        <div className={`flex justify-between items-center mb-8 border-b-2 pb-4 ${theme === 'light' ? 'border-sky-50' : 'border-gray-800'}`}>
            <h2 className={`text-2xl md:text-3xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Edit Profil Saya
            </h2>
            <Link href="/" className="text-sm font-bold text-gray-400 hover:text-teal-500 transition">
                Batal & Kembali
            </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Foto Profil */}
          <div className={`flex flex-col items-center gap-6 p-6 rounded-3xl border-2 border-dashed ${theme === 'light' ? 'bg-sky-50/50 border-sky-200' : 'bg-gray-800 border-gray-700'}`}>
            <div className={`relative w-32 h-32 rounded-full p-1 shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}>
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                    {formData.photo ? (
                        <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-600 text-4xl font-black">
                        {formData.nama ? formData.nama.charAt(0).toUpperCase() : "?"}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full shadow-sm border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                </div>
            </div>
            
            <label className={`cursor-pointer py-2.5 px-6 rounded-full text-sm font-bold border shadow-sm transition transform hover:scale-105 ${theme === 'light' ? 'bg-white text-teal-700 border-teal-200 hover:bg-teal-50' : 'bg-gray-700 text-teal-400 border-gray-600 hover:bg-gray-600'}`}>
              <span>Unggah Foto Baru</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Max 1MB (JPG/PNG)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Nama Lengkap</label>
                <input 
                  type="text" 
                  required 
                  className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium ${theme === 'light' ? 'bg-white border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20'}`} 
                  value={formData.nama} 
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })} 
                />
            </div>
            
            <div>
                <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>No. WhatsApp</label>
                <input 
                  type="number" 
                  required 
                  className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium ${theme === 'light' ? 'bg-white border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20'}`} 
                  value={formData.whatsapp} 
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} 
                />
            </div>

            <div>
                <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Email</label>
                <input 
                  type="email" 
                  required 
                  className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium ${theme === 'light' ? 'bg-white border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20'}`} 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
            </div>

            <div className="md:col-span-2">
                <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Password</label>
                <input 
                  type="text" 
                  required 
                  className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium ${theme === 'light' ? 'bg-white border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20'}`} 
                  value={formData.pass} 
                  onChange={(e) => setFormData({ ...formData, pass: e.target.value })} 
                />
                <p className="text-xs text-gray-400 mt-2 ml-1">*Pastikan password mudah diingat.</p>
            </div>

            <div className="md:col-span-2">
                <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Konfirmasi Password</label>
                <input 
                  type="text" 
                  required 
                  className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium ${theme === 'light' ? 'bg-white border-sky-100 text-gray-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20'}`} 
                  value={formData.confirmPass} 
                  onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })}
                  placeholder="Ulangi password baru"
                />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white font-bold text-lg py-4 rounded-2xl transition shadow-lg shadow-teal-500/30 transform hover:-translate-y-1"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}