// Local storage keys
const KEYS = {
  PROFILE: 'private_burnout_profile',
  ENTRIES: 'private_burnout_entries',
  ONBOARDING_COMPLETE: 'private_burnout_onboarding_complete',
  REMINDERS: 'private_burnout_reminders',
  SETTINGS: 'private_burnout_settings',
  BURNOUT_HISTORY: 'zenithme:burnout_history',
  WEEKLY_REPORTS: 'zenithme:weekly_reports',
};

// Logic for Encryption
const ENCRYPTION_KEY = 'zenithme-private-key-2026';

const encrypt = (data) => {
  try {
    const str = JSON.stringify(data);
    const uint8 = new TextEncoder().encode(str);
    let result = '';
    for (let i = 0; i < uint8.length; i++) {
        result += String.fromCharCode(uint8[i] ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
    }
    return btoa(result);
  } catch (e) {
    return JSON.stringify(data);
  }
};

const decrypt = (data) => {
  if (!data) return null;
  try {
    if (data.startsWith('[') || data.startsWith('{')) {
       return JSON.parse(data);
    }
    const decoded = atob(data);
    const uint8s = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
        uint8s[i] = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
    }
    return JSON.parse(new TextDecoder().decode(uint8s));
  } catch (e) {
    try { 
      // Legacy fallback
      const decoded = atob(data);
      let str = '';
      for (let i = 0; i < decoded.length; i++) {
         str += String.fromCharCode(decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
      }
      return JSON.parse(str);
    } catch (e2) {
      try { return JSON.parse(data); } catch (e3) { return null; }
    }
  }
};

// Real logic: no seeded data
export const getEntries = () => {
  const data = localStorage.getItem(KEYS.ENTRIES);
  if (!data) return [];
  const parsed = decrypt(data);
  return Array.isArray(parsed) ? parsed : [];
};

export const saveEntry = (entry) => {
  const entries = getEntries();
  const filtered = entries.filter(e => e.id !== entry.id);
  const newEntries = [entry, ...filtered].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  localStorage.setItem(KEYS.ENTRIES, encrypt(newEntries));
  return newEntries;
};

export const deleteEntry = (id) => {
  const entries = getEntries();
  const newEntries = entries.filter(e => e.id !== id);
  localStorage.setItem(KEYS.ENTRIES, encrypt(newEntries));
  return newEntries;
};

export const getProfile = () => {
  const data = localStorage.getItem(KEYS.PROFILE);
  try {
    const parsed = data ? JSON.parse(data) : null;
    return parsed && typeof parsed === 'object' ? parsed : {
      name: 'Friend',
      goals: [],
      stressFrequency: '',
      copingTools: [],
      avatarColor: '#C8B8F5'
    };
  } catch (e) {
    return { name: 'Friend', goals: [], stressFrequency: '', copingTools: [], avatarColor: '#C8B8F5' };
  }
};

export const saveProfile = (profile) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getReminders = () => {
  const data = localStorage.getItem(KEYS.REMINDERS);
  try {
    const parsed = data ? JSON.parse(data) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
};

export const saveReminders = (reminders) => {
  localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
};

export const getSettings = () => {
  const data = localStorage.getItem(KEYS.SETTINGS);
  try {
    const parsed = data ? JSON.parse(data) : null;
    return (parsed && typeof parsed === 'object') ? parsed : {
      privacyLock: false,
      pin: '',
      haptics: true,
      theme: 'system'
    };
  } catch (e) {
    return { privacyLock: false, pin: '', haptics: true, theme: 'system' };
  }
};

export const saveSettings = (settings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const completeOnboarding = () => {
  localStorage.setItem(KEYS.ONBOARDING_COMPLETE, 'true');
};

export const isOnboardingComplete = () => {
  return localStorage.getItem(KEYS.ONBOARDING_COMPLETE) === 'true';
};

export const clearAllData = () => {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
};

export const exportData = () => {
  const data = {};
  Object.entries(KEYS).forEach(([keyName, keyValue]) => {
    data[keyName] = localStorage.getItem(keyValue);
  });
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    Object.entries(KEYS).forEach(([keyName, keyValue]) => {
      if (data[keyName]) {
        localStorage.setItem(keyValue, data[keyName]);
      }
    });
    return true;
  } catch (error) {
    console.error('Import failed', error);
    return false;
  }
};

export const getBurnoutHistory = () => {
  const data = localStorage.getItem(KEYS.BURNOUT_HISTORY);
  try {
    const parsed = data ? JSON.parse(data) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
};

export const saveBurnoutHistory = (historyEntry) => {
  const history = getBurnoutHistory();
  const newHistory = [historyEntry, ...history].slice(0, 30); // Keep last 30
  localStorage.setItem(KEYS.BURNOUT_HISTORY, JSON.stringify(newHistory));
  return newHistory;
};

export const getWeeklyReports = () => {
  const data = localStorage.getItem(KEYS.WEEKLY_REPORTS);
  try {
    const parsed = data ? JSON.parse(data) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
};

export const saveWeeklyReport = (report) => {
  const reports = getWeeklyReports();
  if (!Array.isArray(reports)) return [];
  const existingIndex = reports.findIndex(r => r.weekLabel === report.weekLabel);
  if (existingIndex > -1) {
    reports[existingIndex] = report;
  } else {
    reports.unshift(report);
  }
  localStorage.setItem(KEYS.WEEKLY_REPORTS, JSON.stringify(reports));
  return reports;
};

