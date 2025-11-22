"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../../types"; 
import { useModal } from "./ModalContext"; // Import useModal untuk notifikasi

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "slug">) => void;
  updateProduct: (slug: string, updatedProduct: Omit<Product, "id" | "slug">) => void;
  deleteProduct: (id: number) => void;
  getProductBySlug: (slug: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const { showAlert } = useModal(); // Gunakan Modal Custom
  const STORAGE_KEY = "data_barang_ecommerce";

  // Helper membuat slug URL-friendly dari nama produk
  const createSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/ /g, '-') // Ganti spasi dengan strip
      .replace(/[^\w-]+/g, '') // Hapus karakter non-alphanumeric
      + '-' + Date.now(); // Tambah timestamp agar unik
  };

  // Load data saat aplikasi dimulai
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Migrasi data lama: Jika ada data yang belum punya slug, buatkan slug-nya
        const migratedData = parsedData.map((item: any) => ({
            ...item,
            slug: item.slug || createSlug(item.nama)
        }));
        setProducts(migratedData);
      } catch (error) {
        console.error("Gagal memuat data produk:", error);
      }
    }
  }, []);

  // Helper untuk menyimpan ke LocalStorage dengan Error Handling
  const saveToStorage = (data: Product[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // Jika localStorage penuh (biasanya limit 5MB), tampilkan popup error
      showAlert("Penyimpanan Penuh! Kurangi jumlah atau ukuran foto produk.", "error");
    }
  };

  // --- CRUD OPERATIONS ---

  // Create
  const addProduct = (data: Omit<Product, "id" | "slug">) => {
    const newProduct = { 
        id: Date.now(), 
        slug: createSlug(data.nama), // Auto-generate slug
        ...data 
    };
    // Tambahkan produk baru di awal array (paling atas)
    const newList = [newProduct, ...products];
    setProducts(newList);
    saveToStorage(newList);
  };

  // Update
  const updateProduct = (slug: string, data: Omit<Product, "id" | "slug">) => {
    const newList = products.map((p) => {
        if (p.slug === slug) {
            return { 
                ...p, 
                ...data 
                // Catatan: Slug tidak diubah meskipun nama berubah untuk menjaga link SEO/Bookmark user
            }; 
        }
        return p;
    });
    setProducts(newList);
    saveToStorage(newList);
  };

  // Delete
  const deleteProduct = (id: number) => {
    const newList = products.filter((p) => p.id !== id);
    setProducts(newList);
    saveToStorage(newList);
    // Notifikasi sukses biasanya dipanggil di UI setelah konfirmasi
  };

  // Read One (By Slug)
  const getProductBySlug = (slug: string) => {
    // Decode slug jika ada karakter spesial URL
    const decodedSlug = decodeURIComponent(slug);
    return products.find((p) => p.slug === decodedSlug);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductBySlug }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProductContext must be used within a ProductProvider");
  return context;
};