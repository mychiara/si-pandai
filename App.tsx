
import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, Notification, Ajuan } from './types';
import { apiService } from './services/apiService';
import { TABS, DIRECTORATE_TABS, PRODI_TABS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './features/Login';
import Dashboard from './features/Dashboard';
import BuatAjuan from './features/BuatAjuan';
import DaftarAjuan from './features/DaftarAjuan';
import Manajemen from './features/Manajemen';
import LogAktivitas from './features/LogAktivitas';
import PengaturanAkun from './features/PengaturanAkun';
import RPD from './features/RPD';
import Realisasi from './features/Realisasi';
import BeritaAcara from './features/BeritaAcara';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(TABS.DASHBOARD);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isTahapPerubahan, setIsTahapPerubahan] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionUser = await apiService.checkSession();
        if (sessionUser) {
          setUser(sessionUser);
          fetchNotifications(sessionUser.id);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
    // Check if "Tahap Perubahan" is active
    apiService.isTahapPerubahanActive().then(setIsTahapPerubahan);
  }, []);

  const fetchNotifications = useCallback(async (userId: string) => {
    const fetchedNotifications = await apiService.getNotifications(userId);
    setNotifications(fetchedNotifications);
  }, []);
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    fetchNotifications(loggedInUser.id);
    setActiveTab(TABS.DASHBOARD);
  };

  const handleLogout = async () => {
    await apiService.logout();
    setUser(null);
  };

  const handleMarkNotificationsAsRead = async () => {
    if (user) {
      await apiService.markNotificationsAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const renderContent = () => {
    const commonProps = { user: user!, isTahapPerubahan };
    switch (activeTab) {
      case TABS.DASHBOARD:
        return <Dashboard {...commonProps} />;
      case TABS.BUAT_AJUAN:
        return <BuatAjuan {...commonProps} />;
      case TABS.DAFTAR_AJUAN_AWAL:
        return <DaftarAjuan {...commonProps} ajuanType="awal" />;
      case TABS.DAFTAR_AJUAN_PERUBAHAN:
        return <DaftarAjuan {...commonProps} ajuanType="perubahan" />;
      case TABS.RPD_AWAL:
        return <RPD {...commonProps} ajuanType="awal" />;
      case TABS.RPD_PERUBAHAN:
        return <RPD {...commonProps} ajuanType="perubahan" />;
      case TABS.REALISASI_AWAL:
        return <Realisasi {...commonProps} ajuanType="awal" />;
      case TABS.REALISASI_PERUBAHAN:
        return <Realisasi {...commonProps} ajuanType="perubahan" />;
      case TABS.BERITA_ACARA:
        return <BeritaAcara {...commonProps} />;
      case TABS.MANAJEMEN:
        return user?.role === Role.Direktorat ? <Manajemen {...commonProps} /> : null;
      case TABS.PENGATURAN_AKUN:
        return user?.role === Role.Prodi ? <PengaturanAkun {...commonProps} /> : null;
      case TABS.LOG_AKTIVITAS:
        return user?.role === Role.Direktorat ? <LogAktivitas {...commonProps} /> : null;
      default:
        return <Dashboard {...commonProps} />;
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const menuItems = user.role === Role.Direktorat ? DIRECTORATE_TABS(isTahapPerubahan) : PRODI_TABS(isTahapPerubahan);
  
  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          notifications={notifications}
          onMarkRead={handleMarkNotificationsAsRead}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
