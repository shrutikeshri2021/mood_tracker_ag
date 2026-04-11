import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Eye, Hand, Ear, Sun, Wind } from 'lucide-react';

const steps = [
  { id: 5, label: '5 things you can see', icon: <Eye size={24} />, count: 5, color: 'bg-accent-lilac' },
  { id: 4, label: '4 things you can touch', icon: <Hand size={24} />, count: 4, color: 'bg-accent-sky' },
  { id: 3, label: '3 things you can hear', icon: <Ear size={24} />, count: 3, color: 'bg-accent-mint' },
  { id: 2, label: '2 things you can smell', icon: <Sun size={24} />, count: 2, color: 'bg-accent-coral' },
  { id: 1, label: '1 thing you can taste', icon: <Wind size={24} />, count: 1, color: 'bg-text-secondary' },
];

const Grounding = ({ onBack }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSubsteps, setCompletedSubsteps] = useState(0);
  const [finished, setFinished] = useState(false);

  const step = steps[currentStepIdx];

  const handleNext = () => {
    if (completedSubsteps + 1 < step.count) {
      setCompletedSubsteps(completedSubsteps + 1);
    } else {
      if (currentStepIdx + 1 < steps.length) {
        setCurrentStepIdx(currentStepIdx + 1);
        setCompletedSubsteps(0);
      } else {
        setFinished(true);
      }
    }
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-700">
         <div className="w-24 h-24 bg-accent-mint/20 rounded-[3rem] flex items-center justify-center text-accent-mint shadow-inner">
            <CheckCircle2 size={48} />
         </div>
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-text-primary tracking-tight">Grounded & Present</h2>
            <p className="text-sm font-medium text-text-secondary">You've successfully anchored yourself to the now.</p>
         </div>
         <button 
           onClick={onBack}
           className="btn-primary w-full max-w-xs"
         >
           Return to Dashboard
         </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col p-8 overflow-hidden">
      <header className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-2 bg-white rounded-full premium-shadow text-text-primary">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-text-primary">Grounding (5-4-3-2-1)</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStepIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full text-center space-y-8"
          >
            <div className={`w-24 h-24 ${step.color} rounded-[2.5rem] mx-auto flex items-center justify-center text-white premium-shadow float-animation`}>
               {step.icon}
            </div>
            
            <div className="space-y-4">
               <h2 className="text-4xl font-black text-text-primary tracking-tighter">
                 {step.count - completedSubsteps} Left
               </h2>
               <p className="text-lg font-bold text-text-secondary px-4">{step.label}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="w-full max-w-xs">
           <button 
             onClick={handleNext}
             className={`w-full py-6 rounded-[2rem] font-black text-lg transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3 ${step.color} text-white`}
           >
             I see one <CheckCircle2 size={24} />
           </button>
        </div>

        <div className="flex gap-2">
           {steps.map((s, i) => (
             <div 
               key={s.id}
               className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i <= currentStepIdx ? s.color : 'bg-gray-200'}`}
             />
           ))}
        </div>
      </div>
      
      <p className="text-center text-[10px] uppercase font-bold tracking-[0.2em] text-text-secondary/40 pb-4">
        Focus deeply on each object
      </p>
    </div>
  );
};

export default Grounding;
