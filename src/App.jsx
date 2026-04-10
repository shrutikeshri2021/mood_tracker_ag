import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './views/Home';
import CheckIn from './views/CheckIn';
import Journal from './views/Journal';
import Insights from './views/Insights';
import Profile from './views/Profile';
import Onboarding from './views/Onboarding';
import { isOnboardingComplete } from './services/storage';
import { checkReminders } from './services/NotificationService';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = isOnboardingComplete();
    if (!completed) {
      setShowOnboarding(true); 
    }
    setLoading(false);

    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckInComplete = () => {
    setActiveTab('journal');
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <Home onTabChange={setActiveTab} />;
      case 'journal':
        return <Journal />;
      case 'checkin':
        return <CheckIn onComplete={handleCheckInComplete} />;
      case 'insights':
        return <Insights />;
      case 'profile':
        return <Profile onTabChange={setActiveTab} />;
      default:
        return <Home onTabChange={setActiveTab} />;
    }
  };

  if (loading) return null;

  if (showOnboarding) {
    return <Onboarding onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;

