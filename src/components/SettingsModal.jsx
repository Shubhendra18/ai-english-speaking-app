import React, { useState } from 'react';
import { X, Settings, Sliders, Volume2, Camera, ShieldCheck, Key, Eye, EyeOff, Sparkles } from 'lucide-react';
import { getSettings, saveSettings } from '../services/storage';

export default function SettingsModal({ onClose }) {
  const [settingsState, setSettingsState] = useState(getSettings());
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    saveSettings(settingsState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel border-indigo-500/30 p-6 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">App & AI Coach Preferences</h3>
              <p className="text-[11px] text-slate-400">Customize AI Model, Skill Level, Accent & Speech Speed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Controls */}
        <div className="space-y-4">
          
          {/* Gemini API Key Field */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-indigo-500/30">
            <label className="block text-xs font-bold text-white mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                Google Gemini API Key (Optional)
              </span>
              <span className="badge badge-emerald text-[9px]">FREE API</span>
            </label>
            <p className="text-[10px] text-slate-400 mb-2">
              Enter your Google Gemini API Key for 100% open-ended, unscripted AI responses. If empty, the app uses built-in smart context rules.
            </p>

            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={settingsState.geminiApiKey || ''}
                onChange={(e) => setSettingsState({ ...settingsState, geminiApiKey: e.target.value })}
                className="glass-input w-full pr-10 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 text-slate-400 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* User Skill Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your English Practice Level</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner', label: 'Beginner', desc: 'Simple words & hints' },
                { id: 'intermediate', label: 'Intermediate', desc: 'Standard IT practice' },
                { id: 'advanced', label: 'Executive', desc: 'Strict IT & STAR' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSettingsState({ ...settingsState, skillLevel: lvl.id })}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                    settingsState.skillLevel === lvl.id 
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20' 
                      : 'bg-slate-900 text-slate-400 border-white/10'
                  }`}
                >
                  <p className="font-bold">{lvl.label}</p>
                  <p className="text-[10px] font-normal opacity-80 mt-0.5">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* AI Voice Accent */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default AI Voice Accent</label>
            <select
              value={settingsState.voiceAccent || 'en-IN'}
              onChange={(e) => setSettingsState({ ...settingsState, voiceAccent: e.target.value })}
              className="glass-input w-full text-xs"
            >
              <option value="en-IN">Indian English (Dev Lead / Mentor Accent)</option>
              <option value="en-US">US English (Natural Corporate Accent)</option>
              <option value="en-GB">UK English (British Accent)</option>
            </select>
          </div>

          {/* AI Speaking Speed */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">AI Speech Speed</label>
              <span className="font-mono text-xs text-cyan-400">{settingsState.speechRate || 1.0}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={settingsState.speechRate || 1.0}
              onChange={(e) => setSettingsState({ ...settingsState, speechRate: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Camera Default Toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Camera className="w-4 h-4 text-slate-400" />
              Enable User Camera Preview by Default
            </span>
            <input
              type="checkbox"
              checked={settingsState.cameraEnabled ?? true}
              onChange={(e) => setSettingsState({ ...settingsState, cameraEnabled: e.target.checked })}
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="btn-secondary text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary text-xs px-6"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
}
