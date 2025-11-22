"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface CountdownProps {
  targetDate: number;
  onExpire?: () => void;
}

export default function CountdownTimer({ targetDate, onExpire }: CountdownProps) {
  const { theme } = useTheme();
  
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Update setiap 1 detik
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setIsExpired(true);
        if (onExpire) onExpire(); // Panggil fungsi callback jika waktu habis
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  // Format angka agar selalu 2 digit (01, 02, dst)
  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  if (isExpired) {
    return (
      <div className="bg-red-500 text-white py-2 px-6 rounded-full font-bold text-sm inline-block animate-pulse">
        WAKTU PEMBAYARAN HABIS
      </div>
    );
  }

  // Style Box Angka
  const boxClass = `flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 shadow-sm transition-colors duration-300
    ${theme === 'light' 
      ? 'bg-white border-sky-100 text-gray-800' 
      : 'bg-gray-800 border-gray-700 text-white'}`;

  // Style Label (Jam/Menit/Detik)
  const labelClass = `text-[10px] md:text-xs font-bold uppercase mt-1 tracking-wider 
    ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`;

  // Style Angka
  const numberClass = `text-2xl md:text-3xl font-black 
    ${theme === 'light' ? 'text-teal-600' : 'text-teal-400'}`;

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      
      {/* JAM */}
      <div className={boxClass}>
        <span className={numberClass}>{formatNumber(timeLeft.hours)}</span>
        <span className={labelClass}>Jam</span>
      </div>

      <span className={`text-2xl font-bold -mt-4 ${theme === 'light' ? 'text-teal-200' : 'text-gray-600'}`}>:</span>

      {/* MENIT */}
      <div className={boxClass}>
        <span className={numberClass}>{formatNumber(timeLeft.minutes)}</span>
        <span className={labelClass}>Menit</span>
      </div>

      <span className={`text-2xl font-bold -mt-4 ${theme === 'light' ? 'text-teal-200' : 'text-gray-600'}`}>:</span>

      {/* DETIK */}
      <div className={boxClass}>
        <span className={numberClass}>{formatNumber(timeLeft.seconds)}</span>
        <span className={labelClass}>Detik</span>
      </div>

    </div>
  );
}