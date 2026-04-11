import React, { useState, useEffect } from 'react';
import { getEntries, getProfile } from '../services/storage';
import { calculateBurnoutRisk, getRecoverySuggestions } from '../services/BurnoutEngine';
import { BurnoutEngine } from '../services/advancedBurnoutEngine';
import { PatternDetector } from '../services/patternDetector';
import { CopingSuggestionEngine } from '../services/copingSuggestionEngine';
import { BalanceEngine } from '../services/balanceEngine';
import { TriggerEngine } from '../services/triggerEngine';
import { ForecastEngine } from '../services/forecastEngine';
import { StreakEngine } from '../services/streakEngine';
import { Wind, Coffee, Brain, Sparkles, ChevronRight, Zap, TrendingUp, Calendar, ArrowRight, BrainCircuit, BarChart2, Feather } from 'lucide-react';
import Breathing from './Breathing';
import Grounding from './Grounding';
import { format } from 'date-fns';

const Home = ({ onTabChange }) => {
  const [entries, setEntries] = useState([]);
  const [profile, setProfile] = useState({});
  const [showBreathing, setShowBreathing] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [risk, setRisk] = useState({ score: 0, level: 'Low' });
  const [advRisk, setAdvRisk] = useState({ score: 0, level: 'low', trend: 'stable' });
  const [patternsCount, setPatternsCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [balance, setBalance] = useState({ score: 50, status: "Neutral", history: [] });
  const [forecast, setForecast] = useState(null);
  const [streakData, setStreakData] = useState(null);

  useEffect(() => {
    const data = getEntries();
    setEntries(data);
    setProfile(getProfile());
    setRisk(calculateBurnoutRisk());
    
    const engine = new BurnoutEngine();
    setAdvRisk(engine.calculateBurnoutRisk(data));

    const pDetector = new PatternDetector();
    setPatternsCount(pDetector.detectPatterns(data).length);

    const copeEngine = new CopingSuggestionEngine();
    setSuggestions(copeEngine.generateSuggestions(data, data[0]?.mood));

    const balEngine = new BalanceEngine();
    setBalance(balEngine.calculateScore(data));

    const tEngine = new TriggerEngine();
    const tData = tEngine.analyzeTriggers(data);

    const fEngine = new ForecastEngine();
    setForecast(fEngine.generateForecast(data, tData));

    const sEngine = new StreakEngine();
    setStreakData(sEngine.calculateGrowth(data));
  }, []);

  const latestEntry = entries[0] || null;
  const greetings = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const streak = () => {
    if (entries.length === 0) return 0;
    
    // Sort entries just in case, though they should be sorted
    const sortedEntries = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let currentStreak = 0;
    let checkDate = new Date();
    checkDate.setHours(0,0,0,0);
    
    const firstEntryDate = new Date(sortedEntries[0].timestamp);
    firstEntryDate.setHours(0,0,0,0);
    
    const diffDaysFirst = (checkDate.getTime() - firstEntryDate.getTime()) / (1000 * 3600 * 24);
    
    // Streak breaks if no entry today or yesterday
    if (diffDaysFirst > 1) return 0;
    
    let currentDateForStreak = firstEntryDate;
    currentStreak = 1;

    for (let i = 1; i < sortedEntries.length; i++) {
        const entryDate = new Date(sortedEntries[i].timestamp);
        entryDate.setHours(0,0,0,0);
        const diffDays = (currentDateForStreak.getTime() - entryDate.getTime()) / (1000 * 3600 * 24);

        if (diffDays === 0) {
            continue;
        } else if (diffDays === 1) {
            currentStreak++;
            currentDateForStreak = entryDate;
        } else {
            break;
        }
    }
    return currentStreak;
  };

  if (showBreathing) {
    return <Breathing onBack={() => setShowBreathing(false)} />;
  }

  if (showGrounding) {
    return <Grounding onBack={() => setShowGrounding(false)} />;
  }

  return (
    <div className="space-y-8 pb-32">
      <header className="flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-secondary/50 mb-1">
            {format(new Date(), 'EEEE, MMMM do')}
          </p>
          <h1 className="text-3xl font-bold text-text-primary">
            {greetings()}, {profile.name || 'Friend'}
          </h1>
        </div>
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-text-primary font-bold text-lg premium-shadow border-2 border-white transform rotate-3"
          style={{ backgroundColor: profile.avatarColor || '#C8B8F5' }}
        >
          {profile.name ? profile.name[0] : 'Z'}
        </div>
      </header>

      {/* ⚖️ Emotional Balance Score */}
      <div className="glass-card rounded-[2.5rem] p-7 premium-shadow relative overflow-hidden border border-text-primary/5 bg-gradient-to-tr from-accent-mint/10 via-transparent to-transparent">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-primary">System Balance</h3>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/60 text-text-secondary border border-text-primary/10">
               {balance.status}
            </span>
         </div>

         <div className="flex items-end gap-6">
            <div>
               <div className="text-6xl font-black text-text-primary tracking-tighter" style={{ color: balance.score > 60 ? '#64D7BE' : balance.score < 40 ? '#FF8EA6' : '#9C7CF3' }}>
                  {balance.score}
               </div>
               <div className="text-[10px] font-bold text-text-secondary mt-1 uppercase tracking-widest">Rolling 3-day score</div>
            </div>

            {/* Micro-chart showing history */}
            {balance.history && balance.history.length > 0 && (
               <div className="flex-1 flex items-end justify-end gap-2 h-16 pb-2 border-b-2 border-dotted border-text-primary/10 relative">
                 {balance.history.slice(-5).map((sc, i) => (
                    <div 
                       key={i} 
                       className="w-4 rounded-t-xl transition-all shadow-sm"
                       style={{ 
                          height: `${Math.max(10, sc)}%`, 
                          backgroundColor: i === balance.history.slice(-5).length -1 ? (sc >= 60 ? '#64D7BE' : sc <= 40 ? '#FF8EA6' : '#9C7CF3') : '#CBD5E1',
                          opacity: i === balance.history.slice(-5).length -1 ? 1 : 0.6
                       }}
                    ></div>
                 ))}
               </div>
            )}
         </div>
      </div>

      {/* Burnout Risk Card */}
      <div className="glass-card rounded-[2.5rem] p-7 premium-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-text-primary opacity-5">
          <TrendingUp size={80} strokeWidth={1} />
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full pulse-animation" style={{ backgroundColor: risk.color }}></div>
            <h3 className="font-bold text-text-primary text-sm uppercase tracking-widest">Burnout Risk</h3>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-white/40 border border-white/20">
            {risk.level || 'Stability'}
          </span>
        </div>
        
        {entries.length < 3 ? (
          <div className="space-y-4">
            <p className="text-text-secondary text-sm leading-relaxed">
              Log {3 - entries.length} more check-ins to unlock your personalized burnout risk assessment.
            </p>
            <button 
              onClick={() => onTabChange('checkin')}
              className="btn-content w-full flex items-center justify-center gap-2 text-xs"
            >
              Start First Log <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-2 w-full bg-text-primary/5 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000" 
                style={{ width: `${risk.score}%`, backgroundColor: risk.color }}
              ></div>
            </div>
            <p className="text-text-primary font-medium text-sm">
              {risk.level === 'High' ? "Your indicators suggest high stress. Let's prioritize rest." : 
               risk.level === 'Moderate' ? "You're managing, but balance is tipping. Take it slow." :
               "Your balance looks strong. Keep maintaining those boundaries."}
            </p>
            <div className="pt-2">
               {getRecoverySuggestions(risk).slice(0, 1).map((s, i) => (
                 <div key={i} className="flex gap-3 items-center text-xs text-text-secondary bg-white/30 p-3 rounded-xl border border-white/20">
                    <Sparkles size={14} className="text-accent-lilac" />
                    {s}
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* 🧠 Advanced Burnout Prediction */}
      <div 
        onClick={() => onTabChange('burnoutprediction')}
        className="glass-card rounded-[2rem] p-6 premium-shadow flex items-center justify-between cursor-pointer active:scale-95 transition-all outline outline-1 outline-text-primary/5"
      >
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full flex items-center justify-center border-4 border-text-primary/5">
             <span className="font-black text-xl text-text-primary">{Math.round(advRisk.score)}</span>
             <svg className="absolute w-full h-full transform -rotate-90 top-0 left-0" viewBox="0 0 36 36">
               <path
                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                 fill="none"
                 stroke="#8a6cf0"
                 strokeWidth="3"
                 strokeDasharray={`${advRisk.score}, 100`}
                 className="transition-all duration-1000 ease-out"
               />
             </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit size={16} className="text-accent-iris" />
              <span className="font-bold text-text-primary text-sm uppercase tracking-wider">Prediction</span>
            </div>
            <div className="text-xs text-text-secondary mt-1 font-medium capitalize">
               {advRisk.level} Risk Level {advRisk.trend === 'worsening' ? '↘️' : advRisk.trend === 'improving' ? '↗️' : '→'}
            </div>
          </div>
        </div>
        <div className="text-accent-iris text-xs font-bold uppercase tracking-widest flex items-center">
           View <ChevronRight size={16} />
        </div>
      </div>

      {/* 📊 Patterns Detected Card */}
      <div 
        onClick={() => onTabChange('pattern')}
        className="glass-card rounded-[2rem] p-6 premium-shadow flex items-center justify-between cursor-pointer active:scale-95 transition-all outline outline-1 outline-text-primary/5 -mt-4"
      >
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-accent-sky/20 rounded-full flex items-center justify-center text-blue-500 shadow-inner">
             <BarChart2 size={24} />
           </div>
           <div>
             <div className="font-bold text-text-primary text-sm uppercase tracking-wider">Patterns Detected</div>
             <div className="text-xs text-text-secondary mt-1 font-medium">
               {patternsCount > 0 ? `${patternsCount} meaningful insights active` : 'Keep tracking to unlock'}
             </div>
           </div>
        </div>
        <div className="text-blue-500 text-xs font-bold uppercase tracking-widest flex items-center">
           View <ChevronRight size={16} />
        </div>
      </div>

      {/* 🧘 Smart Coping Suggestions - Top 2 */}
      {suggestions.length > 0 && (
         <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
              <h3 className="text-xs uppercase font-bold text-text-primary tracking-widest">Today's Suggestions</h3>
              <button onClick={() => onTabChange('coping')} className="text-[10px] font-bold text-accent-lilac uppercase tracking-widest">View All</button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {suggestions.slice(0, 2).map((s) => (
                 <div key={s.id} onClick={() => s.actionScreen !== 'none' && onTabChange(s.actionScreen)} className="glass-card rounded-[1.5rem] p-4 flex items-center gap-4 cursor-pointer active:scale-95 transition-all outline outline-1 outline-text-primary/5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-text-primary/5">
                      {s.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-text-primary">{s.title}</h4>
                      <p className="text-[10px] text-text-secondary mt-0.5 font-medium line-clamp-1">{s.description}</p>
                    </div>
                    {s.actionScreen !== 'none' && <ChevronRight size={16} className="text-text-secondary/40 pr-1" />}
                 </div>
              ))}
            </div>
         </div>
      )}

      {/* 🔮 Tomorrow's Forecast (Shows > 4:00 PM) */}
      {forecast && new Date().getHours() >= 16 && (
        <div className="glass-card rounded-[2.5rem] p-7 premium-shadow border border-accent-iris/20 bg-gradient-to-br from-accent-iris/5 to-transparent relative overflow-hidden">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-text-primary">Tomorrow's Forecast</h3>
              <span className="text-xl">🔮</span>
           </div>
           
           <div className="flex items-center gap-6 mt-2">
              <div className="text-5xl">{forecast.expectedMoodIcon}</div>
              <div>
                 <div className="text-sm font-bold text-text-primary capitalize mb-1">Expected: {forecast.expectedMood}</div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Est Energy:</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(v => (
                         <div key={v} className={`w-3 h-3 rounded-[3px] ${v <= Math.ceil(forecast.expectedEnergy/2) ? 'bg-accent-iris' : 'bg-text-primary/10'}`}></div>
                      ))}
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-5 p-3 bg-white/40 border border-white/40 rounded-xl">
             <p className="text-[11px] font-bold text-text-secondary leading-relaxed italic">{forecast.caveat}</p>
           </div>
        </div>
      )}

      {/* Self-Care Quick Tools */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-xs uppercase font-bold text-text-primary tracking-widest">Calm Tools</h3>
          <button onClick={() => setShowBreathing(true)} className="text-[10px] font-bold text-accent-lilac uppercase tracking-widest">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setShowBreathing(true)}
            className="bg-sky/30 border border-sky/20 rounded-3xl p-4 text-left space-y-3 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-accent-sky shadow-sm">
              <Wind size={20} />
            </div>
            <div>
              <div className="font-bold text-sm text-text-primary">Breathing</div>
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">60 Sec Reset</div>
            </div>
          </button>
          <button 
            onClick={() => setShowGrounding(true)}
            className="bg-aqua/30 border border-aqua/20 rounded-3xl p-4 text-left space-y-3 active:scale-95 transition-all w-full"
          >
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-accent-mint shadow-sm">
              <Brain size={20} />
            </div>
            <div>
              <div className="font-bold text-sm text-text-primary">Grounding</div>
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">5-4-3-2-1</div>
            </div>
          </button>
        </div>
      </section>

      {/* Latest Check-in / Empty State */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase font-bold text-text-primary tracking-widest px-1">Recent Reflection</h3>
        {latestEntry ? (
          <div 
            onClick={() => onTabChange('journal')}
            className="glass-card rounded-[2rem] p-5 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-lavender/20 flex items-center justify-center text-2xl">
                {latestEntry.moodIcon || '😌'}
              </div>
              <div>
                <div className="font-bold text-text-primary capitalize">{latestEntry.mood}</div>
                <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                  {format(new Date(latestEntry.timestamp), 'MMM d, h:mm a')}
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-text-secondary/30" />
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-text-primary/10 rounded-[2.5rem] text-center space-y-3">
             <div className="w-12 h-12 bg-white rounded-2xl mx-auto flex items-center justify-center text-accent-lilac shadow-sm">
               <Sparkles size={20} />
             </div>
             <p className="text-sm text-text-secondary font-medium">Your first check-in will unlock your mood trend.</p>
             <button 
                onClick={() => onTabChange('checkin')}
                className="text-xs font-bold text-text-primary underline underline-offset-4"
             >
               Start now
             </button>
          </div>
        )}
      </section>

      {/* Pro Tip */}
      <div className="bg-peach/20 rounded-3xl p-5 border border-peach/30 flex gap-4 items-center">
        <div className="w-10 h-10 min-w-[40px] bg-white rounded-xl shadow-sm flex items-center justify-center text-accent-coral font-bold">
          <Coffee size={18} />
        </div>
        <p className="text-xs font-medium text-text-secondary leading-relaxed">
          Pro-tip: Try leaving your laptop in another room after 7 PM to reduce 'micro-stress'.
        </p>
      </div>
    </div>
  );
};

export default Home;
