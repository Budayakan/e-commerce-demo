"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategoryContext } from "@/app/context/CategoryContext"; 
import { useTheme } from "@/app/context/ThemeContext";
import { useModal } from "@/app/context/ModalContext";
import Link from "next/link";

export default function CreateCategoryPage() {
  const { addCategory } = useCategoryContext();
  const { theme } = useTheme();
  const { showAlert } = useModal();
  const router = useRouter();
  
  const [formData, setFormData] = useState({ nama: "", deskripsi: "" });

  useEffect(() => {
    const currentRole = localStorage.getItem("currentRole");
    if (currentRole !== "admin") router.push("/");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory(formData);
    router.push("/admin/categories");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className={`p-8 rounded-[2.5rem] shadow-xl border ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
        <h2 className={`text-2xl font-black mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Tambah Kategori Baru</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className={`block text-sm font-bold mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Nama Kategori</label>
                <input type="text" required className={`w-full p-4 rounded-2xl border-2 outline-none font-medium ${theme === 'light' ? 'bg-sky-50/50 border-sky-100 focus:ring-teal-500' : 'bg-gray-800 border-gray-700 text-white'}`} value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
            </div>
            <div>
                <label className={`block text-sm font-bold mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Deskripsi</label>
                <textarea className={`w-full p-4 rounded-2xl border-2 outline-none font-medium ${theme === 'light' ? 'bg-sky-50/50 border-sky-100 focus:ring-teal-500' : 'bg-gray-800 border-gray-700 text-white'}`} value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} />
            </div>
            <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition">Simpan</button>
                <Link href="/admin/categories" className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl text-center transition">Batal</Link>
            </div>
        </form>
      </div>
    </div>
  );
}