"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Category } from "../../types";
import { useModal } from "./ModalContext"; // Import Modal untuk notifikasi cantik

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, "id" | "slug">) => void;
  updateCategory: (slug: string, updatedCategory: Omit<Category, "id" | "slug">) => void;
  deleteCategory: (id: number) => void;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { showAlert } = useModal(); // Gunakan Modal Custom
  const STORAGE_KEY = "data_kategori_ecommerce";

  // Helper untuk membuat slug URL-friendly
  const createSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/ /g, '-') // Ganti spasi dengan strip
      .replace(/[^\w-]+/g, '') // Hapus karakter aneh
      + '-' + Date.now(); // Tambah timestamp agar unik
  };

  // Load data saat aplikasi mulai
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Migrasi data lama yang mungkin belum punya slug
        const migratedData = parsedData.map((item: any) => ({
          ...item,
          slug: item.slug || createSlug(item.nama)
        }));
        setCategories(migratedData);
      } catch (error) {
        console.error("Gagal memuat data kategori:", error);
      }
    } else {
      // Data Default jika kosong
      const defaultCategories = [
        { id: 1, slug: "elektronik-demo", nama: "Elektronik", deskripsi: "Gadget dan alat elektronik" },
        { id: 2, slug: "pakaian-demo", nama: "Pakaian", deskripsi: "Fashion pria dan wanita" },
        { id: 3, slug: "makanan-demo", nama: "Makanan", deskripsi: "Makanan ringan dan berat" }
      ];
      setCategories(defaultCategories);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
    }
  }, []);

  // Helper simpan ke storage
  const saveToStorage = (data: Category[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      showAlert("Penyimpanan Penuh! Gagal menyimpan data.", "error");
    }
  };

  // --- CRUD FUNCTIONS ---

  const addCategory = (data: Omit<Category, "id" | "slug">) => {
    const newCategory = { 
        id: Date.now(), 
        slug: createSlug(data.nama), 
        ...data 
    };
    const newList = [...categories, newCategory];
    setCategories(newList);
    saveToStorage(newList);
    
    // Tampilkan notifikasi sukses
    showAlert(`Kategori "${data.nama}" berhasil ditambahkan!`, "success");
  };

  const updateCategory = (slug: string, data: Omit<Category, "id" | "slug">) => {
    const newList = categories.map((c) => {
        if (c.slug === slug) {
            return { ...c, ...data }; 
        }
        return c;
    });
    setCategories(newList);
    saveToStorage(newList);

    // Tampilkan notifikasi sukses
    showAlert("Kategori berhasil diperbarui!", "success");
  };

  const deleteCategory = (id: number) => {
    const newList = categories.filter((c) => c.id !== id);
    setCategories(newList);
    saveToStorage(newList);
    // Notifikasi hapus biasanya dipanggil di UI setelah konfirmasi
  };

  const getCategoryBySlug = (slug: string) => {
    const decodedSlug = decodeURIComponent(slug);
    return categories.find((c) => c.slug === decodedSlug);
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, getCategoryBySlug }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error("useCategoryContext error");
  return context;
};