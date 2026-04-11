import { getEntries } from './storage';

/**
 * Lightweight burnout risk engine.
 * Calculates risk based on:
 * - Stress persistence (Repeated high stress)
 * - Energy depletion
 * - Sleep quality trends
 * - Focus levels
 * - Social battery
 */
export const calculateBurnoutRisk = () => {
  const entries = getEntries();
  if (entries.length < 3) return { score: 0, level: 'Insufficient Data', color: '#94A3B8', isInsufficient: true };

  const windowSize = 10;
  const recentEntries = entries.slice(0, windowSize);
  
  // Weights (0-1) - More emphasis on stress and sleep
  const weights = {
    stress: 0.50,
    energy: 0.20,
    sleep: 0.30
  };

  const avgStress = recentEntries.reduce((acc, e) => acc + (e.stress || 0), 0) / recentEntries.length;
  const avgEnergy = recentEntries.reduce((acc, e) => acc + (e.energy || 5), 0) / recentEntries.length;
  const avgSleep = recentEntries.reduce((acc, e) => acc + (e.sleep || 7), 0) / recentEntries.length;

  // Normalized badness scores
  const stressNorm = (avgStress / 10) * 100;
  const energyNorm = ((10 - avgEnergy) / 10) * 100;
  const sleepNorm = ((10 - avgSleep) / 10) * 100;

  let score = (stressNorm * weights.stress) + (energyNorm * weights.energy) + (sleepNorm * weights.sleep);

  // Persistence Multipliers
  const persistentHighStress = recentEntries.filter(e => e.stress >= 7).length >= 3;
  const chronicLowSleep = recentEntries.filter(e => e.sleep <= 4).length >= 2;
  
  if (persistentHighStress) score += 15;
  if (chronicLowSleep) score += 20;

  // Cap and smooth
  score = Math.min(score, 100);

  let level = 'Low';
  let color = '#64D7BE'; // mint
  if (score > 75) {
    level = 'High';
    color = '#FF8EA6'; // coral
  } else if (score > 40) {
    level = 'Moderate';
    color = '#F7C8BD'; // peach
  }

  return {
    score,
    level,
    color,
    isInsufficient: false,
    factors: {
      avgStress,
      avgEnergy,
      avgSleep,
      persistentHighStress
    }
  };
};

export const getRecoverySuggestions = (risk) => {
  if (risk.isInsufficient) return ["Keep logging check-ins to unlock recovery tips."];
  
  const suggestions = [];
  if (risk.factors.avgStress > 7) {
    suggestions.push("Prioritize a 15-minute digital detox this afternoon.");
    suggestions.push("Try the box breathing tool to lower your cortisol.");
  }
  if (risk.factors.avgEnergy < 4) {
    suggestions.push("Focus only on 'must-do' tasks today. Preserve your battery.");
    suggestions.push("Consider a 20-minute power nap or rest session.");
  }
  if (risk.factors.avgSleep < 5) {
    suggestions.push("Set a strict screen-off time 1 hour before bed tonight.");
    suggestions.push("A gentle 10-minute stretch could improve tonight's sleep quality.");
  }
  
  if (suggestions.length === 0) {
    suggestions.push("Maintain your current boundaries—your rhythm is healthy!");
    suggestions.push("Take a moment to celebrate your steady progress today.");
  }
  
  return [...new Set(suggestions)];
};
