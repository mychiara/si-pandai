
import React, { useState, useEffect, useMemo } from 'react';
import { User, Ajuan, AjuanStatus, Role } from '../types';
import { apiService } from '../services/apiService';
import Spinner from '../components/Spinner';

interface DaftarAjuanProps {
  user: User;
  ajuanType: 'awal' | 'perubahan';
}

const statusColorMap: { [key in AjuanStatus]: string } = {
  [AjuanStatus.Menunggu]: 'bg-yellow-100 text-yellow-800',
  [AjuanStatus.Diterima]: 'bg-green-100 text-green-800',
  [AjuanStatus.Ditolak]: 'bg-red-100 text-red-800',
  [AjuanStatus.Revisi]: 'bg-blue-100 text-blue-800',
};

const DaftarAjuan: React.FC<DaftarAjuanProps> = ({ user, ajuanType }) => {
  const [ajuans, setAjuans] = useState<Ajuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ prodi: '', status: '' });
  const [prodiList, setProdiList] = useState<{ id: string; nama: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedAjuans = await apiService.getAjuans(user.id, user.role, ajuanType);
      setAjuans(fetchedAjuans);
      if (user.role === Role.Direktorat) {
        const users = await apiService.getUsers();
        const prodis = users
          .filter(u => u.role === Role.Prodi && u.idProdi && u.namaProdi)
          .map(u => ({ id: u.idProdi!, nama: u.namaProdi! }));
        const uniqueProdis = Array.from(new Set(prodis.map(p => p.id)))
            .map(id => prodis.find(p => p.id === id)!);
        setProdiList(uniqueProdis);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, ajuanType]);

  const filteredAjuans = useMemo(() => {
    return ajuans.filter(ajuan => {
      const prodiMatch = user.role === Role.Direktorat ? (filters.prodi ? ajuan.idProdi === filters.prodi : true) : true;
      const statusMatch = filters.status ? ajuan.status === filters.status : true;
      return prodiMatch && statusMatch;
    });
  }, [ajuans, filters, user.role]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('id-ID');

  if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Daftar Ajuan {ajuanType === 'awal' ? 'Awal' : 'Perubahan'}</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        {user.role === Role.Direktorat && (
          <select name="prodi" value={filters.prodi} onChange={handleFilterChange} className="w-full md:w-1/3 p-2 border rounded-md">
            <option value="">Semua Prodi</option>
            {prodiList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
          </select>
        )}
        <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full md:w-1/3 p-2 border rounded-md">
          <option value="">Semua Status</option>
          {Object.values(AjuanStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Judul Kegiatan</th>
                {user.role === Role.Direktorat && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prodi</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Anggaran</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tanggal Dibuat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredAjuans.length > 0 ? filteredAjuans.map(ajuan => (
                <tr key={ajuan.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{ajuan.judulKegiatan}</div>
                    <div className="text-xs text-slate-500">Revisi ke-{ajuan.revisiKe}</div>
                  </td>
                  {user.role === Role.Direktorat && <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{ajuan.namaProdi}</td>}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatCurrency(ajuan.totalAnggaran)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[ajuan.status]}`}>
                      {ajuan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(ajuan.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">Detail</button>
                    {user.role === Role.Direktorat && ajuan.status === AjuanStatus.Menunggu && (
                      <button className="ml-4 text-green-600 hover:text-green-900">Review</button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={user.role === Role.Direktorat ? 6 : 5} className="px-6 py-4 text-center text-sm text-slate-500">
                    Tidak ada data ajuan yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DaftarAjuan;
