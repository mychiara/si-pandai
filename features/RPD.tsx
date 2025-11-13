
import React from 'react';
import { User } from '../types';

interface RPDProps {
  user: User;
  ajuanType: 'awal' | 'perubahan';
}

const RPD: React.FC<RPDProps> = ({ user, ajuanType }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">RPD {ajuanType === 'awal' ? 'Awal' : 'Perubahan'}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-slate-700">Fitur Dalam Pengembangan</h2>
        <p className="mt-2 text-slate-500">Halaman untuk menampilkan Rencana Penarikan Dana per bulan akan segera tersedia.</p>
      </div>
    </div>
  );
};

export default RPD;
