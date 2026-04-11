import { isSameDay, subDays, startOfDay, differenceInDays } from 'date-fns';

export class StreakEngine {
  calculateGrowth(entries) {
    if (!entries || entries.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        stage: 'Seed',
        icon: '🌱',
        nextMilestone: 3,
        progress: 0,
        message: "Log today to plant your seed."
      };
    }

    const sorted = [...entries].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const uniqueDays = [];
    sorted.forEach(e => {
        const d = startOfDay(new Date(e.timestamp)).getTime();
        if (!uniqueDays.includes(d)) uniqueDays.push(d);
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = startOfDay(new Date()).getTime();
    const yesterday = startOfDay(subDays(new Date(), 1)).getTime();

    let isActive = false;
    if (uniqueDays.length > 0 && (uniqueDays[0] === today || uniqueDays[0] === yesterday)) {
        isActive = true;
    }

    if (isActive) {
        currentStreak = 1;
        for (let i = 0; i < uniqueDays.length - 1; i++) {
            if (differenceInDays(uniqueDays[i], uniqueDays[i+1]) === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    if (uniqueDays.length > 0) {
        tempStreak = 1;
        longestStreak = 1;
        for (let i = 0; i < uniqueDays.length - 1; i++) {
            if (differenceInDays(uniqueDays[i], uniqueDays[i+1]) === 1) {
                tempStreak++;
                if (tempStreak > longestStreak) longestStreak = tempStreak;
            } else {
                tempStreak = 1;
            }
        }
    }

    let stage = 'Seed';
    let icon = '🌰';
    let nextMilestone = 3;

    if (currentStreak >= 30) {
        stage = 'Blossom';
        icon = '🌸';
        nextMilestone = 60;
    } else if (currentStreak >= 14) {
        stage = 'Plant';
        icon = '🪴';
        nextMilestone = 30;
    } else if (currentStreak >= 7) {
        stage = 'Sprout';
        icon = '🌿';
        nextMilestone = 14;
    } else if (currentStreak >= 3) {
        stage = 'Seedling';
        icon = '🌱';
        nextMilestone = 7;
    } else if (currentStreak >= 1) {
        stage = 'Seed';
        icon = '🌰';
        nextMilestone = 3;
    }

    const progress = Math.min(100, Math.round((currentStreak / nextMilestone) * 100));
    
    let message = `You're growing! ${nextMilestone - currentStreak} days until ${nextMilestone === 3 ? 'Seedling' : nextMilestone === 7 ? 'Sprout' : nextMilestone === 14 ? 'Plant' : nextMilestone === 30 ? 'Blossom' : 'Mastery'}.`;
    if (!isActive) {
        message = "Your plant needs a little water. Log today to restore it.";
        stage = 'Dry Seed';
        icon = '🍂';
        nextMilestone = 3;
    }

    return {
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        stage,
        icon,
        nextMilestone,
        progress: isActive ? progress : 0,
        message
    };
  }
}
