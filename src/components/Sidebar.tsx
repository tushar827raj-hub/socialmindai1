import React from 'react';
import { LayoutDashboard as DashboardIcon, Share2, Bot, History as HistoryIcon, LogOut, Sparkles } from 'lucide-react';
import { View } from '../App';
import { User } from 'firebase/auth';
import { clsx } from 'clsx';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
  user: User;
}

export default function Sidebar({ currentView, setView, onLogout, user }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: DashboardIcon },
    { id: 'connections' as View, label: 'Platforms', icon: Share2 },
    { id: 'agent' as View, label: 'AI Agent', icon: Bot },
    { id: 'history' as View, label: 'History', icon: HistoryIcon },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <span className="font-semibold text-neutral-900 tracking-tight">SocialMind</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              currentView === item.id 
                ? "bg-neutral-100 text-neutral-900" 
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-neutral-100">
        <div className="flex items-center gap-3 px-2 mb-4">
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-neutral-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-neutral-900 truncate">{user.displayName}</p>
            <p className="text-[10px] text-neutral-500 truncate">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
