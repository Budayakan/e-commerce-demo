import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import Semua Context
import { ProductProvider } from "./context/ProductContext"; 
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; 
import { ThemeProvider } from "./context/ThemeContext"; 
import { ModalProvider } from "./context/ModalContext"; 
import { CategoryProvider } from "./context/CategoryContext";
import { PaymentProvider } from "./context/PaymentContext"; // Pastikan PaymentProvider diimport

// Import Komponen UI Global
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Commerce Warga App",
  description: "Platform Jual Beli Modern & Terpercaya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} flex flex-col min-h-screen font-sans transition-colors duration-300`}>
        
        {/* URUTAN PROVIDER YANG BENAR (Sangat Penting) */}
        
        {/* 1. Auth (Data User paling dasar) */}
        <AuthProvider>
          
          {/* 2. Theme (Style UI) */}
          <ThemeProvider>
            
            {/* 3. Modal (Popup Notifikasi - dibutuhkan oleh context di bawahnya) */}
            <ModalProvider>

              {/* 4. Category (Data Kategori - memanggil useModal) */}
              <CategoryProvider>
                
                {/* 5. Product (Data Barang - memanggil useModal) */}
                <ProductProvider>
                  
                  {/* 6. Cart (Keranjang - memanggil useModal) */}
                  <CartProvider>
                    
                    {/* 7. Payment (Transaksi - memanggil useCart & useAuth & useModal) */}
                    <PaymentProvider>
                      
                      {/* --- UI UTAMA --- */}
                      
                      <Navbar />

                      <main className="flex-grow container mx-auto p-4 md:p-6 mt-20">
                        {children}
                      </main>

                      <Footer />

                    </PaymentProvider>

                  </CartProvider>
                  
                </ProductProvider>

              </CategoryProvider>

            </ModalProvider>

          </ThemeProvider>

        </AuthProvider>
        
      </body>
    </html>
  );
}