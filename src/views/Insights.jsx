import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEntries } from '../services/storage';
import { calculateBurnoutRisk } from '../services/BurnoutEngine';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, Moon, Zap, BarChart3, Info, Sparkles, Star, ChevronRight, Target, Brain } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

const Insights = ({ onTabChange }) => {
  const [entries, setEntries] = useState([]);
  const [risk, setRisk] = useState({ score: 0, level: 'Low' });
  const [chartData, setChartData] = useState([]);
  const [averages, setAverages] = useState({ sleep: '0', focus: '0' });
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const data = getEntries();
      if (!Array.isArray(data)) {
        setEntries([]);
        return;
      }
      
      setEntries(data);
      const currentRisk = calculateBurnoutRisk();
      setRisk(currentRisk || { score: 0, level: 'Low' });

      // Calculate Chart Data
      const sevenDayData = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dayEntries = data.filter(e => {
          try {
            return isSameDay(new Date(e.timestamp), date);
          } catch(e) { return false; }
        });
        
        const avgMood = dayEntries.length > 0 
          ? dayEntries.reduce((acc, curr) => acc + (curr.mood === 'inspired' ? 5 : curr.mood === 'calm' ? 4 : curr.mood === 'okay' ? 3 : curr.mood === 'stressed' ? 2 : 1), 0) / dayEntries.length 
          : null;
        
        const avgStress = dayEntries.length > 0 
          ? dayEntries.reduce((acc, curr) => acc + (curr.stress || 0), 0) / dayEntries.length 
          : null;

        return {
          name: format(date, 'EEE'),
          mood: avgMood,
          stress: avgStress,
        };
      });
      setChartData(sevenDayData);

      // Calculate Averages
      const sleep = data.length > 0 
        ? (data.reduce((acc, curr) => acc + (curr.sleep || 0), 0) / data.length).toFixed(1)
        : '0';
      const focus = data.length > 0
        ? (data.reduce((acc, curr) => acc + (curr.focus || 0), 0) / data.length).toFixed(1)
        : '0';
      setAverages({ sleep, focus });

    } catch (err) {
      console.error("Insights Error:", err);
      setError(true);
    }
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-xl border border-text-primary/5 p-3 rounded-2xl shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary/40 mb-2">{label}</p>
          {payload.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
              <p className="text-xs font-bold text-text-primary">{p.name}: {p.value?.toFixed(1)}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div className="p-12 text-center space-y-4 pt-20">
        <Activity size={48} className="mx-auto text-accent-coral" />
        <h2 className="text-xl font-bold">Data Conflict Detected</h2>
        <p className="text-sm text-text-secondary">We encountered an issue reading your encrypted logs. Please verify your entries in the Journal.</p>
        <button onClick={() => window.location.reload()} className="btn-primary mt-4">Refresh Dashboard</button>
      </div>
    );
  }

  if (entries.length < 3) {
    return (
      <div className="space-y-8 pb-32">
        <header>
          <h1 className="text-3xl font-bold text-text-primary uppercase tracking-tighter">Insights</h1>
          <p className="text-text-secondary text-sm">Real data reveals your hidden patterns.</p>
        </header>

        <div className="glass-card rounded-[3rem] p-12 text-center space-y-6 premium-shadow mt-4">
          <div className="w-20 h-20 bg-lavender/30 rounded-4xl mx-auto flex items-center justify-center text-accent-lilac float-animation">
             <BarChart3 size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-text-primary">Awaiting Your Input</h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-[240px] mx-auto">
              We need at least 3 entries to start weaving your wellness story. Log your day to unlock trends.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <header>
        <h1 className="text-3xl font-bold text-text-primary uppercase tracking-tighter">Insights</h1>
        <p className="text-text-secondary text-sm">Deep dives into your wellbeing data.</p>
      </header>

      {/* Weekly Report Banner */}
      <div 
        onClick={() => onTabChange && onTabChange('weeklyreport')}
        className="glass-card rounded-[2rem] p-6 flex items-center justify-between cursor-pointer active:scale-95 transition-all bg-gradient-to-r from-accent-lilac/5 to-transparent border border-accent-lilac/20"
      >
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center text-accent-lilac shadow-sm">
             <Star size={20} />
           </div>
           <div>
             <div className="font-bold text-text-primary text-sm tracking-wider uppercase">Weekly Report</div>
             <div className="text-[10px] text-text-secondary mt-1 font-bold">Your wrap-up is ready 🧾</div>
           </div>
        </div>
        <div className="text-accent-lilac pr-2">
           <ChevronRight size={20} />
        </div>
      </div>

      {/* Target Matrix Access */}
      <div 
        onClick={() => onTabChange && onTabChange('triggermatrix')}
        className="glass-card rounded-[2rem] p-6 flex items-center justify-between cursor-pointer active:scale-95 transition-all outline outline-1 outline-text-primary/5"
      >
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center text-accent-coral shadow-sm">
             <Target size={20} />
           </div>
           <div>
             <div className="font-bold text-text-primary text-sm tracking-wider uppercase">Trigger Matrix</div>
             <div className="text-[10px] text-text-secondary mt-1 font-bold">Discover your hidden drains</div>
           </div>
        </div>
        <div className="text-accent-coral pr-2">
           <ChevronRight size={20} />
        </div>
      </div>

      {/* Burnout Snapshot */}
      <section className="glass-card rounded-[2.5rem] p-7 premium-shadow space-y-6">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-2">
              <Activity size={18} className="text-accent-coral" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-primary">Burnout Engine</h3>
           </div>
           <span 
            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/40"
            style={{ backgroundColor: `${risk?.color}40`, color: risk?.level === 'High' ? '#D65D7A' : '#261A3C' }}
           >
             {risk?.level || 'Low'} Risk
           </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-text-primary">
            <span>System Equilibrium</span>
            <span>{Math.round(risk?.score || 0)}%</span>
          </div>
          <div className="h-3 w-full bg-text-primary/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${risk?.score || 0}%` }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               className="h-full"
               style={{ backgroundColor: risk?.color || '#9C7CF3' }}
             />
          </div>
        </div>

        <div className="flex gap-4 p-4 bg-white/40 rounded-2xl border border-white/40">
           <Info size={16} className="text-text-secondary shrink-0" />
           <p className="text-[11px] font-medium text-text-secondary leading-relaxed">
             Based on your {entries.length} logs, your "{risk?.level}" status is primarily driven by your {risk?.factors?.avgStress > 6 ? 'high stress levels' : 'fluctuating sleep patterns'}.
           </p>
        </div>
      </section>

      {/* Mood vs Stress Area Chart */}
      <section className="glass-card rounded-[2.5rem] p-7 premium-shadow space-y-6">
        <div className="flex justify-between items-center">
           <h3 className="text-xs font-bold uppercase tracking-widest text-text-primary">7-Day Trajectory</h3>
           <TrendingUp size={16} className="text-accent-lilac" />
        </div>
        <div className="h-60 min-h-[240px] w-full -ml-4">
           {chartData.length > 0 && (
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9C7CF3" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#9C7CF3" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8EA6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#FF8EA6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#5C4D7680' }}
                    dy={10}
                  />
                  <YAxis hide domain={[0, 10]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    name="Mood"
                    dataKey="mood" 
                    stroke="#9C7CF3" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                    connectNulls
                  />
                  <Area 
                    type="monotone" 
                    name="Stress"
                    dataKey="stress" 
                    stroke="#FF8EA6" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    fillOpacity={1} 
                    fill="url(#colorStress)" 
                    connectNulls
                  />
                </AreaChart>
             </ResponsiveContainer>
           )}
        </div>
        <div className="flex justify-center gap-6">
           <LegendItem color="#9C7CF3" label="Mood" />
           <LegendItem color="#FF8EA6" label="Stress" dotted />
        </div>
      </section>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4">
         <MetricBox 
          icon={<Moon size={20} />} 
          title="Avg Sleep" 
          val={`${averages.sleep}h`} 
          color="bg-sky/5" 
          accent="text-accent-sky"
         />
         <MetricBox 
          icon={<Brain size={20} />} 
          title="Avg Focus" 
          val={`${averages.focus}/10`} 
          color="bg-mint/5" 
          accent="text-accent-mint"
         />
      </div>

      {/* Tip */}
      <div className="p-6 bg-lavender/5 rounded-[2rem] border border-lavender/10 flex gap-4">
         <Sparkles size={20} className="text-accent-lilac shrink-0" />
         <p className="text-xs font-bold text-text-primary leading-relaxed italic">
           Tip: Your stress and mood are closely linked. Focus on getting {Math.max(8, Math.round(parseFloat(averages.sleep) + 1))}h of sleep to stabilize your trajectory.
         </p>
      </div>
    </div>
  );
};

const MetricBox = ({ icon, title, val, color, accent }) => (
  <div className={`p-6 rounded-[2rem] space-y-3 ${color} border border-text-primary/5 premium-shadow`}>
    <div className={`w-10 h-10 rounded-2xl bg-white flex items-center justify-center ${accent} shadow-sm`}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-black text-text-primary tracking-tighter">{val}</div>
      <div className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest">{title}</div>
    </div>
  </div>
);

const LegendItem = ({ color, label, dotted }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-1 rounded-full ${dotted ? 'border-b-2 border-dashed' : ''}`} style={{ backgroundColor: dotted ? 'transparent' : color, borderColor: color }}></div>
    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/50">{label}</span>
  </div>
);

export default Insights;
