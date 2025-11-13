
import React from 'react';
import { User } from '../types';

interface RealisasiProps {
  user: User;
  ajuanType: 'awal' | 'perubahan';
}

const Realisasi: React.FC<RealisasiProps> = ({ user, ajuanType }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Realisasi {ajuanType === 'awal' ? 'Awal' : 'Perubahan'}</h1>
       <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-slate-700">Fitur Dalam Pengembangan</h2>
        <p className="mt-2 text-slate-500">Halaman untuk menampilkan realisasi penggunaan anggaran per kegiatan akan segera tersedia.</p>
      </div>
    </div>
  );
};

export default Realisasi;
