
import React, { useState, useEffect } from 'react';
import { User, KelompokBelanja, GrubBelanja, Role } from '../types';
import { apiService } from '../services/apiService';
import Spinner from '../components/Spinner';

interface ManajemenProps {
  user: User;
}

const Manajemen: React.FC<ManajemenProps> = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [kelompokBelanja, setKelompokBelanja] = useState<KelompokBelanja[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [fetchedUsers, fetchedKelompok] = await Promise.all([
      apiService.getUsers(),
      apiService.getKelompokBelanja()
    ]);
    setUsers(fetchedUsers);
    setKelompokBelanja(fetchedKelompok);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Manajemen</h1>
      <div className="flex border-b">
        <button onClick={() => setActiveSubTab('users')} className={`px-4 py-2 ${activeSubTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-slate-500'}`}>
          Manajemen Pengguna
        </button>
        <button onClick={() => setActiveSubTab('kelompok')} className={`px-4 py-2 ${activeSubTab === 'kelompok' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-slate-500'}`}>
          Manajemen Kelompok Belanja
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeSubTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Daftar Pengguna</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pagu Awal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{u.nama}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">{u.role} {u.namaProdi ? `- ${u.namaProdi}`: ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{u.paguAwal > 0 ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(u.paguAwal) : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeSubTab === 'kelompok' && (
           <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Daftar Kelompok Belanja</h2>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Kelompok</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grub</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                    {kelompokBelanja.map(k => (
                        <tr key={k.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{k.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{k.grub}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Manajemen;
