"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProductContext } from "./context/ProductContext";
import { useCategoryContext } from "./context/CategoryContext"; // Import Context Kategori
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext"; 
import { useTheme } from "./context/ThemeContext";
import { useModal } from "./context/ModalContext"; 
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { products, deleteProduct } = useProductContext();
  const { categories } = useCategoryContext();
  const { user, role } = useAuth();
  const { addToCart } = useCart(); 
  const { theme } = useTheme(); 
  const { showConfirm, showAlert } = useModal(); 
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 1. Filter Produk (Search + Kategori)
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "Semua" || item.kategori === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Reset halaman saat filter berubah
  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCategory]);

  // 2. Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatRupiah = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price);
  
  // Navigasi menggunakan SLUG
  const goToDetail = (slug: string) => router.push(`/product/${slug}`);
  
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    showConfirm("Apakah Anda yakin ingin menghapus barang ini secara permanen?", () => {
      deleteProduct(id);
      setTimeout(() => { showAlert("Barang berhasil dihapus dari katalog!", "success"); }, 300);
    });
  };

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (!user) {
      router.push("/login");
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="-mt-6">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-12">
        <Image 
            src="/hero-image.jpg" 
            alt="Hero Background" 
            fill 
            className="object-cover" 
            priority 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-teal-900/30 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            Toko Warga <span className="text-teal-400">Digital</span>
          </h1>
          <p className="text-lg md:text-xl text-teal-100 max-w-2xl mb-8 font-medium">
            Belanja kebutuhan harian terlengkap dengan harga warga.
          </p>
        </div>
      </div>

      {/* --- CATALOG SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
           <h2 className={`text-3xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
             🔥 Kategori & Produk
           </h2>
           
           <div className="flex gap-4 w-full md:w-auto">
             <input 
                type="text" 
                placeholder="Cari barang..." 
                className={`w-full md:w-80 border-2 rounded-full px-6 py-3 font-medium focus:ring-teal-500 focus:border-teal-500 outline-none transition ${theme === 'light' ? 'bg-white border-sky-200 text-gray-900' : 'bg-gray-800 border-gray-700 text-white'}`}
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
             />
             {role === "admin" && (
              <Link href="/admin/create" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-bold shadow-lg whitespace-nowrap flex items-center gap-2 transition transform hover:-translate-y-0.5">
                + Jual Barang
              </Link>
             )}
           </div>
        </div>

        {/* --- TAB KATEGORI DINAMIS --- */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-6 scrollbar-hide">
            <button 
                onClick={() => setSelectedCategory("Semua")}
                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition border-2 ${
                    selectedCategory === "Semua"
                    ? 'bg-teal-500 border-teal-500 text-white shadow-md'
                    : (theme === 'light' ? 'bg-white border-sky-100 text-gray-600 hover:border-teal-300' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-teal-500')
                }`}
            >
                Semua
            </button>
            {categories.map((cat) => (
                <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.nama)}
                    className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition border-2 ${
                        selectedCategory === cat.nama
                        ? 'bg-teal-500 border-teal-500 text-white shadow-md'
                        : (theme === 'light' ? 'bg-white border-sky-100 text-gray-600 hover:border-teal-300' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-teal-500')
                    }`}
                >
                    {cat.nama}
                </button>
            ))}
        </div>

        {/* --- GRID PRODUK (Horizontal Scroll di Mobile) --- */}
        {filteredProducts.length === 0 ? (
           <div className={`p-12 rounded-3xl text-center shadow-xl border transition-colors ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
             <div className="text-6xl mb-4 opacity-50">📦</div>
             <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>
                 {selectedCategory !== "Semua" ? `Tidak ada barang di kategori "${selectedCategory}"` : "Barang tidak ditemukan"}
             </h3>
             <p className="text-gray-500 mt-2">Coba cari kata kunci lain atau ganti kategori.</p>
           </div>
        ) : (
          // UBAH DISINI: Flex pada mobile (overflow-x-auto), Grid pada tablet/desktop (sm:grid)
          <div className="flex flex-nowrap overflow-x-auto gap-6 pb-8 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:overflow-visible sm:pb-0 snap-x snap-mandatory scrollbar-hide">
            {currentItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => goToDetail(item.slug)} 
                // UBAH DISINI: Tambahkan min-width agar card tidak gepeng di mobile
                className={`group min-w-[280px] sm:min-w-0 flex-shrink-0 snap-center rounded-3xl overflow-hidden shadow-sm border transition-all duration-300 flex flex-col cursor-pointer hover:shadow-xl hover:-translate-y-1 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}
              >
                
                {/* Gambar Produk */}
                <div className={`h-56 relative overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                   {item.photos && item.photos.length > 0 ? (
                     <img 
                        src={item.photos[0]} 
                        alt={item.nama} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-500/30 text-6xl font-black">
                        {item.nama.charAt(0).toUpperCase()}
                     </div>
                   )}
                   
                   {/* Badge Kategori */}
                   {item.kategori && (
                     <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-sm">
                        {item.kategori}
                     </div>
                   )}
                </div>
                
                {/* Info Produk */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className={`font-bold text-xl mb-1 line-clamp-1 group-hover:text-teal-600 transition ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{item.nama}</h3>
                  <p className="font-black text-xl text-teal-600 mb-3">{formatRupiah(item.harga)}</p>
                  <p className={`text-sm line-clamp-2 flex-grow mb-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{item.deskripsi}</p>
                  
                  <div className={`flex flex-col mt-auto pt-4 border-t ${theme === 'light' ? 'border-gray-100' : 'border-gray-800'}`}>
                    <div className={`flex justify-between text-sm mb-3 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span>Stok: {item.jumlah}</span>
                    </div>

                    {role === "admin" ? (
                        <div className="flex gap-2 w-full">
                            <Link href={`/admin/edit/${item.slug}`} onClick={(e) => e.stopPropagation()} className="flex-1 text-center bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-bold hover:bg-blue-100">Edit</Link>
                            <button onClick={(e) => handleDelete(e, item.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-bold hover:bg-red-100">Hapus</button>
                        </div>
                    ) : (
                        <button 
                            onClick={(e) => handleAddToCart(e, item)}
                            className={`w-full py-3 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-black text-white hover:bg-gray-800' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                            + Keranjang
                        </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {filteredProducts.length > itemsPerPage && (
            <div className="flex justify-center mt-12 gap-3">
               <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`px-4 py-2 rounded-full border disabled:opacity-50 transition ${theme === 'light' ? 'bg-white border-sky-200 text-teal-600 hover:bg-sky-50' : 'bg-gray-800 border-teal-900 text-teal-400 hover:bg-gray-700'}`}>Prev</button>
               <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-full border disabled:opacity-50 transition ${theme === 'light' ? 'bg-white border-sky-200 text-teal-600 hover:bg-sky-50' : 'bg-gray-800 border-teal-900 text-teal-400 hover:bg-gray-700'}`}>Next</button>
            </div>
        )}
      </div>

      {/* --- NEWSLETTER SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 mb-16 mt-20">
        <div className={`rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl transition-colors duration-300 ${theme === 'light' ? 'bg-white border-2 border-sky-100 text-gray-900' : 'bg-black text-white'}`}>
            <div className={`absolute top-0 left-0 w-full h-full opacity-20 ${theme === 'light' ? 'bg-gradient-to-br from-sky-100 to-teal-50' : 'bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-500 via-gray-900 to-black'}`}></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className={`text-3xl md:text-5xl font-black mb-6 leading-tight ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Jangan Lewatkan <br/><span className="text-teal-500">Promo Spesial!</span>
              </h2>
              <p className={`mb-10 text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Berlangganan newsletter kami untuk mendapatkan update produk terbaru.
              </p>
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Masukkan alamat email Anda..." className={`flex-1 px-6 py-4 rounded-full border focus:ring-4 focus:ring-teal-500 outline-none transition text-lg ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white' : 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'}`} />
                  <button className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg transform hover:-translate-y-1">Langganan</button>
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}