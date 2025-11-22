"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import Link from "next/link";

export default function TrackOrderPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      // Redirect ke halaman invoice berdasarkan ID
      router.push(`/invoice/${orderId}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className={`text-center p-10 rounded-[3rem] shadow-2xl border transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
        
        <div className="mb-8">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${theme === 'light' ? 'bg-teal-50 text-teal-600' : 'bg-gray-800 text-teal-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
            <h1 className={`text-3xl font-black mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Lacak Pesanan</h1>
            <p className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Masukkan ID Pesanan Anda untuk melihat status pengiriman dan pembayaran.</p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
            <div>
                <input 
                    type="text" 
                    placeholder="Contoh: 17637832..." 
                    className={`w-full px-6 py-4 rounded-2xl border-2 text-center text-lg font-mono tracking-widest outline-none transition focus:ring-4 ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900 focus:border-teal-500 focus:ring-teal-500/20' : 'bg-gray-800 border-gray-700 text-white focus:border-teal-500 focus:ring-teal-500/20 placeholder-gray-600'}`}
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                />
            </div>
            <button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" /></svg>
                Cek Status
            </button>
        </form>

        <div className="mt-8 pt-8 border-t border-dashed border-gray-200 dark:border-gray-800">
            <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                Lupa ID Pesanan? Cek riwayat di <Link href="/profile" className="text-teal-500 font-bold hover:underline">Profil Saya</Link>
            </p>
        </div>

      </div>
    </div>
  );
}