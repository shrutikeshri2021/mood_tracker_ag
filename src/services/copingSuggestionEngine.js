export class CopingSuggestionEngine {
  generateSuggestions(entries, currentMood) {
    if (!entries) return this.getFallbacks();
    
    const suggestions = [];
    
    // Check if they have journals (entries with notes)
    const journalEntries = entries.filter(e => e.notes && e.notes.length > 0);
    const noJournalEntries = entries.filter(e => !e.notes || e.notes.length === 0);
    
    const moodScore = (mood) => {
       const m = mood?.toLowerCase();
       if (['energized', 'steady', 'calm'].includes(m)) return 3;
       if (['anxious', 'overloaded', 'irritated', 'numb'].includes(m)) return 1;
       return 2;
    };
    const avgMoodScore = (arr) => arr.length ? arr.reduce((sum, e) => sum + moodScore(e.mood), 0) / arr.length : 0;
    
    // 1. JOURNALING SUGGESTION
    if (journalEntries.length >= 2 && avgMoodScore(journalEntries) > avgMoodScore(noJournalEntries)) {
      suggestions.push({
        id: 'cope_journal',
        emoji: '✍️', title: 'Write It Out',
        description: 'Your data shows mood improves on days you journal.',
        actionLabel: 'Open Journal', actionScreen: 'journal',
        effectiveness: 85,
        basedOn: 'Avg mood higher on journal days',
        urgency: 'gentle', category: 'journaling'
      });
    }

    // 2. BREATHING SUGGESTION
    const breathingEntries = entries.filter(e => e.tags && e.tags.some(t => t.toLowerCase().includes('breathing') || t.toLowerCase().includes('calm')));
    if (breathingEntries.length >= 1) {
      suggestions.push({
        id: 'cope_breathing',
        emoji: '🫁', title: 'Take a Breathing Break',
        description: 'Breathing exercises have helped lower your stress before.',
        actionLabel: 'Start Breathing', actionScreen: 'home', 
        effectiveness: 80, basedOn: 'Tag correlations',
        urgency: 'recommended', category: 'breathing'
      });
    }

    // 3. SLEEP PRIORITY
    const latestEntry = entries[0];
    if (latestEntry && latestEntry.sleep < 5) {
       // ensure only added once
      suggestions.push({
        id: 'cope_sleep',
        emoji: '🌙', title: 'Prioritize Sleep Tonight',
        description: 'Your data clearly shows better mood after quality sleep.',
        actionLabel: 'Log out early', actionScreen: 'none',
        effectiveness: 90, basedOn: 'Recent sleep deficits',
        urgency: 'important', category: 'rest'
      });
    }

    // 4. MOVEMENT
    const exerciseEntries = entries.filter(e => e.tags && e.tags.some(t => t.toLowerCase() === 'exercise'));
    if (exerciseEntries.length >= 2 && avgMoodScore(exerciseEntries) > avgMoodScore(entries.filter(e=>!exerciseEntries.includes(e)))) {
      suggestions.push({
        id: 'cope_move',
        emoji: '🏃', title: 'Move Your Body',
        description: 'Even 10 minutes of movement lifts your mood based on your history.',
        actionLabel: 'Check-in after', actionScreen: 'checkin',
        effectiveness: 75, basedOn: 'Exercise tags analysis',
        urgency: 'gentle', category: 'physical'
      });
    }

    // 5. REST 
    if (latestEntry && latestEntry.energy < 4) {
      suggestions.push({
        id: 'cope_rest',
        emoji: '☕', title: 'Take a Real Break',
        description: 'Your energy has been low — permission to pause is self-care.',
        actionLabel: 'Rest now', actionScreen: 'none',
        effectiveness: 85, basedOn: 'Current energy levels',
        urgency: 'recommended', category: 'rest'
      });
    }

    // CONTEXT AWARE
    if (currentMood) {
      const m = currentMood.toLowerCase();
      if (m === 'anxious' && !suggestions.find(s=>s.id === 'cope_breathing_context')) {
         suggestions.push({
            id: 'cope_breathing_context', emoji: '🫁', title: 'Ground Yourself',
            description: 'You feel anxious. Try box breathing for 2 minutes.',
            actionLabel: 'Breathe', actionScreen: 'home', effectiveness: 95,
            basedOn: 'Current Mood', urgency: 'important', category: 'breathing'
         });
      } else if (m === 'overloaded' && !suggestions.find(s=>s.id === 'cope_rest_context') && !suggestions.find(s=>s.id === 'cope_rest')) {
         suggestions.push({
            id: 'cope_rest_context', emoji: '☕', title: 'Disconnect',
            description: 'You feel overloaded. Pause and journal or rest.',
            actionLabel: 'Journal', actionScreen: 'journal', effectiveness: 88,
            basedOn: 'Current Mood', urgency: 'recommended', category: 'rest'
         });
      } else if (m === 'numb') {
         suggestions.push({
            id: 'cope_social', emoji: '💬', title: 'Connect With Someone',
            description: 'Feeling distant? A simple text to a friend can help.',
            actionLabel: 'Message someone', actionScreen: 'none', effectiveness: 70,
            basedOn: 'Current Mood', urgency: 'gentle', category: 'social'
         });
      }
    }

    if (suggestions.length < 3) {
      const fallbacks = this.getFallbacks();
      for (const fb of fallbacks) {
        if (!suggestions.find(s => s.id === fb.id)) {
           suggestions.push(fb);
           if (suggestions.length >= 3) break;
        }
      }
    }

    const urgencyScore = { 'important': 3, 'recommended': 2, 'gentle': 1 };
    return suggestions.sort((a,b) => urgencyScore[b.urgency] - urgencyScore[a.urgency]);
  }

  getFallbacks() {
    return [
      { id: 'fb_breathe', emoji: '🫁', title: 'Try Box Breathing', description: 'Take 2 minutes to stabilize your nervous system.', actionLabel: 'Breathe', actionScreen: 'home', effectiveness: 80, basedOn: 'Evidence-based fallback', urgency: 'recommended', category: 'breathing' },
      { id: 'fb_gratitude', emoji: '✍️', title: 'Write Gratitude', description: 'Write 3 things you are grateful for right now.', actionLabel: 'Journal', actionScreen: 'journal', effectiveness: 75, basedOn: 'Evidence-based fallback', urgency: 'gentle', category: 'journaling' },
      { id: 'fb_walk', emoji: '🚶', title: 'Take a Walk', description: 'A 5-minute walk outside can reset your headspace.', actionLabel: 'Go outside', actionScreen: 'none', effectiveness: 85, basedOn: 'Evidence-based fallback', urgency: 'gentle', category: 'physical' }
    ];
  }
}
