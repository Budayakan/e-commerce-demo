// Definisi Tipe Data Barang
export interface Product {
  id: number;
  slug: string;
  nama: string;
  harga: number;
  jumlah: number;
  deskripsi: string;
  kategori: string; 
  photos: string[]; 
}

export interface Category {
  id: number;
  slug: string;
  nama: string;
  deskripsi?: string;
}

// Definisi User
export interface User {
  nama: string;
  email: string;
  pass: string;
  role: string;
  photo?: string;
  whatsapp?: string;
}

// Item Keranjang (Turunan dari Product)
export interface CartItem extends Product {
  quantity: number;
}

// Definisi Transaksi Pembayaran
export interface Transaction {
  id: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'expired';
  createdAt: number;
  expiryTime: number;
  customerInfo: {
    nama: string;
    email: string;
    whatsapp: string;
  };
}
