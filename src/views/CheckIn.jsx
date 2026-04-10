import React, { useState, useEffect } from 'react';
import { saveEntry, getProfile } from '../services/storage';
import { Heart, Zap, Moon, Brain, ChevronLeft, Save, Sparkles, AlertCircle, Coffee } from 'lucide-react';
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
  const [profile, setProfile] = useState({});
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
    onComplete();
  };

  return (
    <div className="pb-16 space-y-8 max-w-lg mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Check-in</h1>
          <p className="text-text-secondary text-sm">How is your state right now, {profile.name}?</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white border border-border-soft flex items-center justify-center text-accent-lilac shadow-sm">
          <Heart size={20} />
        </div>
      </header>

      <div className="space-y-10">
        {/* Mood Grid */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary/60 ml-1">Current Mood</h3>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => handleMoodSelect(m)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  entry.mood === m.value 
                    ? "bg-white shadow-xl scale-110 border border-text-primary/5 z-10" 
                    : "opacity-40 grayscale-[0.5]"
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-[8px] font-black uppercase tracking-tighter text-text-primary">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Metrics Card */}
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

        {/* Tags */}
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
                    : 'bg-white text-text-primary border border-text-primary/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Note */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary/60 ml-1">Optional Note</h3>
          <div className="relative">
            <textarea
              value={entry.notes}
              onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
              placeholder="Any specific thoughts or triggers?"
              className="w-full bg-white/60 backdrop-blur-sm rounded-3xl p-5 min-h-[120px] text-sm font-medium border border-text-primary/5 focus:ring-4 focus:ring-accent-lilac/10 outline-none transition-all placeholder:text-text-secondary/30"
            />
            <div className="absolute top-4 right-4 text-accent-lilac opacity-20">
               <Coffee size={20} />
            </div>
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full btn-primary flex items-center justify-center gap-3 py-5 text-lg group"
        >
          Complete Log <Save size={20} className="group-active:scale-90 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CheckIn;
