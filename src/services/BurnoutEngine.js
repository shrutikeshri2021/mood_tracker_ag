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
  
  if (entries.length < 3) return { score: 0, level: 'Insufficient Data', color: 'gray' };

  // Look at last 7 entries (or fewer if not available)
  const windowSize = Math.min(entries.length, 7);
  const recentEntries = entries.slice(0, windowSize);

  let stressSum = 0;
  let energySum = 0;
  let sleepSum = 0;
  let persistentHighStress = 0;

  recentEntries.forEach(entry => {
    stressSum += entry.stress || 0;
    energySum += entry.energy || 5; // Default middle
    sleepSum += entry.sleep || 5;
    if (entry.stress >= 4) persistentHighStress++;
  });

  const avgStress = stressSum / windowSize;
  const avgEnergy = energySum / windowSize;
  const avgSleep = sleepSum / windowSize;

  // Base score 0-100
  // Higher stress increases score
  // Lower energy increases score
  // Lower sleep increases score
  let score = (avgStress * 15) + ((5 - avgEnergy) * 10) + ((5 - avgSleep) * 5);
  
  // Multipliers for persistent issues
  if (persistentHighStress >= 3) score += 20;

  score = Math.min(100, Math.max(0, score));

  let level = 'Low';
  let color = '#64D7BE'; // Mint

  if (score > 70) {
    level = 'High';
    color = '#FF8EA6'; // Coral
  } else if (score > 40) {
    level = 'Moderate';
    color = '#F7C8BD'; // Peach
  }

  return {
    score,
    level,
    color,
    factors: {
      avgStress,
      avgEnergy,
      avgSleep,
      persistentHighStress
    }
  };
};

export const getRecoverySuggestions = (risk) => {
  if (risk.level === 'High') {
    return [
      "Consider a full mental health day if possible.",
      "Cancel non-essential meetings today.",
      "Reach out to a trusted mentor or peer."
    ];
  } else if (risk.level === 'Moderate') {
    return [
      "Try a 10-minute walk without your phone.",
      "End work exactly on time today.",
      "Focus on a single task rather than multi-tasking."
    ];
  }
  return [
    "You're in a good rhythm. Keep protecting your boundaries.",
    "Try a quick gratitude entry to maintain momentum."
  ];
};
