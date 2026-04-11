import React, { useState } from 'react';
import { Menu, Filter } from 'lucide-react';

const DummyScreen = ({ onUnlock }) => {
  const [clicks, setClicks] = useState(0);

  const handleSecretClick = () => {
     if (clicks + 1 === 3) {
        onUnlock();
     } else {
        setClicks(clicks + 1);
        setTimeout(() => setClicks(0), 1000); 
     }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans slide-in-from-bottom animate-in duration-300">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center relative select-none shadow-sm">
         <div onClick={handleSecretClick} className="absolute inset-x-0 top-0 h-full z-50 cursor-pointer"></div>
         
         <div className="flex items-center gap-4 relative z-10">
            <Menu className="text-gray-400" size={24} />
            <span className="font-semibold text-lg tracking-tight text-gray-700">Tasks Outline</span>
         </div>
         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm relative z-10">
            W
         </div>
      </header>
      
      <div className="p-4 space-y-3 mt-2">
         <div className="flex justify-between items-center pb-2 px-1">
            <h2 className="text-lg font-medium text-gray-600">Today's Queue</h2>
            <Filter className="text-gray-400" size={18} />
         </div>
         
         <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-start gap-4">
             <input type="checkbox" className="mt-1.5 opacity-50 w-4 h-4" />
             <div>
                <p className="font-medium text-gray-800 text-sm">Q3 Marketing Deck Review</p>
                <p className="text-xs text-gray-400 mt-1">Due at 4:30 PM</p>
             </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-start gap-4">
             <input type="checkbox" className="mt-1.5 opacity-50 w-4 h-4" />
             <div>
                <p className="font-medium text-gray-800 text-sm">Sync with Engineering Lead</p>
                <p className="text-xs text-gray-400 mt-1">Due Tomorrow</p>
             </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-start gap-4">
             <input type="checkbox" className="mt-1.5 opacity-50 w-4 h-4" />
             <div>
                <p className="font-medium text-gray-800 text-sm">Draft weekly update email</p>
                <p className="text-xs text-gray-400 mt-1">No due date</p>
             </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-start gap-4 opacity-50">
             <input type="checkbox" defaultChecked className="mt-1.5 opacity-50 w-4 h-4" />
             <div>
                <p className="font-medium text-gray-500 text-sm line-through">Onboarding tasks</p>
                <p className="text-xs text-gray-400 mt-1">Completed</p>
             </div>
         </div>
      </div>
    </div>
  );
};

export default DummyScreen;
