// Local storage keys
const KEYS = {
  PROFILE: 'private_burnout_profile',
  ENTRIES: 'private_burnout_entries',
  ONBOARDING_COMPLETE: 'private_burnout_onboarding_complete',
  REMINDERS: 'private_burnout_reminders',
  SETTINGS: 'private_burnout_settings',
};

// Real logic: no seeded data
export const getEntries = () => {
  const data = localStorage.getItem(KEYS.ENTRIES);
  return data ? JSON.parse(data) : [];
};

export const saveEntry = (entry) => {
  const entries = getEntries();
  // Ensure we don't duplicate by ID if editing
  const filtered = entries.filter(e => e.id !== entry.id);
  const newEntries = [entry, ...filtered].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  localStorage.setItem(KEYS.ENTRIES, JSON.stringify(newEntries));
  return newEntries;
};

export const deleteEntry = (id) => {
  const entries = getEntries();
  const newEntries = entries.filter(e => e.id !== id);
  localStorage.setItem(KEYS.ENTRIES, JSON.stringify(newEntries));
  return newEntries;
};

export const getProfile = () => {
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : {
    name: 'Friend',
    goals: [],
    stressFrequency: '',
    copingTools: [],
    avatarColor: '#C8B8F5'
  };
};

export const saveProfile = (profile) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const getReminders = () => {
  const data = localStorage.getItem(KEYS.REMINDERS);
  return data ? JSON.parse(data) : [];
};

export const saveReminders = (reminders) => {
  localStorage.setItem(KEYS.REMINDERS, JSON.stringify(reminders));
};

export const getSettings = () => {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : {
    privacyLock: false,
    pin: '',
    haptics: true,
    theme: 'system'
  };
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

