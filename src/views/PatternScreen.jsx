import React, { useState, useEffect } from 'react';
import { PatternDetector } from '../services/patternDetector';
import { getEntries } from '../services/storage';
import { ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';

const PatternScreen = ({ onBack }) => {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculate = () => {
    setLoading(true);
    const entries = getEntries();
    const detector = new PatternDetector();
    const result = detector.detectPatterns(entries, []);
    setPatterns(result);
    setLoading(false);
  };

  useEffect(() => {
    calculate();
  }, []);

  const badgeColors = {
    emerging: 'bg-accent-sky text-blue-900',
    confirmed: 'bg-accent-mint text-emerald-900',
    strong: 'bg-accent-lilac text-purple-900'
  };

  return (
    <div className="pb-32 space-y-6 max-w-lg mx-auto">
       <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/40 rounded-full border border-white/20 text-text-primary">
          <ArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
             <BarChart2 size={24} />
             Your Patterns
           </h1>
           <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary/60">
             Insights from real data
           </p>
        </div>
      </header>

      {patterns.length === 0 && !loading ? (
        <div className="p-8 border-2 border-dashed border-text-primary/10 rounded-[2.5rem] text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center text-accent-lilac shadow-sm">
             <BarChart2 size={20} />
          </div>
          <p className="text-sm text-text-secondary font-medium px-4">Keep checking in — patterns will emerge after 5+ entries 📊</p>
        </div>
      ) : (
        <div className="space-y-6">
          {['trigger', 'recovery', 'correlation', 'timing'].map(cat => {
            const catPatterns = patterns.filter(p => p.category === cat);
            if (catPatterns.length === 0) return null;
            return (
              <div key={cat} className="space-y-3">
                 <h3 className="uppercase tracking-widest font-bold text-xs pl-2 text-text-primary">{cat}s</h3>
                 {catPatterns.map(p => (
                    <div key={p.id} className="glass-card rounded-[1.5rem] p-5 border border-text-primary/5 shadow-sm space-y-3">
                       <div className="flex items-start gap-4">
                          <span className="text-3xl">{p.emoji}</span>
                          <div className="flex-1">
                             <h4 className="font-bold text-text-primary text-sm">{p.title}</h4>
                             <p className="text-xs text-text-secondary mt-1 font-medium leading-relaxed">{p.description}</p>
                          </div>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider pt-3 border-t border-text-primary/10">
                          <span className={`px-2 py-1 rounded-md ${badgeColors[p.confidence]}`}>{p.confidence}</span>
                          <span className="text-text-secondary/60">Based on {p.dataPoints} entries</span>
                       </div>
                    </div>
                 ))}
              </div>
            );
          })}
        </div>
      )}

      {patterns.length > 0 && (
        <button onClick={calculate} className="w-full btn-content flex justify-center items-center gap-2 mt-4 text-xs">
           <RefreshCw size={14} /> Refine Patterns
        </button>
      )}
    </div>
  )
};

export default PatternScreen;
