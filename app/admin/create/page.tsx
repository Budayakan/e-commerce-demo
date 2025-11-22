"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductContext } from "@/app/context/ProductContext";
import { useCategoryContext } from "@/app/context/CategoryContext"; // Import Context Kategori
import { useTheme } from "@/app/context/ThemeContext";
import { useModal } from "@/app/context/ModalContext";
import Link from "next/link";

export default function CreatePage() {
  const { addProduct } = useProductContext();
  const { categories } = useCategoryContext(); // Ambil data kategori real
  const { theme } = useTheme();
  const { showAlert, showConfirm } = useModal();
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama: "",
    harga: "",
    jumlah: "",
    kategori: "", // Kosongkan dulu
    deskripsi: "",
    photos: [] as string[]
  });

  // Proteksi Halaman & Cek Kategori
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const currentRole = localStorage.getItem("currentRole");
    
    // 1. Cek Login
    if (!currentUser) {
      router.push("/login");
      return;
    }

    // 2. Cek Admin
    if (currentRole !== "admin") {
      showAlert("AKSES DITOLAK: Anda bukan Admin!", "error");
      router.push("/");
      return;
    }

    // 3. CEK KATEGORI (Logika Baru)
    // Jika kategori kosong, paksa user buat kategori dulu
    if (categories.length === 0) {
        showConfirm("Belum ada kategori! Anda harus membuat kategori terlebih dahulu sebelum menambah barang.", () => {
            router.push("/admin/categories/create");
        });
        // Jika user batal/close modal, kembalikan ke dashboard agar tidak stuck
        setTimeout(() => {
             // Optional: redirect jika user tidak merespon confirm (opsional)
        }, 1000);
    } else {
        // Jika ada kategori, set default kategori ke yang pertama
        setFormData(prev => ({ ...prev, kategori: categories[0].nama }));
    }
  }, [router, showAlert, showConfirm, categories]); // Dependency categories penting disini

  // Jika kategori kosong, jangan render form (tunggu redirect)
  if (categories.length === 0) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (formData.photos.length + files.length > 10) {
      showAlert("Maksimal 10 foto per barang!", "error");
      return;
    }

    const newPhotos: string[] = [];
    const fileReaders: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 500 * 1024) {
        showAlert(`File ${file.name} terlalu besar! Max 500KB.`, "error");
        return;
      }

      const reader = new FileReader();
      const promise = new Promise<void>((resolve) => {
        reader.onloadend = () => {
          if (reader.result) newPhotos.push(reader.result as string);
          resolve();
        };
      });
      reader.readAsDataURL(file);
      fileReaders.push(promise);
    });

    Promise.all(fileReaders).then(() => {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    });
  };

  const removePhoto = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.photos.length === 0) {
      showAlert("Wajib upload minimal 1 foto barang!", "error");
      return;
    }

    addProduct({
      nama: formData.nama,
      harga: Number(formData.harga),
      jumlah: Number(formData.jumlah),
      kategori: formData.kategori,
      deskripsi: formData.deskripsi,
      photos: formData.photos
    });

    showAlert("Barang berhasil ditambahkan ke katalog!", "success");
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 pb-20 px-4">
      <div className={`p-8 md:p-12 rounded-[2.5rem] shadow-xl border transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
        
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-2 pb-4 gap-4 ${theme === 'light' ? 'border-sky-50' : 'border-gray-800'}`}>
            <div>
                <h2 className={`text-3xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Tambah Barang</h2>
                <p className={`font-medium mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Pastikan kategori sudah sesuai.</p>
            </div>
            <Link href="/" className={`px-5 py-3 rounded-full font-bold transition text-sm ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}>
                Batal
            </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section Upload Foto (Sama) */}
          <div className={`md:col-span-2 p-6 rounded-2xl border ${theme === 'light' ? 'bg-sky-50/30 border-sky-100' : 'bg-gray-800/50 border-gray-700'}`}>
            <label className={`block text-sm font-bold mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Foto Barang (Min 1, Max 10)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-white shadow-sm group">
                  <img src={photo} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-600"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg></button>
                </div>
              ))}
              {formData.photos.length < 10 && (
                <label className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition ${theme === 'light' ? 'border-teal-300 bg-white hover:bg-teal-50 text-teal-500' : 'border-teal-700 bg-gray-800 hover:bg-gray-700 text-teal-400'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wide">Upload</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Input Nama */}
          <div className="md:col-span-2">
            <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Nama Barang</label>
            <input type="text" required className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium ${theme === 'light' ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:ring-teal-500' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400'}`} value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Nama Lengkap Produk" />
          </div>

          {/* Input Kategori (DINAMIS DARI CONTEXT) */}
          <div className="md:col-span-2">
            <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Kategori</label>
            <div className="relative">
                <select 
                    required 
                    className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium appearance-none cursor-pointer ${theme === 'light' ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:ring-teal-500' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400'}`}
                    value={formData.kategori} 
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                >
                    {/* Render kategori dari Context, bukan hardcode */}
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.nama}>{cat.nama}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            {categories.length === 0 && <p className="text-red-500 text-xs mt-1">Belum ada kategori. Silakan buat dulu.</p>}
          </div>

          {/* Input Harga & Stok */}
          <div>
            <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Harga (Rp)</label>
            <input type="number" required className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium ${theme === 'light' ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:ring-teal-500' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400'}`} value={formData.harga} onChange={(e) => setFormData({ ...formData, harga: e.target.value })} placeholder="0" />
          </div>
          <div>
            <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Stok</label>
            <input type="number" required className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium ${theme === 'light' ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:ring-teal-500' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400'}`} value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })} placeholder="0" />
          </div>

          {/* Deskripsi */}
          <div className="md:col-span-2">
            <label className={`block text-sm font-bold mb-2 ml-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Deskripsi</label>
            <textarea required rows={4} className={`w-full p-4 rounded-2xl border-2 transition outline-none font-medium resize-none ${theme === 'light' ? 'bg-sky-50/50 border-sky-100 text-gray-900 focus:ring-teal-500' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-400'}`} value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} placeholder="Jelaskan detail spesifikasi barang..." />
          </div>

          <div className="md:col-span-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold text-lg py-4 rounded-2xl transition shadow-lg shadow-gray-400/50 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                Simpan Barang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}