"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Transaction, CartItem } from "../../types";

interface PaymentContextType {
  transactions: Transaction[];
  // Perhatikan tipe return-nya adalah string (bukan void)
  createTransaction: (items: CartItem[], total: number, method: string, customer: any) => string;
  getTransactionById: (id: string) => Transaction | undefined;
  markAsExpired: (id: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const STORAGE_KEY = "payment_transactions_db";

  // Load data transaksi
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        setTransactions(JSON.parse(saved));
    }
  }, []);

  // Simpan data setiap ada perubahan
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Fungsi Generate ID 10 Digit Angka Acak
  const generateOrderId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const createTransaction = (items: CartItem[], total: number, method: string, customer: any): string => {
    const orderId = generateOrderId();
    const now = Date.now();
    const expiry = now + (24 * 60 * 60 * 1000); // 24 Jam dari sekarang

    const newTransaction: Transaction = {
      id: orderId,
      items,
      totalAmount: total,
      paymentMethod: method,
      paymentStatus: 'pending',
      createdAt: now,
      expiryTime: expiry,
      customerInfo: customer
    };

    setTransactions(prev => [...prev, newTransaction]);
    
    // PENTING: Kembalikan orderId agar bisa ditangkap oleh halaman Checkout
    return orderId; 
  };

  const getTransactionById = (id: string) => {
    return transactions.find(t => t.id === id);
  };

  const markAsExpired = (id: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, paymentStatus: 'expired' } : t
    ));
  };

  return (
    <PaymentContext.Provider value={{ transactions, createTransaction, getTransactionById, markAsExpired }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayment error");
  return context;
};