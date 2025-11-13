
import React, { useState } from 'react';
import { User, Notification } from '../types';
import { BellIcon } from './Icons';

interface HeaderProps {
  user: User;
  notifications: Notification[];
  onMarkRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, notifications, onMarkRead }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggle = () => {
    if (!dropdownOpen && unreadCount > 0) {
      onMarkRead();
    }
    setDropdownOpen(!dropdownOpen);
  };
  
  return (
    <header className="hidden lg:flex items-center justify-end h-16 bg-white shadow-sm px-8 relative">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <button onClick={handleToggle} className="relative p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <BellIcon className="h-6 w-6 text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {dropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                <div className="px-4 py-2 text-sm font-semibold text-slate-700 border-b">Notifikasi</div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 border-b last:border-b-0">
                        <p className={!n.read ? 'font-bold' : ''}>{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-slate-500 py-4">Tidak ada notifikasi baru.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-lg">
                {user.nama.charAt(0)}
            </div>
            <div className="ml-3">
                <p className="text-sm font-semibold text-slate-800">{user.nama}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role} {user.namaProdi ? `- ${user.namaProdi}` : ''}</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
