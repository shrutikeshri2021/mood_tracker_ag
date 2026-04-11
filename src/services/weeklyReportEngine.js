import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export class WeeklyReportEngine {
  generateReport(entries, patterns = [], burnoutResult = null) {
    const now = new Date();
    const currentWeekStart = startOfDay(subDays(now, 6)); 
    const currentWeekEnd = endOfDay(now);
    
    const prevWeekStart = startOfDay(subDays(now, 13));
    const prevWeekEnd = endOfDay(subDays(now, 7));

    const currentEntries = entries.filter(e => isWithinInterval(new Date(e.timestamp), { start: currentWeekStart, end: currentWeekEnd }));
    const prevEntries = entries.filter(e => isWithinInterval(new Date(e.timestamp), { start: prevWeekStart, end: prevWeekEnd }));

    if (currentEntries.length < 1) {
      return null;
    }

    const weekLabel = `${format(currentWeekStart, 'MMM d')} – ${format(currentWeekEnd, 'MMM d, yyyy')}`;

    const avgScore = (arr, field) => arr.length ? arr.reduce((acc, e) => acc + (e[field] || 0), 0) / arr.length : 0;
    
    const moodScore = (mood) => {
       const m = mood?.toLowerCase();
       if (['energized', 'steady', 'calm'].includes(m)) return 3;
       if (['anxious', 'overloaded', 'irritated', 'numb'].includes(m)) return 1;
       return 2;
    };
    
    const currentAvgStress = avgScore(currentEntries, 'stress');
    const currentAvgEnergy = avgScore(currentEntries, 'energy');
    const currentAvgSleep = avgScore(currentEntries, 'sleep');
    const prevAvgStress = avgScore(prevEntries, 'stress');

    const moodMap = {};
    currentEntries.forEach(e => {
        const m = e.mood?.toLowerCase() || 'unknown';
        if (!moodMap[m]) moodMap[m] = { count: 0, emoji: e.moodIcon || '😐' };
        moodMap[m].count += 1;
    });

    const moodDistribution = Object.keys(moodMap).map(mood => ({
       mood, count: moodMap[mood].count, emoji: moodMap[mood].emoji
    })).sort((a,b) => b.count - a.count);

    let bestDay = null;
    let hardestDay = null;
    if (currentEntries.length) {
        const sortedByBalance = [...currentEntries].sort((a, b) => {
            const aBal = moodScore(a.mood) * 10 - a.stress + a.energy + a.sleep;
            const bBal = moodScore(b.mood) * 10 - b.stress + b.energy + b.sleep;
            return bBal - aBal; 
        });
        
        const best = sortedByBalance[0];
        bestDay = {
            day: format(new Date(best.timestamp), 'EEEE'),
            mood: best.mood,
            reason: best.tags?.[0] || 'Good balance.'
        };

        const hardest = sortedByBalance[sortedByBalance.length - 1];
        hardestDay = {
            day: format(new Date(hardest.timestamp), 'EEEE'),
            mood: hardest.mood,
            reason: hardest.tags?.[0] || 'High stress.'
        };
    }

    let insight = "";
    if (prevEntries.length > 0) {
        if (currentAvgStress < prevAvgStress) {
            insight = "Your stress decreased this week. Whatever you did differently — notice it and repeat it. 💚";
        } else if (currentAvgStress > prevAvgStress + 1) {
            insight = "This was a tougher week. Stress climbed, which is a signal to protect your energy. You're aware now — that's powerful. 💜";
        }
    }
    if (!insight) {
        if (currentEntries.length >= 5) {
            insight = "You showed up consistently this week. That kind of self-awareness builds real resilience. ✨";
        } else if (currentEntries.length <= 2) {
            insight = "Life was busy — fewer check-ins this week. That's okay. You're here now, and that counts. 🌱";
        } else {
            insight = "A solid week of self-reflection. Keeping a pulse on how you feel is the foundation of preventing burnout. 🌿";
        }
    }

    if (burnoutResult && burnoutResult.score > 50) {
        insight += " Your burnout signals are elevated right now. This isn't failure — it's information. Consider one small recovery action today. 🫁";
    }

    const improvements = [];
    const watchAreas = [];
    if (prevEntries.length) {
        if (currentAvgStress < prevAvgStress) improvements.push("Lowered average stress");
        if (currentAvgSleep > avgScore(prevEntries, 'sleep') + 0.5) improvements.push("Better sleep quality");
        if (currentAvgEnergy > avgScore(prevEntries, 'energy') + 0.5) improvements.push("Higher energy reserves");
        
        if (currentAvgStress > prevAvgStress + 1) watchAreas.push("Stress is trending up");
        if (currentAvgSleep < avgScore(prevEntries, 'sleep') - 1) watchAreas.push("Sleep quality dipped");
    } else {
        improvements.push("Started tracking your mental wealth");
    }

    const tTriggers = patterns.filter(p => p.category === 'trigger').map(p => p.title);
    const tRecov = patterns.filter(p => p.category === 'recovery').map(p => p.title);

    return {
      id: `wr_${currentWeekStart.getTime()}`,
      weekLabel,
      totalCheckIns: currentEntries.length,
      totalJournals: currentEntries.filter(e => e.notes && e.notes.length > 0).length,
      avgMood: (currentEntries.reduce((s,e) => s + moodScore(e.mood), 0) / currentEntries.length).toFixed(1),
      avgStress: currentAvgStress.toFixed(1),
      avgEnergy: currentAvgEnergy.toFixed(1),
      avgSleep: currentAvgSleep.toFixed(1),
      moodDistribution,
      bestDay,
      hardestDay,
      topTriggers: tTriggers.slice(0, 2),
      topRecoveries: tRecov.slice(0, 2),
      burnoutScore: burnoutResult ? burnoutResult.score : 0,
      burnoutTrend: burnoutResult ? burnoutResult.trend : 'stable',
      weeklyInsight: insight,
      userReflection: "",
      improvements,
      watchAreas,
      generatedAt: Date.now()
    };
  }
}
