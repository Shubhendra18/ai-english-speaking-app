import React, { useState } from 'react';
import { X, Settings, Key, Eye, EyeOff } from 'lucide-react';
import { getSettings, saveSettings } from '../services/storage';

export default function SettingsModal({ onClose }) {
  const [settingsState, setSettingsState] = useState(getSettings());
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    saveSettings(settingsState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-panel border-slate-200 p-6 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto bg-white">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">App & AI Coach Preferences</h3>
              <p className="text-[11px] text-slate-500">Customize AI Model, Skill Level, Accent & Speech Speed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Controls */}
        <div className="space-y-4">
          
          {/* Gemini API Key Field */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                Google Gemini API Key (Optional)
              </span>
              <span className="badge badge-emerald text-[9px]">FREE API</span>
            </label>
            <p className="text-[10px] text-slate-500 mb-2">
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
                className="absolute right-3 text-slate-400 hover:text-slate-700"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* User Skill Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your English Practice Level</label>
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
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Default AI Voice Accent</label>
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
              <label className="text-xs font-semibold text-slate-700">AI Speech Speed</label>
              <span className="font-mono text-xs text-indigo-700 font-bold">{settingsState.speechRate || 1.0}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={settingsState.speechRate || 1.0}
              onChange={(e) => setSettingsState({ ...settingsState, speechRate: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
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
