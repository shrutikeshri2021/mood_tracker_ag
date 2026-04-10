import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Download, Trash2, ChevronRight, User, Upload, Heart, Info, X } from 'lucide-react';
import { getProfile, saveProfile, getEntries, clearAllData, exportData, importData, getSettings, saveSettings, getReminders, saveReminders } from '../services/storage';
import { requestNotificationPermission, getNotificationState } from '../services/NotificationService';

const Profile = ({ onTabChange }) => {
  const [profile, setProfile] = useState({});
  const [settings, setSettings] = useState({});
  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState(null);
  const [showRemindersModal, setShowRemindersModal] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setSettings(getSettings());
    setReminders(getReminders());
  }, []);

  const handleExport = () => {
    const data = exportData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `zenithme_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showFeedback('Data exported successfully');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const success = importData(e.target.result);
      if (success) {
        window.location.reload();
      } else {
        showFeedback('Import failed. Invalid file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const showFeedback = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReset = () => {
    if (window.confirm('CRITICAL: This will permanently delete all your data. This action cannot be undone. Proceed?')) {
      clearAllData();
      window.location.reload();
    }
  };

  const toggleReminder = async () => {
    const state = await requestNotificationPermission();
    if (state === 'granted') {
       setShowRemindersModal(true);
    } else {
       showFeedback('Please enable notifications in browser settings', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-32 max-w-lg mx-auto">
      {message && (
        <div className={`fixed top-12 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-2xl z-[100] font-bold text-sm animate-in fade-in slide-in-from-top-4 ${message.type === 'error' ? 'bg-accent-coral text-white' : 'bg-text-primary text-white'}`}>
          {message.text}
        </div>
      )}

      <header className="flex flex-col items-center text-center space-y-4 pt-4">
        <div 
          className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-text-primary text-4xl font-black border-4 border-white premium-shadow transform rotate-3"
          style={{ backgroundColor: profile.avatarColor || '#C8B8F5' }}
        >
          {profile.name ? profile.name[0] : 'Z'}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{profile.name || 'Friend'}</h1>
          <div className="flex items-center justify-center gap-2 text-text-secondary/50 font-bold uppercase tracking-widest text-[10px]">
            <Heart size={10} className="text-accent-lilac" /> 
            Member since {new Date().getFullYear()}
          </div>
        </div>
      </header>

      {/* Goals / Status */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
         {profile.goals?.map(goal => (
           <div key={goal} className="px-4 py-2 bg-white/60 border border-text-primary/5 rounded-full text-[10px] font-black uppercase tracking-widest text-text-secondary whitespace-nowrap">
             {goal}
           </div>
         ))}
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary/40 ml-1">Privacy & Data</h3>
          <div className="glass-card rounded-[2.5rem] overflow-hidden premium-shadow">
            <MenuButton 
              icon={<Bell size={18} />} 
              label="Reminders" 
              value={getNotificationState() === 'granted' ? 'Enabled' : 'Disabled'} 
              onClick={toggleReminder}
            />
            <MenuButton 
              icon={<Download size={18} />} 
              label="Backup as JSON" 
              onClick={handleExport}
            />
            <label className="w-full flex justify-between items-center p-5 active:bg-white/40 transition-colors cursor-pointer border-t border-text-primary/5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-sky/20 rounded-xl text-accent-sky">
                   <Upload size={18} />
                </div>
                <div className="text-sm font-bold text-text-primary">Import Backup</div>
              </div>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              <ChevronRight size={16} className="text-text-secondary/20" />
            </label>
            <MenuButton 
              icon={<Shield size={18} />} 
              label="Privacy Policy" 
              value="Device-Only" 
            />
          </div>
        </section>

        <section className="glass-card rounded-[2.5rem] p-7 space-y-4 border border-aqua/30 bg-aqua/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-accent-mint shadow-sm">
               <Shield size={20} />
            </div>
            <h4 className="font-bold text-text-primary leading-tight">Private Soul Sanctuary</h4>
          </div>
          <p className="text-xs text-text-secondary font-medium leading-relaxed">
            Every mood, thought, and pattern remains encrypted on your browser's local storage. We have no backend, no cloud, and zero tracking. Your growth is your own.
          </p>
        </section>

        <button 
          onClick={handleReset}
          className="w-full py-5 text-accent-coral font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:bg-accent-coral/10 rounded-3xl transition-all"
        >
          <Trash2 size={16} /> Destroy All Records
        </button>

        <div className="text-center pt-8">
          <p className="text-[10px] text-text-secondary/20 font-black tracking-[0.3em] uppercase">Private Burnout Tracker v1.2</p>
        </div>
      </div>

      {showRemindersModal && (
        <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-[110] flex items-end sm:items-center justify-center p-4">
           <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="w-full max-w-md bg-white rounded-[3rem] p-8 space-y-6 premium-shadow"
           >
              <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-text-primary">Daily Reminders</h2>
                 <button onClick={() => setShowRemindersModal(false)} className="p-2 hover:bg-black/5 rounded-full"><X size={20}/></button>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                Choose a time for your daily check-in. We'll send a gentle nudge to your browser.
              </p>
              <div className="space-y-4 pt-2">
                 {[
                   { time: '08:00', label: 'Morning Reflection' },
                   { time: '14:00', label: 'Afternoon Check' },
                   { time: '20:00', label: 'Evening Wind-down' },
                 ].map(preset => (
                   <button 
                    key={preset.time}
                    className="w-full p-5 rounded-3xl border border-text-primary/5 bg-lavender/10 flex justify-between items-center group active:scale-95 transition-all"
                    onClick={() => {
                        saveReminders([...reminders, { id: Date.now(), time: preset.time, enabled: true, label: preset.label }]);
                        setReminders(getReminders());
                        showFeedback(`Reminder set for ${preset.time}`);
                    }}
                   >
                      <div className="text-left font-bold">
                         <div className="text-text-primary">{preset.label}</div>
                         <div className="text-[10px] uppercase text-text-secondary/50 tracking-widest">{preset.time}</div>
                      </div>
                      <PlusSquare size={18} className="text-accent-lilac opacity-40 group-hover:opacity-100" />
                   </button>
                 ))}
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
};

const MenuButton = ({ icon, label, value, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex justify-between items-center p-5 active:bg-white/40 transition-colors border-t first:border-t-0 border-text-primary/5"
  >
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-lavender/20 text-accent-lilac rounded-xl">
        {icon}
      </div>
      <div className="text-left">
        <div className="text-sm font-bold text-text-primary">{label}</div>
        {value && <div className="text-[9px] text-text-secondary/50 font-black uppercase tracking-widest">{value}</div>}
      </div>
    </div>
    <ChevronRight size={16} className="text-text-secondary/20" />
  </button>
);

const PlusSquare = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M12 8v8M8 12h8" />
    </svg>
);

export default Profile;
