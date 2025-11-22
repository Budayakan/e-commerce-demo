"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";
import { useModal } from "@/app/context/ModalContext"; 
import Link from "next/link";

interface UserDisplay {
  nama: string;
  email: string;
  role: string;
  whatsapp?: string;
}

export default function ManageUsersPage() {
  const { getAllUsers, changeUserRole } = useAuth();
  const { theme } = useTheme();
  const { showConfirm, showAlert } = useModal(); 
  const router = useRouter();
  const [userList, setUserList] = useState<UserDisplay[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadAndSortUsers = useCallback(() => {
    const data = getAllUsers();
    const sortedData = data.sort((a, b) => {
      const roleComparison = a.role.localeCompare(b.role);
      return roleComparison === 0 ? a.nama.localeCompare(b.nama) : roleComparison;
    });
    setUserList([...sortedData]);
  }, [getAllUsers]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    const currentRole = localStorage.getItem("currentRole");
    if (!currentUser) { router.push("/login"); return; }
    if (currentRole !== "admin") { showAlert("Akses Ditolak!", "error"); router.push("/"); } else { loadAndSortUsers(); }
  }, [router, loadAndSortUsers, showAlert]);

  const handleRoleChange = (email: string, newRole: string) => {
    showConfirm(`Apakah Anda yakin ingin mengubah role user ${email} menjadi ${newRole}?`, () => {
      changeUserRole(email, newRole);
      setTimeout(() => {
        showAlert("Role user berhasil diubah!", "success");
      }, 300);
      loadAndSortUsers();
    });
  };

  const filteredList = userList.filter((u) => 
    u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.whatsapp && u.whatsapp.includes(searchQuery))
  );

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Header Section */}
      <div 
        className={`p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 transition-all duration-300 
        ${theme === 'light' 
          ? 'bg-gradient-to-r from-teal-500 to-teal-600 shadow-teal-200' 
          : 'bg-black border-b-4 border-teal-500 shadow-black/50'
        }`}
      >
        <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              <span className={theme === 'light' ? 'text-teal-100' : 'text-teal-400'}>👥</span> Manajemen User
            </h2>
            <p className={`mt-1 font-medium ml-1 ${theme === 'light' ? 'text-teal-50' : 'text-gray-400'}`}>
              Atur hak akses pengguna aplikasi.
            </p>
        </div>
        <Link href="/" className={`px-6 py-3 rounded-full shadow-lg transition flex items-center gap-2 text-sm font-bold transform hover:-translate-y-0.5 ring-2 ring-offset-2 ring-offset-transparent ${theme === 'light' ? 'bg-white text-teal-600 hover:bg-teal-50 ring-white/50' : 'bg-teal-500 text-white hover:bg-teal-600 ring-teal-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Kembali ke Dashboard
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-teal-500"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
        </div>
        <input 
            type="text" 
            placeholder="Cari nama, email, WA, atau role..." 
            className={`w-full md:w-1/3 border-2 text-sm rounded-full focus:ring-4 focus:ring-teal-500/50 focus:border-teal-500 block pl-12 p-3.5 shadow-sm transition font-medium outline-none ${theme === 'light' ? 'bg-white border-sky-200 text-gray-900 placeholder-gray-400' : 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabel User */}
      <div className={`rounded-[2.5rem] shadow-xl border overflow-hidden transition-colors duration-300 ${theme === 'light' ? 'bg-white border-sky-100' : 'bg-gray-900 border-gray-800'}`}>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-sky-100 w-full">
            <thead className={`transition-colors duration-300 ${theme === 'light' ? 'bg-teal-600 text-white' : 'bg-black text-teal-100'}`}>
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap first:rounded-tl-[2.5rem]">No</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Role</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Nama</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Email</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">No. WhatsApp</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap last:rounded-tr-[2.5rem]">Aksi (Ubah Role)</th>
                </tr>
            </thead>
            <tbody className={`divide-y text-gray-700 font-medium ${theme === 'light' ? 'divide-sky-100 bg-white' : 'divide-gray-800 bg-gray-900'}`}>
                {filteredList.length === 0 ? (
                <tr>
                    <td colSpan={6} className={`px-6 py-16 text-center font-bold ${theme === 'light' ? 'text-gray-400 bg-gray-50/50' : 'text-gray-500 bg-gray-800/50'}`}>
                        {searchQuery ? `Tidak ditemukan user "${searchQuery}"` : "Belum ada user terdaftar."}
                    </td>
                </tr>
                ) : (
                currentItems.map((u, index) => (
                    <tr key={u.email} className={`transition group ${theme === 'light' ? 'hover:bg-sky-50/50' : 'hover:bg-gray-800/50'}`}>
                    <td className={`px-6 py-5 text-sm whitespace-nowrap font-bold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-black inline-block shadow-sm border ${u.role === 'admin' ? (theme === 'light' ? 'bg-gray-900 text-teal-400 border-gray-900' : 'bg-black text-teal-400 border-teal-900') : (theme === 'light' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-teal-900/30 text-teal-300 border-teal-800')}`}>
                            {u.role.toUpperCase()}
                        </span>
                    </td>
                    <td className={`px-6 py-5 font-bold whitespace-nowrap group-hover:text-teal-500 transition ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{u.nama}</td>
                    <td className={`px-6 py-5 whitespace-nowrap font-mono text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{u.email}</td>
                    <td className={`px-6 py-5 whitespace-nowrap font-mono text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        {u.whatsapp ? (
                            <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" /></svg>
                                {u.whatsapp}
                            </span>
                        ) : <span className="opacity-50">-</span>}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                        <div className="relative">
                            <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.email, e.target.value)}
                            className={`border-2 text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full md:w-auto min-w-[140px] p-2.5 pl-3 pr-8 cursor-pointer font-bold shadow-sm transition appearance-none ${theme === 'light' ? 'bg-white border-sky-200 text-gray-700 hover:border-teal-400' : 'bg-gray-800 border-gray-600 text-gray-200 hover:border-teal-500'}`}
                            >
                                <option value="pengunjung">Pengunjung</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredList.length > itemsPerPage && (
        <div className="flex justify-center mt-8 gap-3">
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`px-5 py-2.5 rounded-full font-bold border-2 transition ${theme === 'light' ? (currentPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-sky-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300 bg-white shadow-sm') : (currentPage === 1 ? 'border-gray-800 text-gray-600' : 'border-teal-900 text-teal-400 hover:bg-teal-900')}`}>← Prev</button>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={`px-5 py-2.5 rounded-full font-bold border-2 transition ${theme === 'light' ? (currentPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-sky-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300 bg-white shadow-sm') : (currentPage === totalPages ? 'border-gray-800 text-gray-600' : 'border-teal-900 text-teal-400 hover:bg-teal-900')}`}>Next →</button>
        </div>
      )}
    </div>
  );
}