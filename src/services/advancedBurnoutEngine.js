export class BurnoutEngine {
  calculateBurnoutRisk(entries, journalEntries = []) {
    let score = 0;
    const signals = [];
    
    if (!entries || entries.length < 3) {
      return {
        score: 0,
        level: 'low',
        trend: 'stable',
        signals: [],
        recommendation: "Log 3 or more check-ins to activate burnout prediction 🧠",
        disclaimer: "⚕️ This is a self-awareness tool, not a medical diagnosis. If you feel overwhelmed, please reach out to a qualified professional.",
        calculatedAt: Date.now(),
        isInsufficient: true
      };
    }

    const sorted = [...entries].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latest7 = sorted.slice(0, 7);
    const latest5 = sorted.slice(0, 5);

    const stressOver7 = latest5.filter(e => e.stress > 7).length;
    if (stressOver7 >= 3) {
        score += 20;
        signals.push({
            name: "Sustained High Stress",
            emoji: "😰",
            description: "Your stress has been above 7 frequently recently.",
            severity: "alert",
            dataPoints: stressOver7
        });
    }

    const energyUnder4 = latest5.filter(e => e.energy < 4).length;
    if (energyUnder4 >= 3) {
        score += 15;
        signals.push({
            name: "Sustained Low Energy",
            emoji: "🪫",
            description: "Your energy has been consistently low.",
            severity: "warning",
            dataPoints: energyUnder4
        });
    }

    const sleepUnder5 = latest5.filter(e => e.sleep < 5).length;
    if (sleepUnder5 >= 3) {
        score += 20;
        signals.push({
            name: "Poor Sleep Pattern",
            emoji: "🥱",
            description: "Your sleep quality has been low for multiple nights.",
            severity: "alert",
            dataPoints: sleepUnder5
        });
    }

    const negativeMoods = ['anxious', 'overloaded', 'numb', 'irritated'];
    const negativeCount = latest7.filter(e => negativeMoods.includes(e.mood?.toLowerCase())).length;
    if (negativeCount >= 4) { 
        score += 15;
        signals.push({
            name: "Negative Mood Dominance",
            emoji: "🌧️",
            description: "Most of your recent check-ins reflect difficult emotions.",
            severity: "warning",
            dataPoints: negativeCount
        });
    }

    const positiveMoods = ['calm', 'steady', 'energized'];
    const positiveCount = latest5.filter(e => positiveMoods.includes(e.mood?.toLowerCase())).length;
    if (positiveCount === 0) {
        score += 10;
        signals.push({
            name: "Recovery Deficit",
            emoji: "⏱️",
            description: "You haven't had a distinctly calm or energized day recently.",
            severity: "watch",
            dataPoints: 5
        });
    }

    const workloadTags = ['workload', 'deadlines', 'meetings', 'overtime'];
    const workloadCount = latest5.filter(e => e.tags && e.tags.some(t => workloadTags.includes(t.toLowerCase()))).length;
    if (workloadCount >= 3) {
        score += 10;
        signals.push({
            name: "High Workload Pressure",
            emoji: "📋",
            description: "Workload tags are appearing frequently.",
            severity: "watch",
            dataPoints: workloadCount
        });
    }

    score = Math.min(score, 100);

    let level = 'low';
    let recommendation = "You're maintaining a good rhythm. Keep it up!";
    if (score >= 76) {
        level = 'critical';
        recommendation = "Your burnout profile is critical. Please pause, disconnect from work completely, and prioritize rest immediately.";
    } else if (score >= 51) {
        level = 'high';
        recommendation = "Multiple burnout signals are active. Take a mental health break today or tomorrow.";
    } else if (score >= 26) {
        level = 'moderate';
        recommendation = "Some pressure is building. Be mindful of your boundaries and get extra rest tonight.";
    }

    let trend = 'stable';

    return {
        score,
        level,
        trend,
        signals,
        recommendation,
        disclaimer: "⚕️ This is a self-awareness tool, not a medical diagnosis. If you feel overwhelmed, please reach out to a qualified professional.",
        calculatedAt: Date.now(),
        isInsufficient: false
    };
  }
}
