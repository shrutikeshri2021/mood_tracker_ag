import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { getEntries } from '../services/storage';
import { BalanceEngine } from '../services/balanceEngine';
import { EyeOff } from 'lucide-react';
import DummyScreen from '../views/DummyScreen';

const Layout = ({ children, activeTab, setActiveTab }) => {
  const [overlayStyle, setOverlayStyle] = useState({ opacity: 0, transition: 'all 2s ease-in-out' });
  const [isPanic, setIsPanic] = useState(false);

  useEffect(() => {
    const data = getEntries();
    const engine = new BalanceEngine();
    const balance = engine.calculateScore(data).score;

    if (balance > 70) {
      setOverlayStyle({ opacity: 0, transition: 'all 2s ease-in-out' });
    } else if (balance >= 40) {
       setOverlayStyle({ 
          opacity: 0.8, 
          background: '#A8C6F4', 
          mixBlendMode: 'color',
          transition: 'all 2s ease-in-out'
       });
    } else {
       setOverlayStyle({ 
          opacity: 0.6, 
          background: '#F7C8BD', 
          mixBlendMode: 'multiply',
          transition: 'all 2s ease-in-out'
       });
    }
  }, [activeTab]);

  if (isPanic) {
     return <DummyScreen onUnlock={() => setIsPanic(false)} />;
  }

  return (
    <div className="min-h-screen bg-mesh relative pb-32">
      <div 
         className="fixed inset-0 pointer-events-none z-0" 
         style={overlayStyle}
      ></div>

      <button 
         onClick={() => setIsPanic(true)}
         className="fixed top-4 right-4 z-50 p-3 bg-white/40 backdrop-blur-md rounded-full text-text-primary/60 hover:bg-white/80 active:scale-90 transition-all border border-text-primary/10 shadow-sm"
      >
         <EyeOff size={16} strokeWidth={2.5} />
      </button>

      <main className="max-w-md mx-auto px-5 pt-12 relative z-10">
        {children}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Layout;
