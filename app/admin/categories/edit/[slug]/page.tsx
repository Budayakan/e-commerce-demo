"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCategoryContext } from "@/app/context/CategoryContext"; 
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link";

export default function EditCategoryPage() {
  const { getCategoryBySlug, updateCategory } = useCategoryContext();
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  
  // Ambil slug dari URL
  const slug = params.slug as string;
  
  const [formData, setFormData] = useState({ nama: "", deskripsi: "" });

  // Load Data Kategori by Slug
  useEffect(() => {
    if (slug) {
        const cat = getCategoryBySlug(slug);
        if (cat) {
            setFormData({ nama: cat.nama, deskripsi: cat.deskripsi || "" });
        }
    }
  }, [slug, getCategoryBySlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCategory(slug, formData); // Update by slug
    router.push("/admin/categories");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className={`p-8 rounded-[2.5rem] shadow-xl border transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
        <div className="mb-8 text-center">
          <h2 className={`text-3xl font-black mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Edit Kategori</h2>
          <p className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Perbarui nama atau deskripsi kategori.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Nama Kategori</label>
                <input type="text" required className={`w-full p-4 rounded-2xl border-2 outline-none font-medium transition ${theme === 'light' ? 'bg-sky-50/50 border-sky-100 focus:ring-teal-500 focus:border-teal-500 text-gray-900' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400'}`} value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
            </div>
            <div>
                <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Deskripsi</label>
                <textarea rows={4} className={`w-full p-4 rounded-2xl border-2 outline-none font-medium resize-none transition ${theme === 'light' ? 'bg-sky-50/50 border-sky-100 focus:ring-teal-500 focus:border-teal-500 text-gray-900' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400'}`} value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} />
            </div>
            <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-2xl transition shadow-lg transform hover:-translate-y-0.5">Simpan Perubahan</button>
                <Link href="/admin/categories" className={`flex-1 font-bold py-3.5 rounded-2xl text-center transition border-2 ${theme === 'light' ? 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}>Batal</Link>
            </div>
        </form>
      </div>
    </div>
  );
}