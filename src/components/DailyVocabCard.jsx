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
    <div className="glass-panel p-6 rounded-3xl mb-8 border-indigo-200 bg-white relative overflow-hidden shadow-sm">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Progress Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-indigo text-[10px] py-0.5 px-2.5">DAILY OBJECTIVES</span>
            <span className="badge badge-emerald text-[10px] py-0.5 px-2.5">IT + DAILY ENGLISH</span>
          </div>
          <h2 className="font-display font-extrabold text-xl text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Today's Vocabulary Goals
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">Learn 5 essential words today to boost your speaking fluency & confidence.</p>
        </div>

        {/* Daily Progress Tracker */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 min-w-[220px]">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-700">Progress</span>
              <span className="text-emerald-700">{learnedCount} / {vocabList.length} Learned</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {learnedCount === vocabList.length && (
            <Award className="w-6 h-6 text-amber-500 animate-bounce" />
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
                ? 'bg-emerald-50/60 border-emerald-300' 
                : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
            }`}
          >
            <div>
              {/* Category Badge & Pronounce Button */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                  item.category.includes('IT') 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                    : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                }`}>
                  {item.category}
                </span>

                <button
                  onClick={() => handlePronounce(item.word)}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Listen to Audio Pronunciation"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Word & Phonetic */}
              <h3 className="font-display font-bold text-lg text-slate-900">{item.word}</h3>
              <p className="text-[10px] text-slate-500 font-mono mb-2">{item.phonetic}</p>

              {/* Definition */}
              <p className="text-xs text-slate-700 leading-snug mb-2 font-medium">{item.definition}</p>

              {/* Example Sentence */}
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-indigo-900 italic mb-3">
                "{item.example}"
              </div>
            </div>

            {/* Check Mark Learned Button */}
            <button
              onClick={() => handleToggleLearned(item.id)}
              className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                item.isLearned 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${item.isLearned ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{item.isLearned ? 'Learned!' : 'Mark Learned'}</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
