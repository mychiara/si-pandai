
import React, { useState, useEffect } from 'react';
import { User, ActivityLog } from '../types';
import { apiService } from '../services/apiService';
import Spinner from '../components/Spinner';

interface LogAktivitasProps {
  user: User;
}

const LogAktivitas: React.FC<LogAktivitasProps> = ({ user }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const fetchedLogs = await apiService.getActivityLogs();
      setLogs(fetchedLogs);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  
  const formatDate = (date: Date) => new Date(date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Log Aktivitas</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="divide-y divide-slate-200">
          {logs.map(log => (
            <li key={log.id} className="py-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{log.user}</h3>
                    <p className="text-sm text-slate-500">{formatDate(log.timestamp)}</p>
                  </div>
                  <p className="text-sm text-slate-500">{log.action}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LogAktivitas;
