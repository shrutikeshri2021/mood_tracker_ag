import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Bell, Sparkles, ArrowRight, Check, Heart, Brain, Moon } from 'lucide-react';
import { saveProfile, completeOnboarding } from '../services/storage';
import { requestNotificationPermission } from '../services/NotificationService';

const steps = [
  {
    id: 'welcome',
    title: 'Private Burnout Tracker',
    subtitle: 'Your personal, private space to find balance and prevent exhaustion.',
    icon: <Sparkles className="text-accent-lilac" size={48} />,
    color: 'bg-lavender'
  },

  {
    id: 'privacy',
    title: 'Privacy First',
    subtitle: 'All your data stays on this device. No cloud, no tracking, just you.',
    icon: <Shield className="text-accent-mint" size={48} />,
    color: 'bg-aqua'
  },
  {
    id: 'goals',
    title: 'Your Focus',
    subtitle: 'What brings you to ZenithMe today?',
    options: ['Reduce Stress', 'Improve Sleep', 'Prevent Burnout', 'Track Mood', 'Better Habits'],
    multiSelect: true,
    icon: <Target className="text-accent-coral" size={48} />,
    color: 'bg-pink-mist'
  },
  {
    id: 'reminders',
    title: 'Stay Consistent',
    subtitle: 'Gentle nudges help you build a sustainable wellness habit.',
    icon: <Bell className="text-accent-sky" size={48} />,
    color: 'bg-sky',
    action: 'Allow Notifications'
  },
  {
    id: 'setup',
    title: 'Ready to Begin',
    subtitle: "Let's personalize your experience.",
    icon: <Heart className="text-accent-lilac" size={48} />,
    color: 'bg-cream'
  }
];

const Onboarding = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    name: '',
    goals: [],
    stressFrequency: '',
    copingTools: [],
    avatarColor: '#C8B8F5'
  });

  const step = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      saveProfile(profile);
      completeOnboarding();
      onFinish();
    }
  };

  const handleOptionToggle = (option) => {
    const goals = profile.goals.includes(option)
      ? profile.goals.filter(g => g !== option)
      : [...profile.goals, option];
    setProfile({ ...profile, goals });
  };

  const handleNotificationRequest = async () => {
    await requestNotificationPermission();
    nextStep();
  };

  const variants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  return (
    <div className={`min-h-screen ${step.color} transition-colors duration-700 flex flex-col p-8 overflow-hidden`}>
      <div className="flex gap-2 mb-12">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-text-primary' : 'bg-text-primary/10'}`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col items-center text-center space-y-8"
          >
            <div className="w-24 h-24 bg-white rounded-4xl premium-shadow flex items-center justify-center float-animation">
              {step.icon}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-text-primary leading-tight">{step.title}</h1>
              <p className="text-text-secondary text-lg px-4">{step.subtitle}</p>
            </div>

            {step.id === 'goals' && (
              <div className="grid grid-cols-1 gap-3 w-full max-w-xs mt-4">
                {step.options.map(option => (
                  <button
                    key={option}
                    onClick={() => handleOptionToggle(option)}
                    className={`p-4 rounded-2xl font-bold flex justify-between items-center transition-all ${
                      profile.goals.includes(option) 
                        ? 'bg-text-primary text-white shadow-lg scale-102' 
                        : 'bg-white text-text-primary border border-text-primary/5'
                    }`}
                  >
                    {option}
                    {profile.goals.includes(option) && <Check size={18} />}
                  </button>
                ))}
              </div>
            )}

            {step.id === 'setup' && (
              <div className="w-full max-w-xs space-y-6 mt-4">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-secondary ml-2">What should we call you?</label>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    className="w-full p-4 rounded-2xl bg-white border border-text-primary/5 shadow-sm focus:ring-2 focus:ring-accent-lilac outline-none font-bold"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  {['#C8B8F5', '#BEF1EC', '#F7C8BD', '#B7DEFF', '#F6C4DA'].map(color => (
                    <button
                      key={color}
                      onClick={() => setProfile({...profile, avatarColor: color})}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${profile.avatarColor === color ? 'border-text-primary scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 space-y-4">
          {step.id === 'reminders' ? (
            <button 
              onClick={handleNotificationRequest}
              className="w-full btn-primary flex items-center justify-center gap-3"
            >
              Get Notified <Bell size={18} />
            </button>
          ) : (
            <button 
              onClick={nextStep}
              className="w-full btn-primary flex items-center justify-center gap-3"
            >
              {currentStep === steps.length - 1 ? 'Start Journey' : 'Continue'} 
              <ArrowRight size={18} />
            </button>
          )}

          {step.id === 'reminders' && (
            <button 
              onClick={nextStep}
              className="w-full text-text-secondary font-bold text-sm"
            >
              Skip for now
            </button>
          ) }
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
