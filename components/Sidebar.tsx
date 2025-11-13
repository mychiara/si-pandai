
import React, { useState } from 'react';
import { User } from '../types';
import { LogoutIcon, ChevronDownIcon, DocumentTextIcon } from './Icons';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  menuItems: { id: string; label: string; icon: React.FC<{className?: string}> }[];
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, menuItems, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-800 text-white shadow-md">
        <div className="flex items-center space-x-2">
          <DocumentTextIcon className="h-8 w-8 text-blue-400" />
          <h1 className="text-xl font-bold">Si-Pandai</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-slate-800 text-slate-200 flex flex-col transition-all duration-300 ${isMobileMenuOpen ? 'w-64' : 'w-0 lg:w-64'} overflow-hidden h-screen z-20 absolute lg:relative`}>
        <div className="flex items-center justify-center p-6 border-b border-slate-700">
          <DocumentTextIcon className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold text-white ml-2">Si-Pandai</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium text-left">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white">
              {user.nama.charAt(0)}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="font-semibold text-white truncate text-sm">{user.nama}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
           <button
            onClick={onLogout}
            className="w-full flex items-center justify-center mt-4 px-4 py-2.5 rounded-lg text-slate-200 bg-slate-700 hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            <LogoutIcon className="h-5 w-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
