
import React, { useState } from 'react';
import { User } from '../types';

interface PengaturanAkunProps {
  user: User;
}

const PengaturanAkun: React.FC<PengaturanAkunProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    nama: user.nama,
    email: user.email,
    jabatanTtd: user.jabatanTtd || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call an API service to update the user data
    console.log("Updating user data:", formData);
    alert("Data akun berhasil diperbarui! (simulasi)");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Pengaturan Akun</h1>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
            <input
              type="text"
              name="nama"
              id="nama"
              value={formData.nama}
              onChange={handleChange}
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled
            />
             <p className="mt-2 text-xs text-slate-500">Email tidak dapat diubah.</p>
          </div>
          <div>
            <label htmlFor="jabatanTtd" className="block text-sm font-medium text-slate-700">Jabatan untuk TTD Berita Acara</label>
            <input
              type="text"
              name="jabatanTtd"
              id="jabatanTtd"
              value={formData.jabatanTtd}
              onChange={handleChange}
              placeholder="Contoh: Kepala Prodi"
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PengaturanAkun;
