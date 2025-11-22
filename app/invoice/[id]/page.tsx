"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePayment } from "@/app/context/PaymentContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useModal } from "@/app/context/ModalContext"; // Import Modal
import CountdownTimer from "@/app/components/CountdownTimer"; 
import Link from "next/link";

export default function InvoicePage() {
  const { getTransactionById, markAsExpired } = usePayment();
  const { theme } = useTheme();
  const { showAlert } = useModal(); // Gunakan showAlert
  const params = useParams();
  const id = params.id as string;

  const transaction = getTransactionById(id);
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  // --- LOGIKA COUNTDOWN ---
  useEffect(() => {
    if (transaction) {
      if (transaction.paymentStatus === 'expired' || Date.now() > transaction.expiryTime) {
        setIsExpired(true);
        if (transaction.paymentStatus !== 'expired') {
            markAsExpired(transaction.id);
        }
      }
    }
  }, [transaction, markAsExpired]);

  const handleTimeout = () => {
    setIsExpired(true);
    if (transaction) {
        markAsExpired(transaction.id);
    }
  };

  // --- FUNGSI SALIN VA DENGAN POPUP ---
  const handleCopyVA = () => {
    if (transaction) {
        navigator.clipboard.writeText(`8800${transaction.id}`);
        showAlert("Nomor Virtual Account berhasil disalin!", "success");
    }
  };

  const handleConfirmPayment = () => {
    showAlert("Pembayaran sedang diverifikasi sistem. Mohon tunggu sebentar.", "info");
  };

  if (!transaction) {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <div className={`p-6 rounded-full mb-6 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Transaksi tidak ditemukan</h2>
            <Link href="/" className="bg-teal-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:-translate-y-1">Kembali ke Beranda</Link>
        </div>
    );
  }

  const formatRupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(n);

  // Template Instruksi Pembayaran
  const renderPaymentInstruction = () => {
    if (transaction.paymentMethod === "QRIS") {
        return (
            <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl mt-6 transition-colors ${theme === 'light' ? 'bg-teal-50 border-teal-200' : 'bg-gray-800/50 border-teal-800'}`}>
                 <div className="bg-white p-4 rounded-2xl shadow-sm">
                    {/* QR Code */}
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${transaction.id}`} alt="QRIS" className="w-48 h-48 md:w-56 md:h-56 mix-blend-multiply" />
                 </div>
                 <p className={`mt-6 text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${theme === 'light' ? 'text-teal-700' : 'text-teal-400'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" /></svg>
                    Scan untuk membayar
                 </p>
            </div>
        );
    } else {
        // Transfer Bank / E-Wallet
        return (
            <div className={`mt-6 p-6 md:p-8 rounded-3xl border transition-colors ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800/50 border-gray-700'}`}>
                <p className="text-sm text-gray-500 mb-3 font-bold uppercase tracking-wide">Nomor Virtual Account</p>
                
                {/* Container Nomor VA & Tombol Salin */}
                <div className={`flex flex-col sm:flex-row justify-between items-center p-4 rounded-2xl border mb-4 gap-4 ${theme === 'light' ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-900 border-gray-700'}`}>
                    <span className={`text-2xl md:text-3xl font-mono font-black tracking-widest break-all text-center sm:text-left ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        8800{transaction.id}
                    </span>
                    <button 
                        onClick={handleCopyVA} // Panggil fungsi popup disini
                        className="bg-teal-100 text-teal-700 hover:bg-teal-200 px-6 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                        SALIN
                    </button>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-opacity-50 border border-transparent">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${theme === 'light' ? 'bg-white text-gray-700' : 'bg-gray-700 text-white'}`}>
                        🏦
                    </div>
                    <div className="flex-1">
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Metode Pembayaran</p>
                        <p className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {transaction.paymentMethod} <span className="font-normal text-gray-500">a.n Toko Warga</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 md:py-10 px-4 pb-24">
      <div className={`rounded-[2.5rem] shadow-2xl overflow-hidden border transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
        
        {/* --- HEADER STATUS & TIMER --- */}
        <div className={`p-8 md:p-12 text-center relative overflow-hidden ${isExpired ? 'bg-red-500' : 'bg-teal-500'} text-white`}>
            <div className="relative z-10">
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-widest mb-2 opacity-95">
                    {isExpired ? "PESANAN HANGUS" : "MENUNGGU PEMBAYARAN"}
                </h2>
                
                {!isExpired && (
                    <div className="mt-8">
                        <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mb-4">Sisa Waktu Pembayaran</p>
                        <CountdownTimer targetDate={transaction.expiryTime} onExpire={handleTimeout} />
                    </div>
                )}
            </div>
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>

        <div className="p-6 md:p-12">
            
            {/* --- INFO PESANAN (Grid Responsif) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 border-b pb-10 border-dashed border-gray-300">
                <div className="text-center sm:text-left">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">ID Pesanan</p>
                    <p className={`text-xl md:text-2xl font-mono font-black tracking-tight ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>#{transaction.id}</p>
                </div>
                <div className="text-center sm:text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Tagihan</p>
                    <p className="text-2xl md:text-3xl font-black text-teal-500">{formatRupiah(transaction.totalAmount)}</p>
                </div>
            </div>

            {/* --- LIST BARANG --- */}
            <div className="mb-10">
                <h3 className={`font-bold mb-4 text-lg flex items-center gap-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                    Ringkasan Pesanan
                </h3>
                <div className={`rounded-2xl p-1 space-y-1 border ${theme === 'light' ? 'bg-gray-50 border-gray-100' : 'bg-gray-800/50 border-gray-700'}`}>
                    {transaction.items.map((item, idx) => (
                        <div key={idx} className={`flex justify-between items-center p-3 rounded-xl ${idx % 2 === 0 ? '' : (theme === 'light' ? 'bg-white' : 'bg-gray-800')}`}>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-gray-700 text-gray-300'}`}>{item.quantity}x</span>
                                <span className={`font-medium text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>{item.nama}</span>
                            </div>
                            <span className={`font-bold text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{formatRupiah(item.harga * item.quantity)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- INSTRUKSI / TOMBOL --- */}
            {!isExpired ? (
                <>
                    <h3 className={`font-bold text-lg flex items-center gap-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                        Instruksi Pembayaran
                    </h3>
                    {renderPaymentInstruction()}
                    
                    <div className="mt-12 text-center space-y-4">
                        <button 
                            onClick={handleConfirmPayment}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-teal-500/30 transition transform hover:-translate-y-1"
                        >
                            Saya Sudah Bayar
                        </button>
                        <Link href="/" className="block text-gray-400 hover:text-teal-500 text-sm font-bold transition py-2">
                            Belanja Lagi Nanti
                        </Link>
                    </div>
                </>
            ) : (
                <div className={`text-center p-8 rounded-3xl border flex flex-col items-center ${theme === 'light' ? 'bg-red-50 border-red-100' : 'bg-red-900/10 border-red-900'}`}>
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-3xl mb-4">⏳</div>
                    <h3 className="text-xl font-bold text-red-500 mb-2">Waktu Pembayaran Habis</h3>
                    <p className={`mb-8 max-w-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Maaf, pesanan ini telah dibatalkan otomatis oleh sistem karena batas waktu telah berakhir.</p>
                    <Link href="/" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition shadow-lg">
                        Mulai Belanja Lagi
                    </Link>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}