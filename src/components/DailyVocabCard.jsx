import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Volume2, Sparkles, Award, Lightbulb, Target } from 'lucide-react';
import { getTodayVocabObjectives, toggleLearnedWord } from '../services/dailyVocab';
import { speechEngine } from '../services/speechEngine';

export default function DailyVocabCard() {
  const [vocabList, setVocabList] = useState(getTodayVocabObjectives());

  const handleToggleLearned = (wordId) => {
    toggleLearnedWord(wordId);
    setVocabList(getTodayVocabObjectives());
  };

  const handlePronounce = (word) => {
    speechEngine.speak(word, 'en-US', 0.9);
  };

  const learnedCount = vocabList.filter(w => w.isLearned).length;
  const progressPercent = Math.round((learnedCount / vocabList.length) * 100);

  return (
    <div className="glass-panel p-6 rounded-3xl mb-8 border-indigo-500/20 relative overflow-hidden">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Progress Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-indigo text-[10px] py-0.5 px-2.5">DAILY OBJECTIVES</span>
            <span className="badge badge-emerald text-[10px] py-0.5 px-2.5">IT + DAILY ENGLISH</span>
          </div>
          <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Today's Vocabulary Goals
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Learn 5 essential words today to boost your speaking fluency & confidence.</p>
        </div>

        {/* Daily Progress Tracker */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-2xl border border-white/10 min-w-[220px]">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-300">Progress</span>
              <span className="text-emerald-400">{learnedCount} / {vocabList.length} Learned</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {learnedCount === vocabList.length && (
            <Award className="w-6 h-6 text-amber-400 animate-bounce" />
          )}
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
        {vocabList.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
              item.isLearned 
                ? 'bg-emerald-950/20 border-emerald-500/30' 
                : 'bg-slate-900/80 border-white/10 hover:border-indigo-500/30'
            }`}
          >
            <div>
              {/* Category Badge & Pronounce Button */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                  item.category.includes('IT') 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {item.category}
                </span>

                <button
                  onClick={() => handlePronounce(item.word)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                  title="Listen to Audio Pronunciation"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Word & Phonetic */}
              <h3 className="font-display font-bold text-lg text-white">{item.word}</h3>
              <p className="text-[10px] text-slate-400 font-mono mb-2">{item.phonetic}</p>

              {/* Definition */}
              <p className="text-xs text-slate-300 leading-snug mb-2 font-medium">{item.definition}</p>

              {/* Example Sentence */}
              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-indigo-200 italic mb-3">
                "{item.example}"
              </div>
            </div>

            {/* Check Mark Learned Button */}
            <button
              onClick={() => handleToggleLearned(item.id)}
              className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                item.isLearned 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${item.isLearned ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{item.isLearned ? 'Learned!' : 'Mark Learned'}</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
