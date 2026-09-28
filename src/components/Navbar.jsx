import React, { useState, useEffect } from 'react';
import { Bot, Flame, BarChart3, Settings, Download, BookOpen, Volume2 } from 'lucide-react';
import { getUserStats } from '../services/storage';
import { speechEngine } from '../services/speechEngine';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings }) {
  const [stats, setStats] = useState(getUserStats());
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [testAudioPlaying, setTestAudioPlaying] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const handleTestSpeakerSound = () => {
    setTestAudioPlaying(true);
    speechEngine.playSpeakerTestChime();
    speechEngine.speak("Speaker audio test. Hello, welcome to SIVi Tech AI English!", "en-IN", 1.0, null, () => {
      setTestAudioPlaying(false);
    });
    setTimeout(() => setTestAudioPlaying(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('topics')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                SIVi-Tech
              </span>
              <span className="badge badge-indigo text-[10px] py-0.5 px-2">AI COACH</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">IT English Speaking Practice</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'topics' 
                ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Practice Scenarios
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'stats' 
                ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics & History
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Test Speaker Audio Button */}
          <button
            onClick={handleTestSpeakerSound}
            className={`btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 ${
              testAudioPlaying ? 'bg-indigo-600 text-white border-indigo-400' : ''
            }`}
            title="Click to test your speaker sound"
          >
            <Volume2 className={`w-3.5 h-3.5 ${testAudioPlaying ? 'animate-bounce text-cyan-300' : 'text-indigo-400'}`} />
            <span className="hidden sm:inline">{testAudioPlaying ? 'Testing Speaker...' : 'Test Speaker'}</span>
          </button>

          {/* Daily Streak Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="font-display font-bold text-sm text-amber-400">{stats.streakDays} Day Streak</span>
          </div>

          {/* PWA Install Button */}
          {deferredPrompt && !isInstalled && (
            <button
              onClick={handleInstallClick}
              className="btn-primary text-xs py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install PWA</span>
            </button>
          )}

          {/* Settings gear */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="App Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
