import React, { useState } from 'react';
import { 
  BarChart3, Flame, Clock, Trophy, Calendar, Sparkles, BookOpen, AlertCircle, ArrowUpRight, History 
} from 'lucide-react';
import { getUserStats, getStoredCalls } from '../services/storage';

export default function StatsDashboard() {
  const [stats] = useState(getUserStats());
  const [calls] = useState(getStoredCalls());
  const [selectedCall, setSelectedCall] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Speaking Analytics & Call History
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track your fluency score, practice minutes, and past call reviews.</p>
        </div>
      </div>

      {/* Top Stat Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Average Fluency */}
        <div className="glass-panel p-5 rounded-2xl border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Average Fluency</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-white">{stats.averageFluency}%</div>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">↑ Executive Standard Target: 85%</p>
        </div>

        {/* Practice Minutes */}
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Practice Time</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-white">{stats.totalPracticeMinutes} <span className="text-sm font-normal text-slate-400">mins</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Across {stats.completedCalls} completed practice calls</p>
        </div>

        {/* Practice Streak */}
        <div className="glass-panel p-5 rounded-2xl border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Current Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-amber-400">{stats.streakDays} <span className="text-sm font-normal text-slate-400">Days</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Last practice: {stats.lastPracticeDate || 'Today'}</p>
        </div>

        {/* Top Focus Area */}
        <div className="glass-panel p-5 rounded-2xl border-rose-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Primary Focus Area</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-sm text-white line-clamp-1">{stats.topWeakness}</div>
          <p className="text-[11px] text-rose-300 mt-1">Practice silent pauses over "basically"</p>
        </div>

      </div>

      {/* Call History Table / Log */}
      <div className="glass-panel p-6 rounded-2xl border-white/10">
        <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          Recent Call Sessions
        </h2>

        {calls.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Scenario Topic</th>
                  <th className="pb-3 font-semibold">AI Persona</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {calls.map((c, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-white">{c.topicTitle}</td>
                    <td className="py-3 text-slate-300">{c.avatarName}</td>
                    <td className="py-3">
                      <span className={`badge ${c.score >= 80 ? 'badge-emerald' : 'badge-amber'}`}>
                        {c.score}%
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-mono">{Math.floor(c.durationSeconds / 60)}m {c.durationSeconds % 60}s</td>
                    <td className="py-3 text-slate-400">{c.date || 'Today'}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedCall(c)}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        View Transcript
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">No practice calls recorded yet.</p>
            <p className="text-xs text-slate-500 mt-1">Start your first call from the Practice Scenarios tab!</p>
          </div>
        )}
      </div>

      {/* Transcript Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl glass-panel border-white/10 p-6 rounded-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-white">{selectedCall.topicTitle}</h3>
                <p className="text-xs text-slate-400">Persona: {selectedCall.avatarName} • Score: {selectedCall.score}%</p>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="btn-secondary py-1 px-3 text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {selectedCall.transcript?.map((t, idx) => (
                <div key={idx} className={`p-3 rounded-xl border text-xs ${t.sender === 'ai' ? 'bg-indigo-950/30 border-indigo-500/20 text-indigo-200' : 'bg-slate-900 border-white/10 text-slate-200'}`}>
                  <p className="font-bold text-[10px] text-slate-400 mb-1">{t.sender === 'ai' ? selectedCall.avatarName : 'You'}</p>
                  <p>{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
