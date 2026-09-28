import React from 'react';
import { AlertCircle, Lightbulb, Zap, Gauge, CheckCircle2, ChevronRight } from 'lucide-react';

export default function LiveFeedbackDrawer({ currentAnalysis, isOpen, onToggle }) {
  if (!isOpen) return null;

  const { wpm, paceRating, fillerCount, detectedFillers, grammarIssues, vocabSuggestions } = currentAnalysis || {};

  return (
    <div className="w-full lg:w-80 glass-panel border border-indigo-500/20 p-4 rounded-2xl flex flex-col gap-4 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Zap className="w-4 h-4 animate-bounce" />
          </div>
          <h3 className="font-display font-bold text-sm text-white">Live AI Call Coach</h3>
        </div>
        <span className="badge badge-emerald text-[10px]">Active Analysis</span>
      </div>

      {/* Pace & WPM Indicator */}
      <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Speaking Speed</p>
            <p className="text-xs font-bold text-white">{wpm || 0} WPM</p>
          </div>
        </div>
        <span className={`badge ${paceRating === 'Optimal' ? 'badge-emerald' : 'badge-amber'} text-[10px]`}>
          {paceRating || 'Optimal'}
        </span>
      </div>

      {/* Filler Words Warning */}
      <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <AlertCircle className={`w-3.5 h-3.5 ${fillerCount > 2 ? 'text-amber-400' : 'text-slate-400'}`} />
            Filler Words Detected
          </span>
          <span className={`font-mono text-xs font-bold ${fillerCount > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {fillerCount || 0}
          </span>
        </div>
        {detectedFillers && detectedFillers.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {detectedFillers.map((word, i) => (
              <span key={i} className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono">
                "{word}"
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">Clean delivery! No heavy filler words.</p>
        )}
      </div>

      {/* Real-time Grammar Suggestions */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-56 pr-1">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
          Live Phrasing Tips
        </h4>

        {grammarIssues && grammarIssues.length > 0 ? (
          grammarIssues.map((issue, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
              <p className="text-rose-300 font-semibold mb-0.5 line-through">{issue.foundText}</p>
              <p className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {issue.correction}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">{issue.explanation}</p>
            </div>
          ))
        ) : vocabSuggestions && vocabSuggestions.length > 0 ? (
          vocabSuggestions.map((v, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
              <p className="text-indigo-300 font-medium text-[11px]">Executive Vocabulary Upgrade:</p>
              <p className="text-slate-400 line-through text-[11px]">"{v.phrase}"</p>
              <p className="text-cyan-300 font-bold mt-0.5">➜ {v.suggestion}</p>
            </div>
          ))
        ) : (
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-center">
            <p className="text-xs text-emerald-400 font-medium">Your grammar & terminology look solid!</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Keep speaking naturally.</p>
          </div>
        )}
      </div>

    </div>
  );
}
