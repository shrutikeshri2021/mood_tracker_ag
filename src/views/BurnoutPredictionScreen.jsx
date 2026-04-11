import React, { useState, useEffect } from 'react';
import { getEntries, getBurnoutHistory, saveBurnoutHistory } from '../services/storage';
import { BurnoutEngine } from '../services/advancedBurnoutEngine';
import { AlertTriangle, Info, ArrowLeft, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { isSameDay, format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-md border border-text-primary/10 rounded-2xl p-4 shadow-xl">
        <p className="font-bold text-text-primary text-xs uppercase tracking-widest mb-1">{data.date}</p>
        <p className="font-black text-xl text-accent-coral mb-2">Score: {data.score}%</p>
        {data.tagsString && (
           <div className="border-t border-text-primary/5 pt-2 mt-1">
             <p className="text-[10px] font-bold text-text-secondary uppercase">Triggers Detected:</p>
             <p className="text-xs font-medium text-text-primary leading-tight mt-1">{data.tagsString}</p>
           </div>
        )}
      </div>
    );
  }
  return null;
};

const BurnoutPredictionScreen = ({ onBack }) => {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const entries = getEntries();
    const engine = new BurnoutEngine();
    const calc = engine.calculateBurnoutRisk(entries);
    setResult(calc);
    
    saveBurnoutHistory({
      score: calc.score,
      level: calc.level,
      trend: calc.trend,
      calculatedAt: calc.calculatedAt
    });

    setHistory(getBurnoutHistory().slice(0, 14).reverse());
  }, []);

  if (!result) return null;

  const levelColors = {
    low: '#64D7BE',      // mint
    moderate: '#F7C8BD', // peach
    high: '#FF8EA6',     // coral / orange
    critical: '#FF5C77'  // red
  };
  
  const levelEmoji = {
    low: '🟢',
    moderate: '🟡',
    high: '🟠',
    critical: '🔴'
  };

  const trendArrow = {
    improving: '↗️',
    stable: '→',
    worsening: '↘️'
  };

  return (
    <div className="pb-32 space-y-6 max-w-lg mx-auto">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white/40 rounded-full border border-white/20 text-text-primary">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <BrainCircuit size={24} />
          Burnout Prediction
        </h1>
      </header>

      {result.isInsufficient ? (
        <div className="glass-card rounded-[2.5rem] p-8 text-center space-y-4 shadow-lg">
           <div className="w-16 h-16 bg-accent-lilac/10 rounded-3xl mx-auto flex items-center justify-center text-accent-lilac mb-2">
              <BrainCircuit size={32} />
           </div>
           <h2 className="text-xl font-bold text-text-primary uppercase tracking-tighter">Analysis Pending</h2>
           <p className="text-text-secondary text-sm leading-relaxed px-4">
             {result.recommendation}
           </p>
           <button 
             onClick={() => window.location.reload()} // Quick refresh for state sync
             className="text-xs font-black uppercase tracking-widest text-accent-lilac bg-accent-lilac/5 px-6 py-3 rounded-full mt-4"
           >
             Refresh Engine
           </button>
        </div>
      ) : (
        <>
          {/* Main Gauge Card */}
          <div className="glass-card rounded-[2.5rem] p-8 items-center flex flex-col space-y-6 shadow-lg relative overflow-hidden">
             
             <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Simple SVG Donut Chart */}
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path
                    className="text-text-primary/5"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={levelColors[result.level]}
                    strokeWidth="3"
                    strokeDasharray={`${result.score}, 100`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                   <span className="text-5xl font-black text-text-primary tracking-tighter" style={{ color: levelColors[result.level]}}>{Math.round(result.score)}</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Score</span>
                </div>
             </div>

             <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-white/40">
                   <span className="text-lg">{levelEmoji[result.level]}</span>
                   <span className="font-bold text-text-primary capitalize tracking-wider">{result.level} Risk</span>
                   <span className="text-sm border-l border-text-primary/10 pl-2 ml-1">{trendArrow[result.trend]}</span>
                </div>
             </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white/40 rounded-[2rem] p-6 border border-white/30 space-y-2 relative">
             <div className="flex items-center gap-2 mb-2">
                <Info size={18} className="text-accent-iris" />
                <h3 className="font-bold text-text-primary uppercase tracking-widest text-xs">Recommendation</h3>
             </div>
             <p className="text-sm text-text-secondary leading-relaxed font-medium">
               {result.recommendation}
             </p>
          </div>

          {/* Active Signals */}
          <div className="space-y-4">
             <h3 className="uppercase tracking-widest font-bold text-xs pl-2 text-text-primary">Active Signals</h3>
             {result.signals.length === 0 ? (
               <p className="text-xs text-text-secondary pl-2">No burnout signals currently detected. Great job!</p>
             ) : (
               <div className="space-y-3">
                 {result.signals.map((sig, i) => (
                   <div key={i} className="glass-card rounded-[1.5rem] p-5 flex gap-4 border border-text-primary/5">
                      <div className="text-3xl">{sig.emoji}</div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                           <h4 className="font-bold text-text-primary text-sm">{sig.name}</h4>
                           {sig.severity === 'alert' && <span className="text-[9px] font-black uppercase text-red-500 bg-red-100 px-2 py-0.5 rounded-md">Alert</span>}
                           {sig.severity === 'warning' && <span className="text-[9px] font-black uppercase text-orange-500 bg-orange-100 px-2 py-0.5 rounded-md">Warning</span>}
                        </div>
                        <p className="text-xs text-text-secondary leading-tight">{sig.description}</p>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* History Area Chart */}
          {history.length > 1 && (() => {
            const graphData = history.map(h => {
               const dt = h.calculatedAt ? new Date(h.calculatedAt) : new Date();
               const dateStr = format(dt, 'MMM d');
               
               let dayTags = [];
               try {
                 const entries = getEntries();
                 dayTags = entries
                   .filter(e => isSameDay(new Date(e.timestamp), dt))
                   .flatMap(e => e.tags || []);
               } catch (e) {}
          
               return {
                   date: dateStr,
                   score: Math.round(h.score || 0),
                   level: h.level,
                   tagsString: [...new Set(dayTags)].join(', ')
               }
            });

            return (
              <div className="space-y-4 pt-4">
                <h3 className="uppercase tracking-widest font-bold text-xs pl-2 text-text-primary">Burnout Trajectory</h3>
                <div className="glass-card rounded-[2.5rem] p-6 h-[280px] -mx-2 bg-gradient-to-tr from-accent-coral/5 to-transparent">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF8EA6" stopOpacity={0.7}/>
                            <stop offset="95%" stopColor="#FF8EA6" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(74, 43, 109, 0.05)" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5C4D76', fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5C4D76', fontWeight: 600 }} domain={[0, 'dataMax + 10']} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(74, 43, 109, 0.1)', strokeWidth: 2 }} />
                        <Area type="monotone" dataKey="score" stroke="#FF8EA6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#FF5C77', stroke: '#fff', strokeWidth: 3 }} />
                     </AreaChart>
                   </ResponsiveContainer>
                </div>
              </div>
            );
          })()}
          
          <div className="opacity-50 text-[10px] text-text-secondary text-center leading-relaxed px-4 pt-4 flex gap-2">
             <AlertTriangle size={24} />
             <span>{result.disclaimer}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default BurnoutPredictionScreen;
