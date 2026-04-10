import React from 'react';
import BottomNav from './BottomNav';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-mesh relative pb-32">
      <main className="max-w-md mx-auto px-5 pt-12">
        {children}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Layout;
