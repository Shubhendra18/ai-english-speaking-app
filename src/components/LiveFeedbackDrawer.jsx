import React from 'react';
import { AlertCircle, Lightbulb, Zap, Gauge, CheckCircle2, ChevronRight } from 'lucide-react';

export default function LiveFeedbackDrawer({ currentAnalysis, isOpen, onToggle }) {
  if (!isOpen) return null;

  const { wpm, paceRating, fillerCount, detectedFillers, grammarIssues, vocabSuggestions } = currentAnalysis || {};

  return (
    <div className="w-full lg:w-80 glass-panel border border-slate-200 bg-white p-4 rounded-2xl flex flex-col gap-4 animate-in slide-in-from-right duration-300 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Zap className="w-4 h-4 animate-bounce" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900">Live AI Call Coach</h3>
        </div>
        <span className="badge badge-emerald text-[10px]">Active Analysis</span>
      </div>

      {/* Pace & WPM Indicator */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Gauge className="w-4 h-4 text-indigo-600" />
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Speaking Speed</p>
            <p className="text-xs font-bold text-slate-900">{wpm || 0} WPM</p>
          </div>
        </div>
        <span className={`badge ${paceRating === 'Optimal' ? 'badge-emerald' : 'badge-amber'} text-[10px]`}>
          {paceRating || 'Optimal'}
        </span>
      </div>

      {/* Filler Words Warning */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <AlertCircle className={`w-3.5 h-3.5 ${fillerCount > 2 ? 'text-amber-600' : 'text-slate-400'}`} />
            Filler Words Detected
          </span>
          <span className={`font-mono text-xs font-bold ${fillerCount > 2 ? 'text-amber-600' : 'text-emerald-700'}`}>
            {fillerCount || 0}
          </span>
        </div>
        {detectedFillers && detectedFillers.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {detectedFillers.map((word, i) => (
              <span key={i} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-mono">
                "{word}"
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">Clean delivery! No heavy filler words.</p>
        )}
      </div>

      {/* Real-time Grammar Suggestions */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-56 pr-1">
        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
          <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
          Live Phrasing Tips
        </h4>

        {grammarIssues && grammarIssues.length > 0 ? (
          grammarIssues.map((issue, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs">
              <p className="text-rose-700 font-semibold mb-0.5 line-through">{issue.foundText}</p>
              <p className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {issue.correction}
              </p>
              <p className="text-[10px] text-slate-600 mt-1">{issue.explanation}</p>
            </div>
          ))
        ) : vocabSuggestions && vocabSuggestions.length > 0 ? (
          vocabSuggestions.map((v, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs">
              <p className="text-indigo-800 font-medium text-[11px]">Executive Vocabulary Upgrade:</p>
              <p className="text-slate-500 line-through text-[11px]">"{v.phrase}"</p>
              <p className="text-indigo-900 font-bold mt-0.5">➜ {v.suggestion}</p>
            </div>
          ))
        ) : (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-xs text-emerald-700 font-medium">Your grammar & terminology look solid!</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Keep speaking naturally.</p>
          </div>
        )}
      </div>

    </div>
  );
}
