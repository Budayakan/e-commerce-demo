"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useModal } from "../context/ModalContext"; 
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme(); 
  const { showConfirm, showAlert } = useModal(); 
  const router = useRouter();

  const formatRupiah = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login");
    }
  }, [router]);

  if (!user) return null;

  // --- HANDLERS ---

  // 1. LOGIKA BARU: Handle Tombol Minus (-)
  const handleDecrease = (id: number, currentQty: number) => {
    if (currentQty === 1) {
      // Jika jumlah tinggal 1, minta konfirmasi hapus
      showConfirm("Apakah Anda yakin ingin menghapus barang ini dari keranjang?", () => {
        removeFromCart(id);
        // Gunakan timeout agar popup sukses muncul setelah konfirmasi tutup
        setTimeout(() => {
            showAlert("Barang berhasil dihapus dari keranjang.", "success");
        }, 300);
      });
    } else {
      // Jika jumlah > 1, kurangi saja
      updateQuantity(id, currentQty - 1);
    }
  };

  const handleRemoveItem = (id: number) => {
    showConfirm("Apakah Anda yakin ingin menghapus barang ini dari keranjang?", () => {
      removeFromCart(id);
      setTimeout(() => {
        showAlert("Barang berhasil dihapus.", "success");
      }, 300);
    });
  };

  const handleClearCart = () => {
    showConfirm("Apakah Anda yakin ingin menghapus SEMUA barang di keranjang?", () => {
      clearCart();
      setTimeout(() => {
        showAlert("Keranjang berhasil dikosongkan.", "success");
      }, 300);
    });
  };

  const handleCheckout = () => {
     router.push("/checkout");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20">
      
      {/* Header */}
      <h1 className={`text-3xl font-black mb-8 flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
        <div className={`p-2 rounded-xl ${theme === 'light' ? 'bg-teal-50' : 'bg-gray-800'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-teal-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
        </div>
        Keranjang Belanja
      </h1>

      {cart.length === 0 ? (
        <div className={`rounded-[2.5rem] p-12 text-center shadow-lg border transition-colors duration-300 flex flex-col items-center justify-center gap-4 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
          <div className="text-8xl mb-2 opacity-50">🛒</div>
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-700' : 'text-white'}`}>Keranjang Anda Kosong</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Sepertinya Anda belum menambahkan barang apapun. Yuk, cari barang kebutuhanmu sekarang!</p>
          <Link href="/" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-teal-500/30 transition transform hover:-translate-y-1">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List Items (Kiri) */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className={`rounded-3xl p-4 shadow-sm border flex flex-col sm:flex-row items-center gap-5 transition hover:shadow-md ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
                
                {/* Gambar Produk */}
                <div className={`w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 relative border-2 ${theme === 'light' ? 'bg-gray-100 border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
                  {item.photos && item.photos.length > 0 ? (
                    <img src={item.photos[0]} alt={item.nama} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-500 font-black text-3xl">
                      {item.nama.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info Produk */}
                <div className="flex-grow text-center sm:text-left w-full min-w-0">
                  <h3 className={`font-bold text-lg mb-1 line-clamp-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{item.nama}</h3>
                  <p className="text-teal-500 font-black text-lg">{formatRupiah(item.harga)}</p>
                  
                  {/* Kontrol Kuantitas Mobile */}
                  <div className="sm:hidden flex justify-center mt-3">
                     <div className={`flex items-center gap-3 rounded-xl p-1.5 ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-800 border border-gray-700'}`}>
                        {/* Tombol Minus menggunakan handleDecrease */}
                        <button 
                            onClick={() => handleDecrease(item.id, item.quantity)} 
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition font-bold ${theme === 'light' ? 'bg-white shadow-sm text-gray-600 hover:bg-gray-100' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >-</button>
                        <span className={`w-8 text-center font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition font-bold ${theme === 'light' ? 'bg-white shadow-sm text-gray-600 hover:bg-gray-100' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >+</button>
                    </div>
                  </div>
                </div>

                {/* Kontrol Kuantitas Desktop & Hapus */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className={`hidden sm:flex items-center gap-3 rounded-xl p-1.5 ${theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-800 border border-gray-700'}`}>
                        {/* Tombol Minus menggunakan handleDecrease */}
                        <button 
                            onClick={() => handleDecrease(item.id, item.quantity)} 
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition font-bold ${theme === 'light' ? 'bg-white shadow-sm text-gray-600 hover:bg-gray-100' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >-</button>
                        <span className={`w-8 text-center font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{item.quantity}</span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition font-bold ${theme === 'light' ? 'bg-white shadow-sm text-gray-600 hover:bg-gray-100' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                        >+</button>
                    </div>

                    <button 
                        onClick={() => handleRemoveItem(item.id)} 
                        className="text-red-400 hover:text-red-600 text-sm font-bold flex items-center gap-1 transition px-2 py-1 rounded hover:bg-red-50/10"
                        title="Hapus Barang"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        Hapus
                    </button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end mt-4">
                <button onClick={handleClearCart} className="text-red-500 text-sm hover:underline font-bold flex items-center gap-1 transition hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                    Kosongkan Semua
                </button>
            </div>
          </div>

          {/* Ringkasan Belanja */}
          <div className={`rounded-[2.5rem] p-8 shadow-xl border h-fit sticky top-24 transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
            <h3 className={`text-xl font-black mb-6 pb-4 border-b ${theme === 'light' ? 'text-gray-900 border-gray-100' : 'text-white border-gray-800'}`}>
                Ringkasan Belanja
            </h3>
            
            <div className={`flex justify-between mb-3 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              <span>Total Barang</span>
              <span className="font-bold">{cart.reduce((a,b)=>a+b.quantity,0)} pcs</span>
            </div>
            
            <div className="flex flex-col gap-1 mb-8 border-t pt-4 border-dashed border-gray-200">
                <span className={`text-sm font-bold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Tagihan</span>
                <span className={`text-2xl md:text-3xl font-black break-all ${theme === 'light' ? 'text-teal-600' : 'text-teal-400'}`}>
                    {formatRupiah(cartTotal)}
                </span>
            </div>

            <button 
                onClick={handleCheckout} 
                className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-gray-400/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 border border-gray-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043 3.296A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>
                Checkout
            </button>
            <p className="text-xs text-center mt-4 text-gray-400 font-medium">Pembayaran aman & terpercaya.</p>
          </div>

        </div>
      )}
    </div>
  );
}