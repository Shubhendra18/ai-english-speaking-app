import React, { useEffect } from 'react';
import { 
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, 
  BookOpen, Volume2, Download, Zap, Award, Sparkles, X, ChevronRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateCallOverallReport } from '../services/feedbackAnalyzer';

export default function CallReportModal({ transcript, callDurationSeconds, topic, avatar, onClose, onRestartCall }) {
  
  const report = generateCallOverallReport(transcript, callDurationSeconds);

  useEffect(() => {
    if (report.overallScore >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [report.overallScore]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl glass-panel border-slate-200 p-6 md:p-8 rounded-3xl my-8 shadow-2xl overflow-hidden bg-white">
        
        {/* Background Decorative Orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900">Call Performance Report</h2>
            <p className="text-sm text-slate-600">
              Scenario: <span className="text-indigo-700 font-semibold">{topic.title}</span> • Persona: {avatar.name}
            </p>
          </div>
        </div>

        {/* Score & Main Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          
          {/* Overall Call Score Card */}
          <div className="md:col-span-1 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center">
            <div className="relative flex items-center justify-center w-28 h-28 mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                <circle
                  cx="56" cy="56" r="48"
                  stroke={report.overallScore >= 80 ? '#059669' : report.overallScore >= 65 ? '#4f46e5' : '#d97706'}
                  strokeWidth="8"
                  strokeDasharray={301}
                  strokeDashoffset={301 - (301 * report.overallScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute font-display font-extrabold text-3xl text-slate-900">{report.overallScore}%</span>
            </div>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Overall Fluency</p>
            <span className={`badge mt-1.5 ${report.overallScore >= 80 ? 'badge-emerald' : 'badge-amber'}`}>
              {report.overallScore >= 85 ? 'Executive Ready' : report.overallScore >= 70 ? 'Proficient' : 'Needs Practice'}
            </span>
          </div>

          {/* Sub-Metrics Cards Grid */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* Grammar Score */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Grammar Index</p>
              <p className="font-display font-bold text-2xl text-emerald-700 mt-1">{report.grammarScore}%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{report.allGrammarIssues.length} issues detected</p>
            </div>

            {/* IT Vocab Score */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">IT Terminology</p>
              <p className="font-display font-bold text-2xl text-indigo-700 mt-1">{report.vocabScore}%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{report.allVocabSuggestions.length} phrase upgrades</p>
            </div>

            {/* Speaking Pace */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Speaking Pace</p>
              <p className="font-display font-bold text-2xl text-purple-700 mt-1">{report.averageWpm} WPM</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{report.paceSummary}</p>
            </div>

            {/* Total Spoken Words */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Total Spoken Words</p>
              <p className="font-display font-bold text-2xl text-slate-900 mt-1">{report.totalWords}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">In {Math.ceil(callDurationSeconds / 60)} min call</p>
            </div>

            {/* Filler Words */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Filler Word Count</p>
              <p className={`font-display font-bold text-2xl mt-1 ${report.totalFillers > 3 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {report.totalFillers}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">"Um", "Basically", "Like"</p>
            </div>

            {/* Call Duration */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Practice Duration</p>
              <p className="font-display font-bold text-2xl text-purple-700 mt-1">
                {Math.floor(callDurationSeconds / 60)}m {callDurationSeconds % 60}s
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Target: {topic.durationMinutes} min</p>
            </div>

          </div>

        </div>

        {/* AI Key Takeaways & Recommended Action Items */}
        <div className="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h3 className="font-display font-bold text-sm text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Key Improvement Takeaways
          </h3>
          <ul className="space-y-2 text-xs">
            {report.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Transcript Breakdown with Corrections */}
        <div className="mb-8">
          <h3 className="font-display font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Detailed Call Transcript & Phrase Analysis
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {transcript.map((turn, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-2xl border transition-all ${
                  turn.sender === 'ai' 
                    ? 'bg-indigo-50/60 border-indigo-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold ${turn.sender === 'ai' ? 'text-indigo-700' : 'text-emerald-700'}`}>
                    {turn.sender === 'ai' ? avatar.name : 'You (Candidate)'}
                  </span>
                  <span className="text-[10px] text-slate-500">{turn.timestamp}</span>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-medium">{turn.text}</p>

                {/* Per-Turn Analysis Feedback */}
                {turn.analysis && turn.analysis.grammarIssues && turn.analysis.grammarIssues.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                    {turn.analysis.grammarIssues.map((g, gIdx) => (
                      <div key={gIdx} className="flex items-center gap-2 text-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span><strong className="line-through">{g.foundText}</strong> ➜ <strong className="text-emerald-700">{g.correction}</strong></span>
                      </div>
                    ))}
                  </div>
                )}

                {turn.analysis && turn.analysis.vocabSuggestions && turn.analysis.vocabSuggestions.length > 0 && (
                  <div className="mt-2 p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-900">
                    💡 Executive Suggestion: Instead of "{turn.analysis.vocabSuggestions[0].phrase}", try "{turn.analysis.vocabSuggestions[0].suggestion}".
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            onClick={onRestartCall}
            className="btn-secondary w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Practice This Scenario Again
          </button>

          <button
            onClick={onClose}
            className="btn-primary w-full sm:w-auto px-8"
          >
            <span>Complete & Back to Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
