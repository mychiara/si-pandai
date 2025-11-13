
import React from 'react';
import { User } from '../types';

interface BeritaAcaraProps {
  user: User;
}

const BeritaAcara: React.FC<BeritaAcaraProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Cetak Berita Acara</h1>
       <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-slate-700">Fitur Dalam Pengembangan</h2>
        <p className="mt-2 text-slate-500">Halaman untuk mencetak berita acara hasil review ajuan akan segera tersedia.</p>
      </div>
    </div>
  );
};

export default BeritaAcara;
