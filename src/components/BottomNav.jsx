import React from 'react';
import { Home, PlusSquare, Book, BarChart3, User } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'journal', icon: Book, label: 'Journal' },
    { id: 'checkin', icon: PlusSquare, label: 'Log', isMain: true },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bottom-nav-blur px-8 pt-4 pb-10 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto relative px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.isMain) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative -top-8 w-16 h-16 bg-text-primary text-white rounded-3xl shadow-xl flex items-center justify-center transition-all active:scale-90 border-4 border-cream ${isActive ? 'scale-110' : ''}`}
              >
                <Icon size={28} />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isActive ? 'text-text-primary' : 'text-text-secondary/50'}`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-lavender/30' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isActive ? 'opacity-100' : 'opacity-0'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

