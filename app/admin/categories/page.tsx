"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategoryContext } from "@/app/context/CategoryContext";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useModal } from "@/app/context/ModalContext";
import Link from "next/link";

export default function ManageCategoriesPage() {
  const { categories, deleteCategory } = useCategoryContext();
  const { user, role } = useAuth(); 
  const { theme } = useTheme();
  const { showConfirm, showAlert } = useModal();
  const router = useRouter();

  // Proteksi Halaman
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const currentRole = localStorage.getItem("currentRole");
    if (!currentUser) { router.push("/login"); return; }
    if (currentRole !== "admin") { 
        showAlert("Akses Ditolak!", "error"); 
        router.push("/"); 
    }
  }, [router, showAlert]);

  const handleDelete = (id: number) => {
    showConfirm("Yakin ingin menghapus kategori ini?", () => {
      deleteCategory(id);
      setTimeout(() => showAlert("Kategori dihapus!", "success"), 300);
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Header Section */}
      <div 
        className={`p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 transition-all duration-300 
        ${theme === 'light' 
          ? 'bg-gradient-to-r from-teal-500 to-teal-600 shadow-teal-200' 
          : 'bg-black border-b-4 border-teal-500 shadow-black/50'
        }`}
      >
        <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              <span className={theme === 'light' ? 'text-teal-100' : 'text-teal-400'}>📁</span> Kelola Kategori
            </h2>
            <p className={`mt-1 font-medium ml-1 ${theme === 'light' ? 'text-teal-50' : 'text-gray-400'}`}>
              Atur kategori barang untuk memudahkan pencarian.
            </p>
        </div>
        <Link href="/admin/categories/create" className={`px-6 py-3 rounded-full shadow-lg transition flex items-center gap-2 text-sm font-bold transform hover:-translate-y-0.5 ring-2 ring-offset-2 ring-offset-transparent ${theme === 'light' ? 'bg-white text-teal-600 hover:bg-teal-50 ring-white/50' : 'bg-teal-500 text-white hover:bg-teal-600 ring-teal-500'}`}>
          + Tambah Kategori
        </Link>
      </div>

      {/* Tabel Kategori */}
      <div className={`rounded-[2.5rem] shadow-xl border overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-100 w-full">
            
            {/* Header Tabel */}
            <thead className={`transition-colors duration-300 ${theme === 'light' ? 'bg-teal-600 text-white' : 'bg-black text-teal-100'}`}>
                <tr>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap first:rounded-tl-[2.5rem]">No</th>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Nama Kategori</th>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Deskripsi</th>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap last:rounded-tr-[2.5rem]">Aksi</th>
                </tr>
            </thead>

            {/* Body Tabel */}
            <tbody className={`divide-y text-gray-700 font-medium ${theme === 'light' ? 'divide-sky-100 bg-white' : 'divide-gray-800 bg-gray-900'}`}>
                {categories.length === 0 ? (
                <tr>
                    <td colSpan={4} className={`px-6 py-16 text-center font-bold ${theme === 'light' ? 'text-gray-400 bg-gray-50/50' : 'text-gray-500 bg-gray-800/50'}`}>
                        Belum ada kategori.
                    </td>
                </tr>
                ) : (
                categories.map((cat, index) => (
                    <tr key={cat.id} className={`transition group ${theme === 'light' ? 'hover:bg-sky-50/50' : 'hover:bg-gray-800/50'}`}>
                    <td className={`px-6 py-5 text-sm whitespace-nowrap font-bold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{index + 1}</td>
                    <td className={`px-6 py-5 font-bold whitespace-nowrap group-hover:text-teal-500 transition ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{cat.nama}</td>
                    <td className={`px-6 py-5 whitespace-nowrap font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{cat.deskripsi || "-"}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex gap-2">
                            <Link href={`/admin/categories/edit/${cat.slug}`} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition">Edit</Link>
                            <button onClick={() => handleDelete(cat.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition">Hapus</button>
                        </div>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}