"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { usePayment } from "../context/PaymentContext";
import { useTheme } from "../context/ThemeContext";
import { useModal } from "../context/ModalContext"; 
import { useRouter } from "next/navigation";
import PaymentMethodSelector from "../components/PaymentMethodSelector"; 

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, getCurrentUserData } = useAuth();
  const { createTransaction } = usePayment();
  const { theme } = useTheme();
  const { showAlert, showConfirm } = useModal(); 
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State baru untuk menandai pembayaran sukses agar tidak ditendang balik ke cart
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false); 

  // Redirect jika keranjang kosong (HANYA JIKA belum sukses bayar)
  useEffect(() => {
    if (cart.length === 0 && !isPaymentSuccess) {
        router.push("/cart");
    }
  }, [cart, router, isPaymentSuccess]);

  const handlePayment = () => {
    if (!selectedMethod) {
        showAlert("Mohon pilih metode pembayaran terlebih dahulu!", "error");
        return;
    }

    showConfirm("Apakah Anda yakin ingin memproses pembayaran ini?", () => {
        setIsProcessing(true);
        const userData = getCurrentUserData();

        setTimeout(() => {
            // 1. Buat Transaksi dan ambil ID-nya
            const orderId = createTransaction(cart, cartTotal, selectedMethod, {
                nama: userData?.nama || "Guest",
                email: userData?.email || "guest@email.com",
                whatsapp: userData?.whatsapp || "-"
            });

            // 2. Set flag sukses AGAR useEffect tidak melempar ke cart
            setIsPaymentSuccess(true); 

            // 3. Kosongkan keranjang
            clearCart(); 

            // 4. Redirect manual ke Invoice
            router.push(`/invoice/${orderId}`);
            
        }, 1500);
    });
  };

  const formatRupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

  // Jika sedang loading sukses, jangan render apa-apa agar transisi mulus
  if (isPaymentSuccess) return null; 

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      
      <div className="mb-8">
        <h1 className={`text-3xl font-black mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            Checkout Pembayaran
        </h1>
        <p className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>
            Selesaikan pembayaran Anda untuk memproses pesanan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BAGIAN KIRI: METODE PEMBAYARAN */}
        <div className="lg:col-span-2 space-y-6">
            <PaymentMethodSelector 
                selected={selectedMethod} 
                onSelect={setSelectedMethod} 
            />
            
            {/* Info Tambahan */}
            <div className={`p-6 rounded-3xl border flex items-start gap-4 ${theme === 'light' ? 'bg-blue-50 border-blue-100' : 'bg-blue-900/20 border-blue-800'}`}>
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                </div>
                <div>
                    <h4 className={`font-bold mb-1 ${theme === 'light' ? 'text-blue-900' : 'text-blue-100'}`}>Informasi Penting</h4>
                    <p className={`text-sm ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                        Pastikan saldo Anda mencukupi. Pesanan akan diproses otomatis setelah pembayaran terverifikasi.
                    </p>
                </div>
            </div>
        </div>

        {/* BAGIAN KANAN: RINGKASAN PESANAN */}
        <div className="lg:col-span-1">
            <div className={`p-6 rounded-3xl border sticky top-24 transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100 shadow-xl shadow-sky-100/50' : 'bg-gray-900 border-gray-800 shadow-xl'}`}>
                <h3 className={`text-lg font-black mb-6 pb-4 border-b ${theme === 'light' ? 'text-gray-900 border-gray-100' : 'text-white border-gray-800'}`}>
                    Ringkasan Pesanan
                </h3>
                
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className={`font-bold px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-300'}`}>
                                    {item.quantity}x
                                </span>
                                <span className={`truncate ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{item.nama}</span>
                            </div>
                            <span className={`font-bold whitespace-nowrap ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                {formatRupiah(item.harga * item.quantity)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-dashed border-gray-300 pt-6 mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Total Bayar</span>
                    </div>
                    <div className={`text-3xl font-black break-all ${theme === 'light' ? 'text-teal-600' : 'text-teal-400'}`}>
                        {formatRupiah(cartTotal)}
                    </div>
                </div>

                <button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition transform hover:-translate-y-1 flex justify-center items-center gap-2
                    ${isProcessing 
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                        : 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/30'}`}
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses...
                        </>
                    ) : (
                        <>
                            Bayar Sekarang
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </>
                    )}
                </button>
                
                <p className="text-xs text-center mt-4 text-gray-400">
                    Transaksi aman dan terenkripsi.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}