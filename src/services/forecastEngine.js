export class ForecastEngine {
  generateForecast(entries, triggerData = null) {
    if (!entries || entries.length === 0) {
      return null;
    }

    const todayEntry = entries[0];
    
    let expectedMood = 'steady';
    let expectedMoodIcon = '😐';
    let expectedEnergy = 5;
    let riskOfCrash = false;
    let caveat = 'Requires standard rest tonight';

    const currentStress = todayEntry.stress || 5;
    const currentEnergy = todayEntry.energy || 5;

    const todayTags = todayEntry.tags || [];
    let hasDrains = false;
    
    if (triggerData && triggerData.drains) {
        hasDrains = triggerData.drains.some(d => todayTags.includes(d.name.toLowerCase()));
    }

    if (currentStress >= 8 || hasDrains) {
       expectedMood = 'depleted';
       expectedMoodIcon = '🔋';
       expectedEnergy = Math.max(1, currentEnergy - 2);
       riskOfCrash = true;
       caveat = 'High stress residue. Protect your morning routine tomorrow.';
    } else if (currentEnergy < 4) {
       expectedMood = 'steady';
       expectedMoodIcon = '🌿';
       expectedEnergy = currentEnergy + 2; 
       caveat = 'If you prioritize 8+ hours of sleep tonight.';
    } else if (['inspired', 'energized'].includes(todayEntry.mood?.toLowerCase())) {
       expectedMood = 'energized';
       expectedMoodIcon = '⚡';
       expectedEnergy = 8;
       caveat = 'Momentum is strong. Keep boundaries firm.';
    } else {
       expectedMood = 'calm';
       expectedMoodIcon = '😌';
       expectedEnergy = 6;
       caveat = 'Maintain your regular evening wind-down.';
    }

    return {
        expectedMood,
        expectedMoodIcon,
        expectedEnergy,
        riskOfCrash,
        caveat
    };
  }
}
