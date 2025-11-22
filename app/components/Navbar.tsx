"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, role, photo, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 shadow-lg border-b transition-colors duration-300 
        ${theme === 'light' 
          ? 'bg-white/95 backdrop-blur-md border-sky-200 text-gray-800' 
          : 'bg-black/95 backdrop-blur-md border-teal-900 text-white'
        }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <Link href="/" className="text-xl font-black tracking-tight flex items-center gap-2 transition group">
          <div className={`p-1.5 rounded-lg ${theme === 'light' ? 'bg-teal-50 text-teal-600' : 'bg-gray-800 text-teal-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.615ZM9.75 9.75V2.25H13.5v7.5" />
            </svg>
          </div>
          <span className={`${theme === 'light' ? 'text-teal-600' : 'text-teal-400'} hidden sm:inline group-hover:text-teal-500`}>
            Toko Warga
          </span>
        </Link>

        {/* --- CONTAINER KANAN (Menu Desktop & Toggle) --- */}
        <div className="flex items-center gap-3 md:gap-6">
            
            {/* Tombol Theme Toggle */}
             <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full transition-all duration-300 border ${theme === 'light' ? 'bg-sky-50 text-orange-500 border-sky-100 hover:bg-sky-100' : 'bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700'}`}
                title={theme === 'light' ? "Aktifkan Dark Mode" : "Aktifkan Light Mode"}
            >
                {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
                )}
            </button>

            {/* Hamburger (Mobile Only) */}
            <button className="md:hidden p-2 transition" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    {isMobileMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />)}
                </svg>
            </button>

            {/* Menu Desktop (Hidden on Mobile) */}
            <ul className="hidden md:flex gap-6 text-sm font-semibold items-center tracking-wide">
                
                {/* Icon Keranjang Belanja */}
                {user && (
                    <li>
                    <Link href="/cart" className="relative group">
                        <div className={`p-2 rounded-full transition ${theme === 'light' ? 'hover:bg-sky-100 text-gray-600' : 'hover:bg-gray-800 text-teal-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                            {cartCount}
                            </span>
                        )}
                        </div>
                    </Link>
                    </li>
                )}

                {/* Profil & Dropdown */}
                {user ? (
                    <li className="relative">
                        <button onClick={toggleDropdown} className={`flex items-center gap-2 focus:outline-none p-1 pr-3 rounded-full transition border ${theme === 'light' ? 'hover:bg-sky-50 border-gray-200' : 'hover:bg-gray-800 border-gray-700'}`}>
                            {photo ? (
                                <img src={photo} alt="Avatar" className={`w-8 h-8 rounded-full object-cover border ${theme === 'light' ? 'border-teal-500' : 'border-teal-400'}`} />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                                    {user.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className={`max-w-[80px] truncate font-bold text-sm ${theme === 'light' ? 'text-gray-700' : 'text-teal-100'}`}>{user}</span>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={closeDropdown}></div>
                                <div className={`absolute right-0 mt-3 w-60 rounded-xl shadow-2xl border z-20 overflow-hidden ${theme === 'light' ? 'bg-white border-sky-100 text-gray-800' : 'bg-gray-900 border-gray-700 text-gray-200'}`}>
                                    <div className={`px-5 py-4 border-b ${theme === 'light' ? 'bg-sky-50 border-gray-100' : 'bg-gray-800 border-gray-700'}`}>
                                        <p className="text-xs opacity-70 uppercase font-bold tracking-wider">Login Sebagai</p>
                                        <p className={`text-base font-black capitalize ${theme === 'light' ? 'text-teal-600' : 'text-teal-400'}`}>{role}</p>
                                    </div>
                                    <div className="py-2">
                                        {/* LACAK PESANAN (Dipindah ke sini) */}
                                        <Link 
                                            href="/track" 
                                            onClick={closeDropdown} 
                                            className={`block px-5 py-3 text-sm font-medium hover:bg-opacity-10 transition border-b border-opacity-10 ${theme === 'light' ? 'hover:bg-teal-500 hover:text-teal-700 border-gray-200' : 'hover:bg-teal-500 hover:text-teal-300 border-gray-700'}`}
                                        >
                                            🔍 Lacak Pesanan
                                        </Link>

                                        {role === 'admin' && (
                                            <>
                                                <Link href="/admin/users" onClick={closeDropdown} className={`block px-5 py-3 text-sm font-medium hover:bg-opacity-10 transition ${theme === 'light' ? 'hover:bg-teal-500 hover:text-teal-700' : 'hover:bg-teal-500 hover:text-teal-300'}`}>
                                                    👥 Kelola User
                                                </Link>
                                                <Link href="/admin/categories" onClick={closeDropdown} className={`block px-5 py-3 text-sm font-medium hover:bg-opacity-10 transition border-b border-opacity-10 ${theme === 'light' ? 'hover:bg-teal-500 hover:text-teal-700 border-gray-200' : 'hover:bg-teal-500 hover:text-teal-300 border-gray-700'}`}>
                                                    📁 Kelola Kategori
                                                </Link>
                                            </>
                                        )}
                                        <Link href="/profile" onClick={closeDropdown} className={`block px-5 py-3 text-sm font-medium hover:bg-opacity-10 transition ${theme === 'light' ? 'hover:bg-teal-500 hover:text-teal-700' : 'hover:bg-teal-500 hover:text-teal-300'}`}>✏️ Edit Profil</Link>
                                        <button onClick={() => { closeDropdown(); logout(); }} className="w-full text-left px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition">🚪 Logout</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </li>
                ) : (
                    <>
                        <li><Link href="/login" className={`font-semibold transition ${theme === 'light' ? 'text-gray-600 hover:text-teal-600' : 'text-teal-100 hover:text-white'}`}>Login</Link></li>
                        <li><Link href="/register" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md transition hover:-translate-y-0.5">Register</Link></li>
                    </>
                )}
            </ul>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t p-4 space-y-4 shadow-2xl ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-black border-teal-900'}`}>
           {user ? (
            <>
              <div className="flex items-center gap-3 border-b pb-4 mb-4 border-opacity-20 border-gray-500">
                {photo ? ( <img src={photo} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-teal-500" /> ) : ( <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg">{user.charAt(0).toUpperCase()}</div> )}
                <div><p className={`font-bold text-lg ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{user}</p><p className="text-sm text-teal-500 capitalize font-medium">{role}</p></div>
              </div>
              
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-3 rounded px-2 font-medium ${theme === 'light' ? 'text-gray-700 hover:bg-sky-50' : 'text-teal-100 hover:bg-teal-900'}`}>
                 🛒 Keranjang <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{cartCount}</span>
              </Link>

              {/* Menu Lacak Pesanan di Mobile */}
              <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-2 py-3 rounded px-2 font-medium ${theme === 'light' ? 'text-gray-700 hover:bg-sky-50' : 'text-teal-100 hover:bg-teal-900'}`}>
                 🔍 Lacak Pesanan
              </Link>

              {role === 'admin' && (
                <>
                    <Link href="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className={`block py-3 rounded px-2 font-medium ${theme === 'light' ? 'text-gray-700 hover:bg-sky-50' : 'text-teal-100 hover:bg-teal-900'}`}>👥 Kelola User</Link>
                    <Link href="/admin/categories" onClick={() => setIsMobileMenuOpen(false)} className={`block py-3 rounded px-2 font-medium ${theme === 'light' ? 'text-gray-700 hover:bg-sky-50' : 'text-teal-100 hover:bg-teal-900'}`}>📁 Kelola Kategori</Link>
                </>
              )}
              
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`block py-3 rounded px-2 font-medium ${theme === 'light' ? 'text-gray-700 hover:bg-sky-50' : 'text-teal-100 hover:bg-teal-900'}`}>✏️ Edit Profil</Link>
              <button onClick={() => { setIsMobileMenuOpen(false); logout(); }} className="w-full text-left text-red-500 py-3 rounded px-2 font-bold hover:bg-red-500/10">🚪 Logout</button>
            </>
          ) : (
             <div className="flex flex-col gap-4">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className={`text-center block py-3 border-2 rounded-full font-bold ${theme === 'light' ? 'border-gray-300 text-gray-600' : 'border-teal-600 text-teal-100'}`}>Login</Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center block bg-teal-500 text-white py-3 rounded-full font-bold shadow-md">Register</Link>
             </div>
          )}
        </div>
      )}
    </nav>
  );
}