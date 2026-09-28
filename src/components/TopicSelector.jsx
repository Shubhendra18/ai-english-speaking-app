import React, { useState } from 'react';
import { 
  TOPICS, AVATARS 
} from '../services/aiScenarios';
import { 
  Kanban, Code2, Presentation, GitPullRequest, RotateCcw, UserCheck, 
  DollarSign, Coffee, Plus, Search, Sparkles, PhoneCall, CheckCircle2, User, HelpCircle, Languages, Mic, Volume2, Copy, Check 
} from 'lucide-react';
import { getCustomTopics, saveCustomTopic } from '../services/storage';
import { translateHindiToCorporateEnglish } from '../services/geminiService';
import { speechEngine } from '../services/speechEngine';
import DailyVocabCard from './DailyVocabCard';

export default function TopicSelector({ onSelectScenario }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [customTopics, setCustomTopics] = useState(getCustomTopics());
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Home Page Hindi Translator State
  const [isListeningHindi, setIsListeningHindi] = useState(false);
  const [hindiVoiceText, setHindiVoiceText] = useState('');
  const [homeTranslation, setHomeTranslation] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Custom Topic Form state
  const [customTitle, setCustomTitle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const categories = ['All', 'Beginner Basics', 'Daily Engineering', 'Career & Hiring', 'Client & Stakeholders', 'Agile & Team', 'Casual & Networking'];

  const iconMap = {
    Kanban: <Kanban className="w-5 h-5" />,
    Code2: <Code2 className="w-5 h-5" />,
    Presentation: <Presentation className="w-5 h-5" />,
    GitPullRequest: <GitPullRequest className="w-5 h-5" />,
    RotateCcw: <RotateCcw className="w-5 h-5" />,
    UserCheck: <UserCheck className="w-5 h-5" />,
    DollarSign: <DollarSign className="w-5 h-5" />,
    Coffee: <Coffee className="w-5 h-5" />,
    HelpCircle: <HelpCircle className="w-5 h-5" />
  };

  const allTopics = [...TOPICS, ...customTopics];

  const filteredTopics = allTopics.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.targetVocab.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreateCustomTopic = (e) => {
    e.preventDefault();
    if (!customTitle.trim() || !customPrompt.trim()) return;

    const newTopic = {
      id: `custom_${Date.now()}`,
      category: 'Custom Prompt',
      title: customTitle,
      durationMinutes: 4,
      difficulty: 'Intermediate',
      icon: 'Code2',
      color: 'indigo',
      defaultAvatarId: selectedAvatar.id,
      promptContext: customPrompt,
      initialGreetings: [
        `Hello! I'm ready to practice your custom scenario: "${customTitle}". Let me know what you'd like to talk about today.`
      ],
      suggestedPhases: ["I am ready to share my thoughts on this topic..."],
      targetVocab: ['Architecture', 'Implementation', 'Deliverables'],
      keyQuestions: ["Could you elaborate on that point?"]
    };

    saveCustomTopic(newTopic);
    setCustomTopics(getCustomTopics());
    setShowCustomModal(false);
    setCustomTitle('');
    setCustomPrompt('');
  };

  // Start Hindi Voice Recording
  const handleStartHindiVoice = () => {
    setIsListeningHindi(true);
    setHindiVoiceText('');
    setHomeTranslation(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition not supported in this browser.");
      setIsListeningHindi(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'hi-IN';
    rec.interimResults = true;

    rec.onresult = (e) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        text += e.results[i][0].transcript;
      }
      setHindiVoiceText(text);
    };

    rec.onend = () => {
      setIsListeningHindi(false);
    };

    rec.onerror = () => {
      setIsListeningHindi(false);
    };

    rec.start();
  };

  // Perform Hindi to Corporate English Translation
  const handleTranslateHomeText = async () => {
    if (!hindiVoiceText.trim()) return;
    setIsTranslating(true);
    const result = await translateHindiToCorporateEnglish(hindiVoiceText);
    setIsTranslating(false);

    if (result) {
      setHomeTranslation(typeof result === 'string' ? result : result.englishTranslation);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      
      {/* Hero Banner Header (Light Theme) */}
      <div className="relative rounded-3xl glass-panel p-8 md:p-10 mb-8 overflow-hidden border-indigo-200 bg-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-indigo py-1 px-3">MY SIVI TECH AI</span>
            <span className="badge badge-emerald py-1 px-3">FOR BEGINNERS & PROS</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight mb-3">
            Master English Speaking in <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">IT & Tech Roles</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            No speaking partner? Practice 1-on-1 voice calls with AI avatars in natural Indian English. Use our instant Hindi Voice Translator below or start a live practice call!
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowCustomModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom IT Topic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Home Page Quick Hindi Voice Translator Widget (Light Theme) */}
      <div className="glass-panel p-6 rounded-3xl mb-8 border-amber-300 relative overflow-hidden bg-amber-50/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">🇮🇳 Quick Hindi Voice ➜ Corporate English Translator</h2>
              <p className="text-xs text-slate-600">Click the mic, speak your thought in Hindi/Hinglish, and get instant corporate IT English!</p>
            </div>
          </div>
        </div>

        {/* Voice Input & Translation Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left: Speak or Type Hindi Input */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
            <div>
              <label className="block text-xs font-bold text-amber-900 mb-2 flex items-center justify-between">
                <span>1. Speak or Type in Hindi:</span>
                {isListeningHindi && <span className="text-emerald-700 animate-pulse text-[10px]">● Listening to Hindi Voice...</span>}
              </label>

              <textarea
                rows={3}
                placeholder="e.g. Aaj main user login bug fix karunga aur PR create karke staging pe test karunga..."
                value={hindiVoiceText}
                onChange={(e) => setHindiVoiceText(e.target.value)}
                className="glass-input w-full text-xs"
              />
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleStartHindiVoice}
                className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isListeningHindi
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:brightness-105 shadow-md shadow-amber-500/20'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isListeningHindi ? 'Listening Hindi... (Speak Now)' : '🎙️ Speak Hindi'}</span>
              </button>

              <button
                onClick={handleTranslateHomeText}
                disabled={isTranslating || !hindiVoiceText.trim()}
                className="btn-primary py-2 px-4 text-xs bg-indigo-600 hover:bg-indigo-700"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTranslating ? 'Translating...' : 'Translate to English'}</span>
              </button>
            </div>
          </div>

          {/* Right: Natural Corporate English Output */}
          <div className="bg-white p-4 rounded-2xl border border-indigo-200 flex flex-col justify-between shadow-xs">
            <div>
              <span className="block text-xs font-bold text-indigo-900 mb-2">2. Natural Corporate IT English Result:</span>
              
              {homeTranslation ? (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-semibold text-slate-900 leading-relaxed">
                  "{homeTranslation}"
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs italic">
                  Your translated corporate English sentence will appear here...
                </div>
              )}
            </div>

            {homeTranslation && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => speechEngine.speak(homeTranslation, 'en-IN', 0.95, true)}
                  className="btn-secondary py-1.5 px-3 text-xs text-indigo-700 border-indigo-200 flex items-center gap-1.5 bg-indigo-50"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Listen Audio</span>
                </button>

                <button
                  onClick={() => handleCopyText(homeTranslation)}
                  className="btn-secondary py-1.5 px-3 text-xs text-emerald-700 border-emerald-200 flex items-center gap-1.5 bg-emerald-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Daily Vocabulary Objectives System */}
      <DailyVocabCard />

      {/* Select AI Avatar Partner Section (Light Theme) */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            1. Select Your AI Avatar Partner
          </h2>
          <span className="text-xs text-slate-500 font-medium">4 AI Mentors (Indian & Global Accents)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AVATARS.map(avatar => {
            const isSelected = selectedAvatar.id === avatar.id;
            return (
              <div
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar)}
                className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all bg-white ${
                  isSelected 
                    ? 'border-2 border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-500/10 scale-[1.02]' 
                    : 'hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatar.bgGradient} flex items-center justify-center font-bold text-lg text-white shadow-md`}>
                    {avatar.name[0]}
                  </div>
                  {isSelected && (
                    <span className="badge badge-indigo text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-indigo-600" /> Selected
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-slate-900">{avatar.name}</h3>
                <p className="text-xs text-indigo-700 font-bold mb-1">{avatar.title}</p>
                <p className="text-[11px] text-slate-500 mb-2">{avatar.company} • {avatar.accent}</p>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{avatar.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topics Library Section (Light Theme) */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            2. Choose IT Practice Scenario
          </h2>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search standup, PR, interview..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-9 text-xs"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Practice Topic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const avatarForTopic = AVATARS.find(a => a.id === topic.defaultAvatarId) || selectedAvatar;

            return (
              <div
                key={topic.id}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between border-slate-200 bg-white group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform">
                      {iconMap[topic.icon] || <Code2 className="w-5 h-5" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${topic.difficulty === 'Beginner' ? 'badge-emerald' : 'badge-amber'} text-[10px]`}>
                        {topic.difficulty}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{topic.durationMinutes}m</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">{topic.category}</span>
                  <h3 className="font-display font-bold text-lg text-slate-900 mt-1 mb-2 group-hover:text-indigo-600 transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {topic.promptContext}
                  </p>

                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Target Vocabulary:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {topic.targetVocab.slice(0, 4).map((vocab, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                          {vocab}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    speechEngine.unlockAudioContext();
                    onSelectScenario(topic, selectedAvatar);
                  }}
                  className="btn-primary w-full justify-center group-hover:shadow-indigo-500/40"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Start Practice Call</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Topic Creation Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel border-slate-200 p-6 rounded-3xl shadow-2xl bg-white">
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Create Custom IT Scenario</h3>
            <p className="text-xs text-slate-500 mb-4">Define a specific interview, project demo, or topic prompt for your AI coach.</p>

            <form onSubmit={handleCreateCustomTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scenario Title</label>
                <input
                  type="text"
                  placeholder="e.g., Senior DevOps Architect Interview"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="glass-input w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">AI Prompt & Context</label>
                <textarea
                  rows={4}
                  placeholder="e.g., Act as an AWS Cloud Manager. Ask me about Kubernetes cluster deployment, Terraform scripts, and CI/CD pipelines."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="glass-input w-full text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Create & Save Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
