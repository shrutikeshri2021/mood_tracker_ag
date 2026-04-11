export class BalanceEngine {
  calculateScore(entries) {
    if (!entries || entries.length === 0) {
      return { score: 50, latestScore: 50, status: "Neutral", history: [] };
    }

    const sorted = [...entries].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recent = sorted.slice(0, 3);

    const calculateSingleEntry = (e) => {
      let score = 50;

      // Mood Weight (±20)
      const m = e.mood?.toLowerCase() || 'okay';
      if (['inspired', 'energized'].includes(m)) score += 20;
      else if (['calm', 'steady', 'okay'].includes(m)) score += 10;
      else if (['stressed', 'irritated'].includes(m)) score -= 10;
      else if (['anxious', 'overloaded', 'numb'].includes(m)) score -= 20;

      // Stress Drag
      let stressLevel = Number(e.stress) || 5;
      if (stressLevel > 7) score -= 15;
      else if (stressLevel < 4) score += 10;
      
      // Energy Reserve
      let energyLevel = Number(e.energy) || 5;
      if (energyLevel > 7) score += 10;
      else if (energyLevel < 4) score -= 10;

      // Sleep Anchor
      let sleepLevel = Number(e.sleep) || 7;
      if (sleepLevel > 7) score += 5;
      else if (sleepLevel < 5) score -= 5;

      return Math.max(0, Math.min(100, score));
    };

    const currentScore = calculateSingleEntry(sorted[0]);
    
    // We want a rolling average of up to 3 most recent entries
    const averageScore = Math.round(recent.reduce((acc, e) => acc + calculateSingleEntry(e), 0) / recent.length);

    let status = "Regulated";
    if (averageScore >= 80) status = "Optimal Flow";
    else if (averageScore >= 60) status = "Well-Regulated";
    else if (averageScore >= 40) status = "Managing";
    else if (averageScore >= 20) status = "Depleted";
    else status = "Dysregulated";

    const history = sorted.slice(0, 7).reverse().map(e => calculateSingleEntry(e));

    return {
      score: averageScore,
      latestScore: currentScore,
      status,
      history,
    };
  }
}
