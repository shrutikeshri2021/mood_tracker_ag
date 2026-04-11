import { getReminders, saveReminders } from './storage';

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return 'unsupported';
  }
  
  const permission = await Notification.requestPermission();
  return permission;
};

export const getNotificationState = () => {
  if (!("Notification" in window)) return 'unsupported';
  return Notification.permission;
};

export const scheduleLocalReminder = (reminder) => {
  // Since we are in a web environment, true background scheduling is limited
  // We store the reminder and use in-app state/service worker for real-world apps.
  // For this version, we'll store them and provide the "Best Effort" UI feedback.
  const reminders = getReminders();
  const updatedReminders = [...reminders, { ...reminder, id: Date.now() }];
  saveReminders(updatedReminders);
  return updatedReminders;
};

export const deleteReminder = (id) => {
  const reminders = getReminders();
  const updatedReminders = reminders.filter(r => r.id !== id);
  saveReminders(updatedReminders);
  return updatedReminders;
};

// In a real production app, we would register a Service Worker here to handle FCM or background sync.
// For this PWA-style web app, we'll simulate the triggers when the app is open.
export const checkReminders = () => {
  const reminders = getReminders();
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const smartMessages = [
    "Take a deep breath. How is your energy right now?",
    "You're building a streak. Don't break it now! 🔥",
    "Time for a quick burnout check. It takes 30 seconds."
  ];

  reminders.forEach(r => {
    if (r.time === currentTime && r.enabled && getNotificationState() === 'granted') {
      const msg = smartMessages[Math.floor(Math.random() * smartMessages.length)];
      new Notification("ZenithMe Moment", {
        body: msg,
        icon: "/favicon.ico",
      });
    }
  });
};
