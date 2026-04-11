import React, { useState, useEffect } from 'react';
import { saveEntry, getProfile, getEntries } from '../services/storage';
import { CopingSuggestionEngine } from '../services/copingSuggestionEngine';
import { Heart, Zap, Moon, Brain, ChevronLeft, Save, Sparkles, AlertCircle, Coffee, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const moods = [
  { label: 'Exhausted', emoji: '😫', value: 'exhausted', color: '#FF8EA6' },
  { label: 'Stressy', emoji: '😟', value: 'stressed', color: '#F7C8BD' },
  { label: 'Okay', emoji: '😐', value: 'okay', color: '#FBE7F1' },
  { label: 'Calm', emoji: '😌', value: 'calm', color: '#BEF1EC' },
  { label: 'Inspired', emoji: '🤩', value: 'inspired', color: '#67B9FF' },
];

const tags = [
  'Deadlines', 'Meetings', 'Deep Work', 'Social interaction', 
  'Exercise', 'Rest', 'Hobbies', 'Family', 'Low Sleep', 
  'Conflict', 'Overthinking', 'Win'
];

const SliderField = ({ label, value, onChange, icon: Icon, color }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center px-1">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <span className="text-sm font-bold text-text-primary">{label}</span>
      </div>
      <span className="text-lg font-black text-text-primary">{value}</span>
    </div>
    <div className="relative h-6 flex items-center">
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-text-primary/5 rounded-full appearance-none cursor-pointer accent-text-primary"
      />
    </div>
  </div>
);

const CheckIn = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({});
  const [topSuggestion, setTopSuggestion] = useState(null);
  const [entry, setEntry] = useState({
    mood: 'okay',
    moodIcon: '😐',
    stress: 5,
    energy: 5,
    sleep: 7,
    focus: 6,
    notes: '',
    tags: [],
  });

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const handleMoodSelect = (m) => {
    setEntry({ ...entry, mood: m.value, moodIcon: m.emoji });
  };

  const handleTagToggle = (tag) => {
    const newTags = entry.tags.includes(tag)
      ? entry.tags.filter(t => t !== tag)
      : [...entry.tags, tag];
    setEntry({ ...entry, tags: newTags });
  };

  const handleSave = () => {
    const finalEntry = {
      ...entry,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    saveEntry(finalEntry);
    
    const engine = new CopingSuggestionEngine();
    const suggestions = engine.generateSuggestions(getEntries(), finalEntry.mood);
    setTopSuggestion(suggestions[0]);

    setStep(4);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  return (
    <div className="pb-32 space-y-6 max-w-lg mx-auto">
      {step < 4 && (
        <header className="space-y-6">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
               {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="p-2 bg-white/40 rounded-full border border-white/20 text-text-primary">
                    <ChevronLeft size={20} />
                  </button>
               )}
               <div>
                  <h1 className="text-2xl font-bold text-text-primary">Check-in</h1>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Step {step} of 3</p>
               </div>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-white border border-border-soft flex items-center justify-center text-accent-lilac shadow-sm">
               <Heart size={16} />
             </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-text-primary/5 h-2 rounded-full overflow-hidden">
             <div className="bg-accent-lilac h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </header>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-10 pt-4">
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-text-primary text-center">How are you feeling right now?</h3>
              <div className="grid grid-cols-2 gap-4">
                {moods.slice(0, 4).map((m) => (
                  <button
                    key={m.value}
                    onClick={() => handleMoodSelect(m)}
                    className={`flex flex-col items-center justify-center gap-2 p-6 rounded-[2rem] transition-all ${
                      entry.mood === m.value 
                        ? "bg-white shadow-xl border border-text-primary/5 scale-[1.02]" 
                        : "bg-white/40 border border-transparent opacity-70"
                    }`}
                  >
                    <span className="text-5xl mb-2">{m.emoji}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-text-primary">{m.label}</span>
                  </button>
                ))}
              </div>
              <button
                 key={moods[4].value}
                 onClick={() => handleMoodSelect(moods[4])}
                 className={`w-full flex items-center justify-center gap-4 p-5 rounded-[2rem] transition-all mt-4 ${
                    entry.mood === moods[4].value ? "bg-white shadow-xl border border-text-primary/5 scale-[1.02]" : "bg-white/40 border border-transparent opacity-70"
                 }`}
              >
                  <span className="text-3xl">{moods[4].emoji}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-text-primary">{moods[4].label}</span>
              </button>
            </section>
            
            <button
               onClick={() => setStep(2)}
               className="w-full btn-primary flex items-center justify-center gap-3 py-5 text-sm group"
            >
               Continue <ArrowRight size={18} className="group-active:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-10 pt-4">
            <section className="glass-card rounded-[2.5rem] p-8 space-y-10 premium-shadow">
               <SliderField 
                 label="Stress Level" 
                 value={entry.stress} 
                 onChange={(val) => setEntry({ ...entry, stress: val })}
                 icon={AlertCircle}
                 color="#FF8EA6"
               />
               <SliderField 
                 label="Energy Level" 
                 value={entry.energy} 
                 onChange={(val) => setEntry({ ...entry, energy: val })}
                 icon={Zap}
                 color="#67B9FF"
               />
               <SliderField 
                 label="Sleep Quality" 
                 value={entry.sleep} 
                 onChange={(val) => setEntry({ ...entry, sleep: val })}
                 icon={Moon}
                 color="#9C7CF3"
               />
               <SliderField 
                 label="Focus" 
                 value={entry.focus} 
                 onChange={(val) => setEntry({ ...entry, focus: val })}
                 icon={Brain}
                 color="#64D7BE"
               />
             </section>

             <button
               onClick={() => setStep(3)}
               className="w-full btn-primary flex items-center justify-center gap-3 py-5 text-sm group"
             >
               Add Context <ArrowRight size={18} className="group-active:translate-x-1 transition-transform" />
             </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-8 pt-4">
            <section className="space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary/60 ml-1">What's influencing this?</h3>
               <div className="flex flex-wrap gap-2">
                 {tags.map(tag => (
                   <button
                     key={tag}
                     onClick={() => handleTagToggle(tag)}
                     className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                       entry.tags.includes(tag)
                         ? 'bg-text-primary text-white shadow-md'
                         : 'bg-white/60 text-text-primary border border-text-primary/10'
                     }`}
                   >
                     {tag}
                   </button>
                 ))}
               </div>
             </section>

             <section className="space-y-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary/60 ml-1">Optional Note</h3>
               <div className="relative">
                 <textarea
                   value={entry.notes}
                   onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
                   placeholder="Any specific thoughts or triggers?"
                   className="w-full bg-white/60 backdrop-blur-sm rounded-3xl p-5 min-h-[120px] text-sm font-medium border border-text-primary/5 focus:ring-4 focus:ring-accent-lilac/10 outline-none transition-all placeholder:text-text-secondary/40"
                 />
                 <div className="absolute top-4 right-4 text-accent-lilac opacity-20">
                    <Coffee size={20} />
                 </div>
               </div>
             </section>

             <button
               onClick={handleSave}
               className="w-full btn-primary flex items-center justify-center gap-3 py-5 text-sm group bg-accent-mint text-text-primary hover:bg-accent-mint/90 border-[#8ce3d0]"
             >
               Complete Log <Save size={18} className="group-active:scale-90 transition-transform" />
             </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" variants={pageVariants} initial="initial" animate="in" exit="out" className="space-y-8 pt-10 text-center">
            <div className="w-24 h-24 bg-accent-mint/20 rounded-[3rem] mx-auto flex items-center justify-center text-accent-mint shadow-inner">
               <CheckCircle2 size={48} />
            </div>
            <div>
               <h2 className="text-3xl font-black text-text-primary tracking-tight">Saved successfully!</h2>
               <p className="text-sm font-medium text-text-secondary mt-2">Your data is secured locally.</p>
            </div>

            {topSuggestion && (
               <div className="glass-card rounded-[2rem] p-6 text-left border border-accent-lilac/20 bg-gradient-to-tr from-accent-lilac/10 to-transparent mt-8 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-accent-lilac mb-4 flex items-center gap-2"><Sparkles size={12}/> Recommended right now</h3>
                  <div className="flex gap-4 items-center">
                     <div className="text-4xl">{topSuggestion.emoji}</div>
                     <div>
                        <h4 className="font-bold text-sm text-text-primary">{topSuggestion.title}</h4>
                        <p className="text-xs text-text-secondary mt-1">{topSuggestion.description}</p>
                     </div>
                  </div>
               </div>
            )}

            <button
               onClick={onComplete}
               className="w-full btn-content flex items-center justify-center gap-3 py-5 text-sm mt-8"
            >
               Return to Dashboard <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckIn;
