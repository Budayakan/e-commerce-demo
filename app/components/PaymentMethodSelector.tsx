"use client";

import { useTheme } from "../context/ThemeContext";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  logo: string; // Sekarang berisi URL gambar
}

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function PaymentMethodSelector({ selected, onSelect }: Props) {
  const { theme } = useTheme();

  const paymentMethods: PaymentMethod[] = [
    { 
        id: "BCA", 
        name: "Bank BCA", 
        type: "Transfer / Virtual Account", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png" 
    },
    { 
        id: "MANDIRI", 
        name: "Bank Mandiri", 
        type: "Transfer / Virtual Account", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png" 
    },
    { 
        id: "BRI", 
        name: "Bank BRI", 
        type: "Transfer / Virtual Account", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/2560px-BANK_BRI_logo.svg.png" 
    },
    { 
        id: "QRIS", 
        name: "QRIS", 
        type: "Scan QR Code", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/2560px-Logo_QRIS.svg.png" 
    },
    { 
        id: "GOPAY", 
        name: "GoPay", 
        type: "E-Wallet", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png" 
    },
    { 
        id: "OVO", 
        name: "OVO", 
        type: "E-Wallet", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png" 
    },
    { 
        id: "GRAB", 
        name: "GrabPay", 
        type: "E-Wallet", 
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Grab_logo.svg/2560px-Grab_logo.svg.png" 
    },
  ];

  return (
    <div className={`p-6 rounded-3xl border transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
      <h3 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        Pilih Metode Pembayaran
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center gap-4 group relative overflow-hidden
              ${selected === method.id 
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-md' 
                : (theme === 'light' ? 'border-gray-100 hover:border-teal-300 hover:bg-teal-50/30' : 'border-gray-700 hover:border-teal-500 hover:bg-gray-800')
              }`}
          >
            {/* Indikator Selected */}
            {selected === method.id && (
              <div className="absolute top-2 right-2 text-teal-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* CONTAINER LOGO GAMBAR */}
            <div className={`w-14 h-14 flex items-center justify-center rounded-xl p-2 shadow-sm ${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800 border border-gray-700'}`}>
              <img 
                src={method.logo} 
                alt={method.name} 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div>
              <p className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {method.name}
              </p>
              <p className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                {method.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}