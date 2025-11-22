"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useParams
import { useProductContext } from "@/app/context/ProductContext";
import { useCart } from "@/app/context/CartContext"; 
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useModal } from "@/app/context/ModalContext";
import { Product } from "@/types";
import Link from "next/link";

export default function ProductDetail() {
  const { getProductBySlug } = useProductContext(); // Pastikan pakai getProductBySlug
  const { addToCart } = useCart(); 
  const { user } = useAuth();
  const { theme } = useTheme();
  const { showAlert } = useModal();
  const params = useParams();
  const router = useRouter();
  
  // PENTING: Pastikan nama variabel ini sesuai dengan nama folder '[slug]'
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (slug) {
        // Decode slug jika ada karakter spesial (misal spasi jadi %20)
        const decodedSlug = decodeURIComponent(slug);
        const foundProduct = getProductBySlug(decodedSlug);
        
        if (foundProduct) {
            if (!product || product.slug !== foundProduct.slug) {
                setProduct(foundProduct);
                if (foundProduct.photos && foundProduct.photos.length > 0) {
                    setActiveImage(foundProduct.photos[0]);
                }
            }
        }
    }
  }, [slug, getProductBySlug, product]);

  const handleBuy = () => {
    if (!user) {
        showAlert("Silakan login terlebih dahulu.", "info");
        router.push("/login"); 
    } else if (product) {
        addToCart(product); 
    }
  };

  // Jika produk tidak ditemukan di Context (tapi halaman file-nya ada)
  if (!product) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Barang tidak ditemukan</h2>
            <p className="text-gray-500 mb-6">Link mungkin salah atau barang sudah dihapus.</p>
            <Link href="/" className="bg-teal-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">Kembali ke Katalog</Link>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-600 font-bold mb-8 transition">
        <span>← Kembali ke Katalog</span>
      </Link>

      <div className={`rounded-[3rem] shadow-xl border overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
        
        {/* Galeri Foto */}
        <div className={`p-8 flex flex-col gap-6 ${theme === 'light' ? 'bg-gradient-to-br from-teal-50 to-sky-50' : 'bg-gradient-to-br from-gray-800 to-gray-900'}`}>
            <div className={`aspect-square rounded-3xl overflow-hidden shadow-lg border-4 relative group ${theme === 'light' ? 'border-white bg-white' : 'border-gray-700 bg-gray-800'}`}>
                {activeImage ? (
                    <img src={activeImage} alt={product.nama} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-black opacity-20">{product.nama.charAt(0)}</div>
                )}
            </div>
            
            {product.photos && product.photos.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {product.photos.map((photo, index) => (
                        <button key={index} onClick={() => setActiveImage(photo)} className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${activeImage === photo ? 'border-teal-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                            <img src={photo} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Info Produk */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-2">
               <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase">{product.kategori}</span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-black mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{product.nama}</h1>
            <p className="text-3xl font-bold text-teal-500 mb-6">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(product.harga)}
            </p>
            
            <div className={`p-6 rounded-2xl border mb-8 ${theme === 'light' ? 'bg-gray-50 border-gray-100 text-gray-600' : 'bg-gray-800 border-gray-700 text-gray-300'}`}>
                <h3 className="font-bold mb-2">Deskripsi</h3>
                <p className="leading-relaxed whitespace-pre-wrap">{product.deskripsi}</p>
            </div>

            <button onClick={handleBuy} className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition transform hover:-translate-y-1">
                Beli Sekarang
            </button>
        </div>
      </div>
    </div>
  );
}