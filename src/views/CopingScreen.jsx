import React, { useState, useEffect } from 'react';
import { getEntries } from '../services/storage';
import { CopingSuggestionEngine } from '../services/copingSuggestionEngine';
import { ArrowLeft, Sparkles, Feather, ArrowRight, Info } from 'lucide-react';

const CopingScreen = ({ onBack, onNavigate }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const entries = getEntries();
    const currentMood = entries[0]?.mood || null;
    const engine = new CopingSuggestionEngine();
    setSuggestions(engine.generateSuggestions(entries, currentMood));
  }, []);

  const urgencyConfig = {
    gentle: { color: 'bg-accent-sky text-blue-900', label: '🌿 Gentle' },
    recommended: { color: 'bg-accent-mint text-emerald-900', label: '⚡ Recommended' },
    important: { color: 'bg-accent-coral text-red-900', label: '🔴 Important' }
  };

  return (
    <div className="pb-32 space-y-6 max-w-lg mx-auto">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/40 rounded-full border border-white/20 text-text-primary">
          <ArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
             <Feather size={24} />
             Smart Coping
           </h1>
           <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary/60">
             Personalized to your patterns
           </p>
        </div>
      </header>

      <div className="bg-white/40 rounded-[2rem] p-5 border border-white/30 space-y-2 relative mb-6">
         <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-accent-iris" />
            <h3 className="font-bold text-text-primary uppercase tracking-widest text-xs">Why these suggestions?</h3>
         </div>
         <p className="text-xs text-text-secondary/80 leading-relaxed font-medium">
           This intelligence engine correlates your historical tags against your actual mood drops to surface the precise tools that prove helpful to you.
         </p>
      </div>

      <div className="space-y-4">
        {suggestions.map((s, idx) => (
          <div key={s.id} className="glass-card rounded-[2rem] p-6 border border-text-primary/5 space-y-4 shadow-sm relative overflow-hidden group">
            {idx < 3 && (
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Sparkles size={60} />
              </div>
            )}
            
            <div className="flex justify-between items-start">
               <div className="flex gap-4">
                  <div className="text-4xl">{s.emoji}</div>
                  <div>
                    <h3 className="font-bold text-lg text-text-primary">{s.title}</h3>
                    <p className="text-sm text-text-secondary mt-1 font-medium leading-relaxed">{s.description}</p>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider pt-3 border-t border-text-primary/5">
                <span className={`px-2 py-1 rounded-md ${urgencyConfig[s.urgency].color}`}>
                  {urgencyConfig[s.urgency].label}
                </span>
                <span className="text-text-secondary/60 lowercase italic pr-2">Based on: {s.basedOn}</span>
            </div>

            {s.actionScreen !== 'none' && (
              <button 
                onClick={() => onNavigate(s.actionScreen)}
                className="w-full mt-2 bg-white/60 hover:bg-white text-text-primary border border-text-primary/10 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {s.actionLabel} <ArrowRight size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CopingScreen;
