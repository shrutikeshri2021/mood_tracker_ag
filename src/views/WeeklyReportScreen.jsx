import React, { useState, useEffect } from 'react';
import { getEntries, getWeeklyReports, saveWeeklyReport } from '../services/storage';
import { WeeklyReportEngine } from '../services/weeklyReportEngine';
import { PatternDetector } from '../services/patternDetector';
import { BurnoutEngine } from '../services/advancedBurnoutEngine';
import { ArrowLeft, Save, Star, AlertTriangle, TrendingUp, Eye } from 'lucide-react';

const WeeklyReportScreen = ({ onBack }) => {
  const [report, setReport] = useState(null);
  const [pastReports, setPastReports] = useState([]);
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const records = getWeeklyReports();
    setPastReports(records);

    const entries = getEntries();
    
    const engine = new WeeklyReportEngine();
    const pDetector = new PatternDetector();
    const patterns = pDetector.detectPatterns(entries);
    
    const bEngine = new BurnoutEngine();
    const bResult = bEngine.calculateBurnoutRisk(entries);

    const activeReport = engine.generateReport(entries, patterns, bResult);
    
    if (activeReport) {
      const existing = records.find(r => r.weekLabel === activeReport.weekLabel);
      if (existing) {
        setReport(existing);
        setReflection(existing.userReflection || "");
      } else {
        setReport(activeReport);
      }
    }
  }, []);

  const handleSave = () => {
    if (report) {
       const updated = { ...report, userReflection: reflection };
       saveWeeklyReport(updated);
       setSaved(true);
       setTimeout(() => setSaved(false), 2000);
    }
  };

  if (!report) {
    return (
      <div className="pb-32 space-y-6 max-w-lg mx-auto">
        <header className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white/40 rounded-full border border-white/20 text-text-primary">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Weekly Report</h1>
        </header>
        <div className="p-8 border-2 border-dashed border-text-primary/10 rounded-[2.5rem] text-center space-y-4 shadow-sm bg-white/30 mt-6">
           <div className="w-16 h-16 bg-white rounded-3xl mx-auto flex items-center justify-center text-accent-lilac shadow-sm">
             <Star size={24} />
           </div>
           <p className="text-sm text-text-primary font-medium px-4 leading-relaxed">Complete your first week of check-ins to unlock your Weekly Report 🧾✨</p>
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
            <h1 className="text-2xl font-bold text-text-primary">Your Week</h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">{report.weekLabel}</p>
          </div>
        </div>
      </header>

      {/* Hero Wrapped Card */}
      <div className="glass-card rounded-[2.5rem] p-8 space-y-6 premium-shadow relative overflow-hidden bg-gradient-to-br from-white/60 to-accent-lilac/10">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={100} />
         </div>
         
         <div>
            <h2 className="text-xl font-bold text-text-primary">At a Glance</h2>
            <div className="grid grid-cols-2 gap-4 mt-6">
               <div className="bg-white/40 p-4 rounded-2xl"><span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block mb-1">Check-ins</span><p className="font-bold text-xl">{report.totalCheckIns}</p></div>
               <div className="bg-white/40 p-4 rounded-2xl"><span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block mb-1">Journals</span><p className="font-bold text-xl">{report.totalJournals}</p></div>
               <div className="bg-white/40 p-4 rounded-2xl"><span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block mb-1">Avg Stress</span><p className="font-bold text-xl">{report.avgStress}/10</p></div>
               <div className="bg-white/40 p-4 rounded-2xl"><span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary block mb-1">Avg Energy</span><p className="font-bold text-xl">{report.avgEnergy}/10</p></div>
            </div>
         </div>

         <div className="pt-6 border-t border-text-primary/10">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-2">Weekly Insight</h3>
            <p className="text-sm font-medium text-text-primary leading-relaxed">
               {report.weeklyInsight}
            </p>
         </div>
      </div>

      {report.bestDay && report.hardestDay && (
         <div className="grid grid-cols-2 gap-4">
           <div className="glass-card rounded-3xl p-5 space-y-2 border border-accent-mint/30 bg-accent-mint/5 relative overflow-hidden">
             <div className="flex items-center gap-2 text-accent-mint font-bold text-[10px] uppercase tracking-widest"><Star size={12}/> Best Day</div>
             <p className="font-bold text-text-primary text-lg">{report.bestDay.day}</p>
             <p className="text-xs text-text-secondary capitalize font-medium">{report.bestDay.mood} • {report.bestDay.reason}</p>
           </div>
           <div className="glass-card rounded-3xl p-5 space-y-2 border border-accent-coral/30 bg-accent-coral/5 relative overflow-hidden">
             <div className="flex items-center gap-2 text-accent-coral font-bold text-[10px] uppercase tracking-widest"><AlertTriangle size={12}/> Hardest</div>
             <p className="font-bold text-text-primary text-lg">{report.hardestDay.day}</p>
             <p className="text-xs text-text-secondary capitalize font-medium">{report.hardestDay.mood} • {report.hardestDay.reason}</p>
           </div>
         </div>
      )}

      {/* Reflection Area */}
      <div className="space-y-4 pt-4">
         <h3 className="text-xs font-bold uppercase tracking-widest text-text-primary px-2">Your Reflection</h3>
         <textarea 
            className="w-full bg-white/60 border border-text-primary/5 rounded-[2rem] p-6 text-sm font-medium focus:ring-4 focus:ring-accent-lilac/20 outline-none transition-all resize-none shadow-sm h-32"
            placeholder="Write a tiny note about this week to your future self..."
            value={reflection}
            onChange={e => setReflection(e.target.value)}
         ></textarea>
         <button onClick={handleSave} className="btn-content w-full flex justify-center items-center gap-2 py-4">
            {saved ? "Saved ✨" : <><Save size={16}/> Save Report</>}
         </button>
      </div>

      {/* Past Reports List */}
      {pastReports.length > 0 && (
         <div className="space-y-4 pt-6 mt-6 border-t border-text-primary/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-primary px-2">Archive</h3>
            {pastReports.map((pr, i) => (
               <div key={pr.id || i} className="glass-card rounded-[1.5rem] p-5 flex justify-between items-center cursor-pointer opacity-80 hover:opacity-100 transition-all border border-text-primary/5">
                  <div>
                    <h4 className="font-bold text-text-primary text-sm">{pr.weekLabel}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-text-secondary mt-1">Avg Stress: {pr.avgStress}</p>
                  </div>
                  <Eye size={18} className="text-accent-iris" />
               </div>
            ))}
         </div>
      )}

    </div>
  );
};
export default WeeklyReportScreen;
