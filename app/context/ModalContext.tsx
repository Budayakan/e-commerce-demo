"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useTheme } from "./ThemeContext";

interface ModalContextType {
  showAlert: (message: string, type?: "success" | "error" | "info") => void;
  showConfirm: (message: string, onConfirm: () => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"alert" | "confirm">("alert");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  // Fungsi memunculkan Alert
  const showAlert = (msg: string, type: "success" | "error" | "info" = "info") => {
    setMessage(msg);
    setModalType("alert");
    setAlertType(type);
    setIsOpen(true);
  };

  // Fungsi memunculkan Konfirmasi
  const showConfirm = (msg: string, onConfirm: () => void) => {
    setMessage(msg);
    setModalType("confirm");
    setOnConfirmCallback(() => onConfirm); // Simpan fungsi yang akan dijalankan jika user klik "Ya"
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // Reset callback setelah tutup agar tidak tereksekusi ganda
    setTimeout(() => setOnConfirmCallback(null), 200); 
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
    close();
  };

  // --- STYLING DINAMIS ---
  const overlayBg = "bg-black/60 backdrop-blur-sm"; // Overlay gelap transparan
  // Background Modal (Putih di Light, Abu Gelap di Dark)
  const modalBg = theme === "light" ? "bg-white" : "bg-gray-900 border border-gray-700";
  // Warna Teks Judul
  const titleColor = theme === "light" ? "text-gray-900" : "text-white";
  // Warna Teks Isi
  const textColor = theme === "light" ? "text-gray-600" : "text-gray-300";
  // Tombol Batal
  const btnCancel = theme === "light" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-gray-800 text-gray-300 hover:bg-gray-700";

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      
      {isOpen && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center ${overlayBg} transition-opacity duration-300 p-4`}>
          <div className={`${modalBg} rounded-3xl shadow-2xl p-8 w-full max-w-sm transform transition-all scale-100 animate-in zoom-in-95 duration-200`}>
            
            {/* ICON HEADER */}
            <div className="flex justify-center mb-6">
               {modalType === 'alert' && alertType === 'success' && (
                 <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center animate-pulse">
                   <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                 </div>
               )}
               {modalType === 'alert' && alertType === 'error' && (
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
                   <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                 </div>
               )}
               {(modalType === 'confirm' || alertType === 'info') && (
                 <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                   <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 </div>
               )}
            </div>

            {/* KONTEN TEKS */}
            <h3 className={`text-2xl font-black text-center mb-3 ${titleColor}`}>
              {modalType === 'confirm' ? 'Konfirmasi' : (alertType === 'success' ? 'Berhasil!' : (alertType === 'error' ? 'Gagal!' : 'Info'))}
            </h3>
            <p className={`text-center mb-8 text-lg leading-relaxed ${textColor}`}>{message}</p>

            {/* TOMBOL AKSI */}
            <div className="flex gap-3 justify-center">
              {modalType === 'confirm' && (
                <button 
                  onClick={close}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold transition ${btnCancel}`}
                >
                  Batal
                </button>
              )}
              <button 
                onClick={modalType === 'confirm' ? handleConfirm : close}
                className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 transition transform hover:-translate-y-1"
              >
                {modalType === 'confirm' ? 'Ya, Lanjutkan' : 'OK, Mengerti'}
              </button>
            </div>

          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};