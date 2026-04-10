import React, { useState, useEffect } from 'react';
import { getEntries, deleteEntry } from '../services/storage';
import { Search, Filter, Calendar, Tag, Trash2, ChevronRight, BookOpen, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      const updated = deleteEntry(id);
      setEntries(updated);
    }
  };

  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.notes?.toLowerCase().includes(search.toLowerCase()) || 
                          e.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
                          e.mood?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'stressed') return matchesSearch && e.stress >= 7;
    if (filter === 'notes') return matchesSearch && e.notes && e.notes.length > 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-32">
      <header>
        <h1 className="text-3xl font-bold text-text-primary">Timeline</h1>
        <p className="text-text-secondary text-sm">Every entry is a window into your growth.</p>
      </header>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/40" size={18} />
          <input 
            type="text"
            placeholder="Search moods, notes, or tags..."
            className="w-full bg-white/60 border border-text-primary/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-accent-lilac/10 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'stressed', 'notes'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                filter === f ? 'bg-text-primary text-white shadow-md' : 'bg-white text-text-primary border border-text-primary/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="p-12 text-center space-y-4 glass-card rounded-[3rem]">
          <div className="w-16 h-16 bg-white rounded-3xl mx-auto flex items-center justify-center text-accent-lilac shadow-sm mb-4">
             <BookOpen size={32} />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Clean Slate</h3>
          <p className="text-text-secondary text-sm">
            {search ? "We couldn't find any matches for your search." : "Your journal is waiting for its first spark of reflection."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="glass-card rounded-[2.5rem] p-6 space-y-4 premium-shadow relative group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm border border-text-primary/5">
                    {entry.moodIcon || '😐'}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary capitalize text-lg">{entry.mood}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-text-secondary/50">
                      <Clock size={12} strokeWidth={3} />
                      {format(new Date(entry.timestamp), 'MMM d • h:mm a')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                   {entry.stress >= 7 && (
                     <div className="w-8 h-8 rounded-xl bg-accent-coral/10 text-accent-coral flex items-center justify-center">
                        <AlertCircle size={16} />
                     </div>
                   )}
                   <button 
                    onClick={() => handleDelete(entry.id)}
                    className="w-8 h-8 rounded-xl bg-text-primary/5 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-accent-coral/10 hover:text-accent-coral"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>

              {entry.notes && (
                <div className="bg-white/40 p-4 rounded-2xl border border-white/40">
                  <p className="text-sm text-text-primary leading-relaxed">
                    {entry.notes}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-1">
                <div className="flex gap-1 pr-2 border-r border-text-primary/10 mr-1">
                   <MetricBadge label="S" val={entry.stress} color="bg-accent-coral" />
                   <MetricBadge label="E" val={entry.energy} color="bg-accent-sky" />
                </div>
                {entry.tags?.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-white/60 rounded-full text-[10px] font-bold text-text-secondary border border-text-primary/5">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MetricBadge = ({ label, val, color }) => (
  <div className="flex items-center h-6 rounded-lg bg-white/60 border border-text-primary/5 overflow-hidden">
    <div className={`w-5 h-full ${color} flex items-center justify-center text-[8px] font-black text-white`}>{label}</div>
    <div className="px-2 text-[10px] font-bold text-text-primary">{val}</div>
  </div>
);

export default Journal;
