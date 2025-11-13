
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { User, Role } from '../types';
import { apiService } from '../services/apiService';
import Spinner from '../components/Spinner';

interface DashboardProps {
  user: User;
  isTahapPerubahan: boolean;
}

const DashboardCard: React.FC<{ title: string; value: string; color: string; icon: React.ReactNode }> = ({ title, value, color, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`rounded-full p-3 ${color}`}>
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <p className="text-2xl font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);


const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dashboardStats = await apiService.getDashboardStats(user.id, user.role);
      setStats(dashboardStats);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  if (!stats) {
    return <div>Gagal memuat data dashboard.</div>;
  }

  const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  const chartData = stats.rpdVsRealisasi.map((item: any) => ({
    name: item.bulan,
    RPD: item.rpd,
    Realisasi: item.realisasi,
  }));
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Pagu" value={formatCurrency(stats.totalPagu)} color="bg-blue-100 text-blue-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <DashboardCard title="Total Diajukan" value={formatCurrency(stats.totalDiajukan)} color="bg-green-100 text-green-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
        <DashboardCard title="Total RPD" value={formatCurrency(stats.totalRpd)} color="bg-yellow-100 text-yellow-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        <DashboardCard title="Total Realisasi" value={formatCurrency(stats.totalRealisasi)} color="bg-indigo-100 text-indigo-600" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">RPD vs Realisasi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(Number(value))} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Bar dataKey="RPD" fill="#3b82f6" />
            <Bar dataKey="Realisasi" fill="#86efac" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {Object.entries(stats.statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold text-slate-600">{status}</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">{count as number}</p>
          </div>
        ))}
      </div>

      {/* Ringkasan Direktorat */}
      {user.role === Role.Direktorat && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Total Realisasi per Prodi</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prodi</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Realisasi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {stats.realisasiPerProdi.map((prodi: any) => (
                    <tr key={prodi.nama}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{prodi.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatCurrency(prodi.totalRealisasi)}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
