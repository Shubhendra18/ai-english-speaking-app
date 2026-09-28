import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TopicSelector from './components/TopicSelector';
import CallRoom from './components/CallRoom';
import CallReportModal from './components/CallReportModal';
import StatsDashboard from './components/StatsDashboard';
import SettingsModal from './components/SettingsModal';

import { getSettings, saveCallLog } from './services/storage';
import { generateCallOverallReport } from './services/feedbackAnalyzer';

export default function App() {
  const [activeTab, setActiveTab] = useState('topics'); // 'topics' | 'call' | 'stats'
  const [activeScenario, setActiveScenario] = useState(null);
  const [activeAvatar, setActiveAvatar] = useState(null);

  // Call End & Post-Report State
  const [finishedTranscript, setFinishedTranscript] = useState([]);
  const [finishedDuration, setFinishedDuration] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('SIVi-Tech Service Worker registered:', reg.scope))
        .catch((err) => console.warn('Service Worker registration failed:', err));
    }
  }, []);

  // Handle starting a practice call
  const handleStartCall = (scenario, avatar) => {
    setActiveScenario(scenario);
    setActiveAvatar(avatar);
    setActiveTab('call');
  };

  // Handle ending a call
  const handleEndCall = (transcript, durationSeconds) => {
    setFinishedTranscript(transcript);
    setFinishedDuration(durationSeconds);
    
    // Calculate report score and save call log
    const report = generateCallOverallReport(transcript, durationSeconds);
    
    saveCallLog({
      id: `call_${Date.now()}`,
      topicId: activeScenario?.id || 'daily_standup',
      topicTitle: activeScenario?.title || 'Daily Standup',
      avatarId: activeAvatar?.id || 'sarah',
      avatarName: activeAvatar?.name || 'Sarah Jenkins',
      score: report.overallScore,
      durationSeconds: durationSeconds,
      transcript: transcript,
      date: new Date().toLocaleDateString()
    });

    setShowReportModal(true);
  };

  const handleCloseReport = () => {
    setShowReportModal(false);
    setActiveTab('topics');
  };

  const handleRestartCall = () => {
    setShowReportModal(false);
    setActiveTab('call');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'topics' && (
          <TopicSelector onSelectScenario={handleStartCall} />
        )}

        {activeTab === 'call' && activeScenario && activeAvatar && (
          <CallRoom
            topic={activeScenario}
            avatar={activeAvatar}
            settings={getSettings()}
            onEndCall={handleEndCall}
          />
        )}

        {activeTab === 'stats' && (
          <StatsDashboard />
        )}
      </main>

      {/* Post Call Detailed Report Modal */}
      {showReportModal && activeScenario && activeAvatar && (
        <CallReportModal
          transcript={finishedTranscript}
          callDurationSeconds={finishedDuration}
          topic={activeScenario}
          avatar={activeAvatar}
          onClose={handleCloseReport}
          onRestartCall={handleRestartCall}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}

    </div>
  );
}
