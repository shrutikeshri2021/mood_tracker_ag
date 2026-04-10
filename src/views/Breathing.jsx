import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Wind, RefreshCw, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const techniques = {
  box: {
    name: 'Box Breathing',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    total: 16,
    color: '#9C7CF3'
  },
  relax: {
    name: '4-7-8 Relax',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    total: 19,
    color: '#64D7BE'
  }
};

const Breathing = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('box');
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Rest
  const [active, setActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const t = techniques[activeTab];

  const runCycle = useCallback(() => {
    if (!active) return;

    if (phase === 'Inhale') {
      setTimeout(() => setPhase('Hold'), t.inhale * 1000);
    } else if (phase === 'Hold') {
      if (t.hold2 > 0) {
        setTimeout(() => setPhase('Exhale'), t.hold1 * 1000);
      } else {
        setTimeout(() => setPhase('Exhale'), t.hold1 * 1000);
      }
    } else if (phase === 'Exhale') {
      if (t.hold2 > 0) {
        setTimeout(() => setPhase('Rest'), t.exhale * 1000);
      } else {
        setTimeout(() => setPhase('Inhale'), t.exhale * 1000);
      }
    } else if (phase === 'Rest') {
      setTimeout(() => setPhase('Inhale'), t.hold2 * 1000);
    }
  }, [active, phase, t]);

  useEffect(() => {
    let interval;
    if (active) {
      interval = setInterval(() => {
        setTimer(p => p + 1);
      }, 1000);
      runCycle();
    }
    return () => {
        clearInterval(interval);
    };
  }, [active, phase, runCycle]);

  const handleToggle = () => {
    if (sessionCompleted) {
        setTimer(0);
        setSessionCompleted(false);
        setPhase('Inhale');
    }
    setActive(!active);
  };

  const getCircleScale = () => {
    if (!active) return 1;
    if (phase === 'Inhale') return 1.6;
    if (phase === 'Exhale') return 1;
    if (phase === 'Hold') return 1.6;
    return 1;
  };

  return (
    <div className="fixed inset-0 bg-mesh z-[100] p-8 flex flex-col overflow-hidden">
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-text-primary shadow-sm active:scale-95 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div className="flex bg-white/40 p-1.5 rounded-2xl border border-white/40">
           {Object.keys(techniques).map(key => (
             <button 
                key={key}
                onClick={() => {
                  setActive(false);
                  setActiveTab(key);
                  setPhase('Inhale');
                  setTimer(0);
                }}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === key ? 'bg-text-primary text-white shadow-md' : 'text-text-secondary/60'}`}
             >
               {techniques[key].name}
             </button>
           ))}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-16">
        <div className="text-center space-y-2">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-text-secondary/30">
                {active ? 'Follow your breath' : 'Focus and press begin'}
            </h2>
        </div>

        <div className="relative flex items-center justify-center">
            {/* Outer rings */}
            <motion.div 
                animate={{ scale: getCircleScale() }}
                transition={{ duration: phase === 'Inhale' ? t.inhale : (phase === 'Exhale' ? t.exhale : (phase === 'Hold' ? t.hold1 : t.hold2)), ease: "easeInOut" }}
                className="w-56 h-56 rounded-[5rem] bg-white opacity-20 border border-text-primary/10 shadow-2xl"
            />
            <motion.div 
                animate={{ scale: getCircleScale() * 0.8 }}
                transition={{ duration: phase === 'Inhale' ? t.inhale : (phase === 'Exhale' ? t.exhale : (phase === 'Hold' ? t.hold1 : t.hold2)), ease: "easeInOut" }}
                className="absolute w-56 h-56 rounded-[5rem] bg-white opacity-40 border border-text-primary/5"
            />
            
            {/* Core */}
            <motion.div 
                animate={{ scale: getCircleScale() * 0.6 }}
                transition={{ duration: phase === 'Inhale' ? t.inhale : (phase === 'Exhale' ? t.exhale : (phase === 'Hold' ? t.hold1 : t.hold2)), ease: "easeInOut" }}
                className="absolute w-56 h-56 rounded-[5rem] premium-shadow flex items-center justify-center"
                style={{ backgroundColor: t.color }}
            >
                <div className="text-center space-y-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={phase}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-white font-black uppercase tracking-widest text-lg"
                        >
                            {active ? phase : <Wind size={32} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Pulsing indicator */}
            {active && (
                <div 
                    className="absolute w-72 h-72 border-2 border-dashed rounded-full pulse-animation opacity-20"
                    style={{ borderColor: t.color }}
                />
            )}
        </div>

        <div className="w-full max-w-xs space-y-8">
            <div className="text-center">
                <div className="text-4xl font-black text-text-primary tracking-tighter tabular-nums">
                    {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </div>
            </div>

            <button
                onClick={handleToggle}
                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95 ${
                    active ? 'bg-white text-text-primary border border-text-primary/5' : 'bg-text-primary text-white'
                }`}
            >
                {active ? 'Pause Session' : 'Begin Reset'}
            </button>
        </div>
      </div>

      <div className="mt-8 flex gap-4 p-5 bg-white/40 rounded-3xl border border-white/40">
         <Info size={18} className="text-text-secondary shrink-0" />
         <p className="text-[10px] font-bold text-text-secondary/70 leading-relaxed uppercase tracking-wider">
            {t.name === 'Box Breathing' 
                ? 'Used by top performers to regain focus and stabilize the nervous system.' 
                : 'The gold standard for deep relaxation and preparing the body for rest.'}
         </p>
      </div>
    </div>
  );
};

export default Breathing;
