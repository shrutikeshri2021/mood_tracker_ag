export class TriggerEngine {
  analyzeTriggers(entries) {
    if (!entries || entries.length < 3) return { drains: [], radiators: [], neutral: [] };

    const tagData = {};

    const moodScore = (mood) => {
       const m = mood?.toLowerCase();
       if (['inspired', 'energized', 'calm', 'steady'].includes(m)) return 3;
       if (['anxious', 'overloaded', 'irritated', 'numb'].includes(m)) return 1;
       return 2;
    };

    entries.forEach(e => {
        if (!e.tags) return;
        e.tags.forEach(rawTag => {
            const t = rawTag.toLowerCase().trim();
            if (!tagData[t]) tagData[t] = { count: 0, sumStress: 0, sumEnergy: 0, sumMood: 0, raw: rawTag };
            tagData[t].count += 1;
            tagData[t].sumStress += (Number(e.stress) || 5);
            tagData[t].sumEnergy += (Number(e.energy) || 5);
            tagData[t].sumMood += moodScore(e.mood);
        });
    });

    const drains = [];
    const radiators = [];
    const neutral = [];

    Object.keys(tagData).forEach(t => {
        const d = tagData[t];
        if (d.count < 2) return; 

        const avgStress = d.sumStress / d.count;
        const avgEnergy = d.sumEnergy / d.count;
        const avgMood = d.sumMood / d.count;

        let toxicScore = 0;
        if (avgStress > 6) toxicScore += (avgStress - 6) * 2;
        if (avgMood < 2) toxicScore += (2 - avgMood) * 3;
        if (avgEnergy < 4) toxicScore += (4 - avgEnergy) * 2;

        let nourishScore = 0;
        if (avgEnergy > 6) nourishScore += (avgEnergy - 6) * 2;
        if (avgMood > 2.5) nourishScore += (avgMood - 2.5) * 4;
        if (avgStress < 4) nourishScore += (4 - avgStress) * 2;

        const info = {
            name: d.raw,
            count: d.count,
            avgStress: avgStress.toFixed(1),
            avgEnergy: avgEnergy.toFixed(1),
            avgMood: avgMood.toFixed(1)
        };

        if (toxicScore > nourishScore && toxicScore > 3) {
            info.factor = toxicScore;
            info.type = 'drain';
            drains.push(info);
        } else if (nourishScore > toxicScore && nourishScore > 2) {
            info.factor = nourishScore;
            info.type = 'radiator';
            radiators.push(info);
        } else {
            info.factor = Math.max(toxicScore, nourishScore);
            info.type = 'neutral';
            neutral.push(info);
        }
    });

    return {
        drains: drains.sort((a,b) => b.factor - a.factor),
        radiators: radiators.sort((a,b) => b.factor - a.factor),
        neutral: neutral.sort((a,b) => b.count - a.count)
    };
  }
}
