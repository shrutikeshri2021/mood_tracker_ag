import React, { useState, useEffect } from 'react';
import { getEntries } from '../services/storage';
import { TriggerEngine } from '../services/triggerEngine';
import { ArrowLeft, Sun, BatteryLow, Target, AlertTriangle, ShieldCheck } from 'lucide-react';

const TriggerMatrixScreen = ({ onBack }) => {
  const [data, setData] = useState({ drains: [], radiators: [], neutral: [] });

  useEffect(() => {
    const entries = getEntries();
    const engine = new TriggerEngine();
    setData(engine.analyzeTriggers(entries));
  }, []);

  const totalAnalyzed = data.drains.length + data.radiators.length + data.neutral.length;

  if (totalAnalyzed === 0) {
    return (
      <div className="pb-32 space-y-6 max-w-lg mx-auto">
        <header className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/40 rounded-full border border-white/20 text-text-primary">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Energy Matrix</h1>
        </header>

        <div className="p-8 border-2 border-dashed border-text-primary/10 rounded-[2.5rem] text-center space-y-4 bg-white/30">
          <div className="w-16 h-16 bg-white rounded-3xl mx-auto flex items-center justify-center text-accent-lilac shadow-sm">
             <Target size={24} />
          </div>
          <p className="text-sm text-text-primary font-medium px-4">Track more tags during check-in (requires 2+ uses of a tag) to unlock your Trigger Matrix.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-6 max-w-lg mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/40 rounded-full border border-white/20 text-text-primary">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Energy Matrix</h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Know your triggers</p>
          </div>
        </div>
      </header>

      {data.drains.length > 0 && data.drains[0].factor > 5 && (
        <div className="bg-accent-coral/10 border border-accent-coral/20 rounded-[2rem] p-5 flex gap-4">
           <AlertTriangle className="text-accent-coral shrink-0" size={20} />
           <div>
             <h3 className="text-xs font-bold uppercase tracking-widest text-accent-coral mb-1">Protective Boundaries</h3>
             <p className="text-xs font-medium text-text-secondary leading-relaxed text-red-900/70">
               "{data.drains[0].name}" strongly spikes your stress. Try to minimize this context today if you can.
             </p>
           </div>
        </div>
      )}

      {/* Energy Drains */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 px-2">
            <BatteryLow size={18} className="text-accent-coral" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">Energy Drains</h2>
         </div>
         {data.drains.length === 0 ? (
            <p className="text-xs font-medium text-text-secondary italic px-2">No consistent drains detected down here.</p>
         ) : (
            <div className="grid grid-cols-1 gap-3">
               {data.drains.map((d, i) => (
                  <div key={i} className="glass-card rounded-3xl p-5 border-l-4 border-l-accent-coral relative overflow-hidden group">
                     <div className="flex justify-between items-center relative z-10">
                        <div>
                           <h4 className="font-bold text-text-primary text-base capitalize">{d.name}</h4>
                           <span className="text-[10px] text-text-secondary/70 uppercase font-bold tracking-wider">{d.count} occurrences</span>
                        </div>
                        <div className="text-right">
                           <div className="text-accent-coral font-black text-xl">+{d.avgStress}</div>
                           <div className="text-[9px] uppercase font-bold tracking-widest text-text-secondary/50">Avg Stress</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </section>

      {/* Energy Radiators */}
      <section className="space-y-4 pt-4">
         <div className="flex items-center gap-2 px-2">
            <Sun size={18} className="text-accent-mint" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">Energy Radiators</h2>
         </div>
         {data.radiators.length === 0 ? (
            <p className="text-xs font-medium text-text-secondary italic px-2">Log positive activities to find your radiators.</p>
         ) : (
            <div className="grid grid-cols-1 gap-3">
               {data.radiators.map((r, i) => (
                  <div key={i} className="glass-card rounded-3xl p-5 border-l-4 border-l-accent-mint relative overflow-hidden">
                     <div className="flex justify-between items-center relative z-10">
                        <div>
                           <h4 className="font-bold text-text-primary text-base capitalize">{r.name}</h4>
                           <span className="text-[10px] text-text-secondary/70 uppercase font-bold tracking-wider">{r.count} occurrences</span>
                        </div>
                        <div className="text-right">
                           <div className="text-accent-mint font-black text-xl">{r.avgMood}/3</div>
                           <div className="text-[9px] uppercase font-bold tracking-widest text-text-secondary/50">Avg Mood</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </section>

      {/* Neutral */}
      {data.neutral.length > 0 && (
        <section className="space-y-4 pt-4">
         <div className="flex items-center gap-2 px-2">
            <ShieldCheck size={18} className="text-accent-sky" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-primary">Reliable / Neutral</h2>
         </div>
         <div className="flex flex-wrap gap-2">
            {data.neutral.map((n, i) => (
               <div key={i} className="bg-white/60 border border-text-primary/10 px-4 py-2 rounded-full text-xs font-bold text-text-secondary flex gap-2 items-center shadow-sm">
                  <span className="capitalize">{n.name}</span>
                  <span className="bg-text-primary/5 px-2 py-0.5 rounded-md text-[9px]">{n.count}</span>
               </div>
            ))}
         </div>
        </section>
      )}

    </div>
  );
};
export default TriggerMatrixScreen;
