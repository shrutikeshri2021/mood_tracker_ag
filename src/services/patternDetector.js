export class PatternDetector {
  detectPatterns(entries, journals = []) {
    if (!entries || entries.length < 3) return [];

    const patterns = [];
    const getConfidence = (pts) => pts >= 8 ? 'strong' : pts >= 4 ? 'confirmed' : 'emerging';

    // Helper to get entries with/without a tag
    const entriesWithTag = (tagMatch) => entries.filter(e => e.tags && e.tags.some(t => t.toLowerCase().includes(tagMatch)));
    const entriesWithoutTag = (tagMatch) => entries.filter(e => !e.tags || !e.tags.some(t => t.toLowerCase().includes(tagMatch)));

    // Helper averages
    const avgScore = (arr, field) => arr.length ? arr.reduce((sum, e) => sum + (e[field] || 0), 0) / arr.length : 0;
    const moodScore = (mood) => {
       const m = mood?.toLowerCase();
       if (['energized', 'steady', 'calm'].includes(m)) return 3;
       if (['anxious', 'overloaded', 'irritated', 'numb'].includes(m)) return 1;
       return 2;
    };
    const avgMoodScore = (arr) => arr.length ? arr.reduce((sum, e) => sum + moodScore(e.mood), 0) / arr.length : 0;

    // 1. TRIGGER PATTERNS
    const meetingEntries = entriesWithTag('meeting');
    if (meetingEntries.length >= 2 && avgScore(meetingEntries, 'stress') > 6) {
      patterns.push({
        id: 'trig_meeting',
        emoji: '📅', title: 'Meetings → Stress Spike',
        description: 'You tend to feel more stressed on days with meetings.',
        confidence: getConfidence(meetingEntries.length),
        category: 'trigger', dataPoints: meetingEntries.length, detectedAt: Date.now()
      });
    }

    const deadlineEntries = entriesWithTag('deadline');
    if (deadlineEntries.length >= 2 && avgScore(deadlineEntries, 'stress') > 7) {
      patterns.push({
        id: 'trig_deadline',
        emoji: '⏰', title: 'Deadlines → High Pressure',
        description: 'Deadline days consistently show elevated stress.',
        confidence: getConfidence(deadlineEntries.length),
        category: 'trigger', dataPoints: deadlineEntries.length, detectedAt: Date.now()
      });
    }
    
    const conflictEntries = entriesWithTag('conflict');
    const anxiousConflict = conflictEntries.filter(e => ['anxious','irritated'].includes(e.mood?.toLowerCase()));
    if (anxiousConflict.length >= 2) {
      patterns.push({
        id: 'trig_conflict',
        emoji: '💢', title: 'Conflict → Emotional Drain',
        description: 'Interpersonal tension strongly affects your mood.',
        confidence: getConfidence(anxiousConflict.length),
        category: 'trigger', dataPoints: anxiousConflict.length, detectedAt: Date.now()
      });
    }

    const workloadEntries = [...new Set(entriesWithTag('workload').concat(entriesWithTag('overtime')))];
    if (workloadEntries.length >= 2 && avgScore(workloadEntries, 'energy') < 4) {
      patterns.push({
        id: 'trig_workload',
        emoji: '📋', title: 'Heavy Workload → Energy Crash',
        description: 'Overwork is draining your energy reserves.',
        confidence: getConfidence(workloadEntries.length),
        category: 'trigger', dataPoints: workloadEntries.length, detectedAt: Date.now()
      });
    }

    // 2. RECOVERY PATTERNS
    const exerciseEntries = entriesWithTag('exercise');
    const noExerciseEntries = entriesWithoutTag('exercise');
    if (exerciseEntries.length >= 2 && avgMoodScore(exerciseEntries) > avgMoodScore(noExerciseEntries) + 0.2) {
      patterns.push({
        id: 'recov_exercise',
        emoji: '🏃', title: 'Exercise → Better Mood',
        description: 'You feel noticeably better on days you exercise.',
        confidence: getConfidence(exerciseEntries.length),
        category: 'recovery', dataPoints: exerciseEntries.length, detectedAt: Date.now()
      });
    }

    const restEntries = [...new Set(entriesWithTag('rest').concat(entriesWithTag('break')))];
    const noRestEntries = entries.filter(e => !restEntries.includes(e));
    if (restEntries.length >= 2 && avgScore(restEntries, 'stress') < avgScore(noRestEntries, 'stress') - 0.7) {
      patterns.push({
        id: 'recov_rest',
        emoji: '☕', title: 'Breaks → Lower Stress',
        description: 'Taking deliberate breaks genuinely helps your stress levels.',
        confidence: getConfidence(restEntries.length),
        category: 'recovery', dataPoints: restEntries.length, detectedAt: Date.now()
      });
    }

    // 3. CORRELATION PATTERNS
    const goodSleepEntries = entries.filter(e => e.sleep > 7);
    if (goodSleepEntries.length >= 2 && avgMoodScore(goodSleepEntries) > 2.2) {
      patterns.push({
        id: 'corr_sleep_good',
        emoji: '🌙', title: 'Good Sleep → Better Days',
        description: 'Quality sleep is your strongest recovery tool for feeling steady.',
        confidence: getConfidence(goodSleepEntries.length),
        category: 'correlation', dataPoints: goodSleepEntries.length, detectedAt: Date.now()
      });
    }

    const poorSleepEntries = entries.filter(e => e.sleep < 5);
    if (poorSleepEntries.length >= 2 && avgScore(poorSleepEntries, 'stress') > 6) {
      patterns.push({
        id: 'corr_sleep_poor',
        emoji: '😴', title: 'Poor Sleep → Stress Amplifier',
        description: 'Low sleep makes everything harder and more stressful.',
        confidence: getConfidence(poorSleepEntries.length),
        category: 'correlation', dataPoints: poorSleepEntries.length, detectedAt: Date.now()
      });
    }

    // 4. TIMING PATTERNS
    const mondays = entries.filter(e => new Date(e.timestamp).getDay() === 1);
    const nonMondays = entries.filter(e => new Date(e.timestamp).getDay() !== 1);
    if (mondays.length >= 2 && avgScore(mondays, 'stress') >= avgScore(nonMondays, 'stress') + 0.8) {
       patterns.push({
         id: 'time_monday',
         emoji: '📊', title: 'Mondays Are Hardest',
         description: 'Your stress peaks at the start of the work week.',
         confidence: getConfidence(mondays.length),
         category: 'timing', dataPoints: mondays.length, detectedAt: Date.now()
       });
    }

    const fridays = entries.filter(e => new Date(e.timestamp).getDay() === 5);
    const nonFridays = entries.filter(e => new Date(e.timestamp).getDay() !== 5);
    if (fridays.length >= 2 && avgMoodScore(fridays) >= avgMoodScore(nonFridays) + 0.2) {
       patterns.push({
         id: 'time_friday',
         emoji: '🎉', title: 'Fridays Lift Your Mood',
         description: 'End of work week brings a noticeable mood boost.',
         confidence: getConfidence(fridays.length),
         category: 'timing', dataPoints: fridays.length, detectedAt: Date.now()
       });
    }

    return patterns.sort((a,b) => b.dataPoints - a.dataPoints);
  }
}
