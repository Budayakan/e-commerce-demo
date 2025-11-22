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

export interface User {
  nama: string;
  email: string;
  pass: string;
  role: string;
  photo?: string;
  whatsapp?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string; // BCA, MANDIRI, GOPAY, dll
  paymentStatus: 'pending' | 'paid' | 'expired';
  createdAt: number; // Timestamp
  expiryTime: number; // Timestamp 24 jam kemudian
  customerInfo: {
    nama: string;
    email: string;
    whatsapp: string;
  };
}