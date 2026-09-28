import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, Zap, Clock, Send, Sparkles, CheckCircle2, HelpCircle, Volume2, MessageSquare, Lightbulb, Languages, X 
} from 'lucide-react';

import AvatarCanvas from './AvatarCanvas';
import LiveFeedbackDrawer from './LiveFeedbackDrawer';
import { speechEngine } from '../services/speechEngine';
import { analyzeSpeechTurn, generateAIResponse } from '../services/feedbackAnalyzer';
import { callGeminiCoach, generateDynamicGreeting, translateHindiToCorporateEnglish } from '../services/geminiService';

export default function CallRoom({ topic, avatar, settings, onEndCall }) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamEnabled, setIsCamEnabled] = useState(settings?.cameraEnabled ?? true);
  const [showDrawer, setShowDrawer] = useState(true);

  // Skill Level & Gender
  const skillLevel = settings?.skillLevel || 'beginner';
  const isFemaleAvatar = avatar.id === 'priya' || avatar.id === 'sarah';

  // Call Speech State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [currentInterimText, setCurrentInterimText] = useState('');
  const [currentTurnAnalysis, setCurrentTurnAnalysis] = useState(null);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [silenceCountdown, setSilenceCountdown] = useState(null);

  // Hindi Translator Modal State
  const [showHindiModal, setShowHindiModal] = useState(false);
  const [hindiInputText, setHindiInputText] = useState('');
  const [translatedEnglish, setTranslatedEnglish] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Refs
  const silenceTimerRef = useRef(null);
  const latestSpeechTextRef = useRef('');
  const chatEndRef = useRef(null);

  // User Webcam Stream
  const videoRef = useRef(null);
  const userMediaStream = useRef(null);

  // Auto Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentInterimText]);

  // 1. Timer & Audio Unlock
  useEffect(() => {
    speechEngine.unlockAudioContext();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. User Webcam Setup
  useEffect(() => {
    if (isCamEnabled) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then(stream => {
          userMediaStream.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setIsCamEnabled(false);
        });
    } else {
      if (userMediaStream.current) {
        userMediaStream.current.getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      if (userMediaStream.current) {
        userMediaStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCamEnabled]);

  // 3. Dynamic Initial AI Greeting Call
  useEffect(() => {
    let isMounted = true;

    const initGreeting = async () => {
      const userApiKey = settings?.geminiApiKey || '';
      const greetingText = await generateDynamicGreeting(topic, avatar, userApiKey);

      if (isMounted) {
        setTranscript([{
          sender: 'ai',
          text: greetingText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        triggerAISpeech(greetingText);
      }
    };

    initGreeting();

    return () => {
      isMounted = false;
    };
  }, [topic, avatar]);

  // Trigger AI Speech
  const triggerAISpeech = (text) => {
    setIsListening(false);
    speechEngine.stopListening();
    clearSilenceTimer();

    const targetVoiceCode = avatar.voiceCode || settings?.voiceAccent || 'en-IN';

    speechEngine.speak(
      text,
      targetVoiceCode,
      settings?.speechRate || (skillLevel === 'beginner' ? 0.9 : 1.0),
      isFemaleAvatar,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        startUserListening();
      }
    );
  };

  // Replay AI Voice
  const handleReplayAISpeech = (textToReplay) => {
    const text = textToReplay || transcript.filter(t => t.sender === 'ai').slice(-1)[0]?.text;
    if (text) {
      speechEngine.unlockAudioContext();
      triggerAISpeech(text);
    }
  };

  // Start continuous user speech recognition
  const startUserListening = () => {
    if (isMicMuted || showHindiModal) return;
    
    setIsListening(true);
    speechEngine.startListening(
      ({ final, interim, full }) => {
        const spokenText = full || interim || final;
        setCurrentInterimText(spokenText);
        latestSpeechTextRef.current = spokenText;
        
        if (spokenText && spokenText.trim().length > 0) {
          const liveAnalysis = analyzeSpeechTurn(spokenText, 12);
          setCurrentTurnAnalysis(liveAnalysis);

          resetSilenceTimer();
        }
      },
      (err) => {
        console.warn('Speech engine warning:', err);
      }
    );
  };

  // Auto-Silence Timer
  const resetSilenceTimer = () => {
    clearSilenceTimer();
    setSilenceCountdown(2);

    silenceTimerRef.current = setTimeout(() => {
      const currentText = latestSpeechTextRef.current;
      if (currentText && currentText.trim().length > 2) {
        handleUserSubmitTurn(currentText);
      }
      setSilenceCountdown(null);
    }, 1800);
  };

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setSilenceCountdown(null);
  };

  // User Submits Turn
  const handleUserSubmitTurn = async (explicitText) => {
    clearSilenceTimer();

    const textToSubmit = explicitText || currentInterimText || latestSpeechTextRef.current;
    if (!textToSubmit || textToSubmit.trim().length === 0) return;

    speechEngine.stopListening();
    setIsListening(false);
    setIsAIProcessing(true);
    setCurrentInterimText('');
    latestSpeechTextRef.current = '';

    const finalTurnAnalysis = analyzeSpeechTurn(textToSubmit, 15);

    const userTurn = {
      sender: 'user',
      text: textToSubmit,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      analysis: finalTurnAnalysis
    };

    const updatedTranscript = [...transcript, userTurn];
    setTranscript(updatedTranscript);

    let aiResponseText = '';
    const userApiKey = settings?.geminiApiKey || '';

    // Pass updatedTranscript for multi-turn conversation memory
    const geminiResult = await callGeminiCoach(textToSubmit, topic, avatar, skillLevel, userApiKey, updatedTranscript);

    if (geminiResult && geminiResult.spokenResponse) {
      aiResponseText = geminiResult.spokenResponse;
      if (geminiResult.grammarCorrection) {
        finalTurnAnalysis.grammarIssues.push({
          foundText: geminiResult.grammarCorrection.incorrect,
          correction: geminiResult.grammarCorrection.correction,
          explanation: geminiResult.grammarCorrection.explanation
        });
      }
    } else {
      const userTurnCount = updatedTranscript.filter(t => t.sender === 'user').length;
      aiResponseText = generateAIResponse(textToSubmit, topic, avatar, userTurnCount);
    }

    setIsAIProcessing(false);

    setTranscript(prev => [...prev, {
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    triggerAISpeech(aiResponseText);
  };

  // Hindi Translation Action
  const handleTranslateHindi = async () => {
    if (!hindiInputText.trim()) return;
    setIsTranslating(true);
    const userApiKey = settings?.geminiApiKey || '';
    const result = await translateHindiToCorporateEnglish(hindiInputText, userApiKey);
    setIsTranslating(false);
    
    if (result) {
      setTranslatedEnglish(typeof result === 'string' ? result : result.englishTranslation);
    }
  };

  const handleEndCallAction = () => {
    clearSilenceTimer();
    speechEngine.stopSpeaking();
    speechEngine.stopListening();
    onEndCall(transcript, callDuration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const lastAITurn = transcript.filter(t => t.sender === 'ai').slice(-1)[0]?.text;

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] max-w-7xl mx-auto px-3 sm:px-4 pb-8">
      
      {/* Top Mobile PWA Voice Unlock Alert Banner */}
      <div 
        onClick={() => handleReplayAISpeech()}
        className="mb-3 p-2.5 sm:p-3 rounded-2xl bg-indigo-950/70 border border-indigo-400/40 text-xs text-indigo-200 flex items-center justify-between cursor-pointer hover:bg-indigo-900/80 transition-all shadow-lg"
      >
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse flex-shrink-0" />
          <span className="font-medium text-[11px] sm:text-xs">Mobile PWA Voice: Tap here anytime if you cannot hear the AI voice!</span>
        </div>
        <span className="badge badge-indigo text-[10px] bg-indigo-600 text-white px-2 py-0.5 flex-shrink-0">
          🔊 Tap to Hear AI
        </span>
      </div>

      {/* Top Call Info HUD Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between glass-panel p-3.5 sm:px-6 sm:py-3.5 mb-4 border-indigo-500/20 gap-3">
        
        {/* Left: Scenario Title & Mobile Top-Pinned End Call Button */}
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-display font-bold text-sm sm:text-base text-white">{topic.title}</h2>
                <span className="badge badge-emerald text-[8px] sm:text-[9px] py-0.5 px-1.5">LIVE TUTOR</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">With {avatar.name} ({avatar.accent})</p>
            </div>
          </div>

          {/* Mobile Top-Pinned End Call Button */}
          <button
            onClick={handleEndCallAction}
            className="sm:hidden btn-danger py-1.5 px-3 text-xs flex items-center gap-1 shadow-rose-500/30 flex-shrink-0 font-bold"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>

        {/* Right: Controls & Desktop End Call */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          {/* Replay Voice Button */}
          <button
            onClick={() => handleReplayAISpeech()}
            className="btn-secondary py-1.5 px-2.5 sm:px-3 text-xs bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/40 flex items-center gap-1.5 whitespace-nowrap"
            title="Replay AI Voice"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Replay Voice</span>
          </button>

          {/* Hindi Translator */}
          <button
            onClick={() => setShowHindiModal(true)}
            className="btn-primary py-1.5 px-2.5 sm:px-3 text-xs bg-gradient-to-r from-amber-600 to-orange-600 shadow-amber-500/20 flex items-center gap-1 whitespace-nowrap"
            title="Translate Hindi thoughts to Corporate English"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>🇮🇳 Hindi</span>
          </button>

          {/* Call Timer */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-white/10 font-mono text-xs sm:text-sm font-semibold text-cyan-400 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {formatTime(callDuration)}
          </div>

          {/* Show / Hide Coach */}
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className={`btn-secondary py-1.5 px-2.5 sm:px-3 text-xs whitespace-nowrap ${showDrawer ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300' : ''}`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showDrawer ? 'Hide Coach' : 'Show Coach'}</span>
          </button>

          {/* Desktop End Call Button */}
          <button
            onClick={handleEndCallAction}
            className="hidden sm:flex btn-danger py-1.5 px-4 text-xs items-center gap-1.5 shadow-rose-500/30 whitespace-nowrap font-bold"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Main Call Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        
        {/* Left Column: Avatar & Webcam Frame */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          <div className="relative rounded-3xl overflow-hidden glass-panel border-indigo-500/20 h-[380px]">
            <AvatarCanvas
              avatar={avatar}
              isSpeaking={isSpeaking}
              isListening={isListening}
              lastAIText={lastAITurn}
            />

            {/* Webcam Preview */}
            <div className="absolute top-4 right-4 w-32 sm:w-44 aspect-video rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl bg-slate-950">
              {isCamEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 text-[10px]">
                  <VideoOff className="w-5 h-5 mb-1 text-slate-500" />
                  Camera Off
                </div>
              )}
              <div className="absolute bottom-1.5 left-2 bg-slate-900/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                You
              </div>
            </div>

            {/* Hands-Free Indicator */}
            {isListening && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-2xl border border-emerald-500/40 shadow-xl">
                <div className="flex items-end gap-1">
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  {silenceCountdown ? `Listening... Auto-submitting soon` : `Listening (Speak naturally)`}
                </div>
              </div>
            )}
          </div>

          {/* Teacher Guidance Buttons */}
          <div className="glass-panel p-4 rounded-2xl border-indigo-500/20 bg-slate-900/90">
            <p className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Ask {avatar.name} (Your AI Teacher) for Guidance:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleUserSubmitTurn(`${avatar.name}, please ask me a different follow-up question based on what we discussed.`)}
                className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/30 p-2.5 rounded-xl transition-all text-left font-medium"
              >
                🎲 "Ask me a different question"
              </button>
              <button
                onClick={() => handleUserSubmitTurn(`Priya, what is a better corporate English way to say my last answer?`)}
                className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 p-2.5 rounded-xl transition-all text-left font-medium"
              >
                💡 "What is a better corporate way to say this?"
              </button>
              <button
                onClick={() => setShowHindiModal(true)}
                className="text-xs bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-200 border border-amber-500/30 p-2.5 rounded-xl transition-all text-left font-semibold"
              >
                🇮🇳 "Translate Hindi to Corporate English"
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Full Speech-to-Text Live Chat Log */}
        <div className="flex flex-col glass-panel p-4 rounded-3xl border-white/10 h-[520px]">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Live Speech-to-Text Chat
            </h3>
            <span className="badge badge-indigo text-[9px]">{transcript.length} Messages</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {transcript.map((turn, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl text-xs flex flex-col ${
                  turn.sender === 'ai'
                    ? 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 self-start'
                    : 'bg-slate-900 border border-emerald-500/30 text-emerald-100 self-end'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold text-[11px] ${turn.sender === 'ai' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                    {turn.sender === 'ai' ? avatar.name : 'You (Speech-to-Text)'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500">{turn.timestamp}</span>
                    {turn.sender === 'ai' && (
                      <button
                        onClick={() => handleReplayAISpeech(turn.text)}
                        className="p-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40"
                        title="Replay Voice"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="leading-relaxed font-medium">{turn.text}</p>
              </div>
            ))}

            {currentInterimText && (
              <div className="p-3 rounded-2xl text-xs bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 italic">
                <span className="font-bold text-[10px] block mb-0.5 text-cyan-400">You are speaking...</span>
                "{currentInterimText}"
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

      </div>

      {/* Drawer Overlay */}
      <LiveFeedbackDrawer
        currentAnalysis={currentTurnAnalysis}
        isOpen={showDrawer}
        onToggle={() => setShowDrawer(!showDrawer)}
      />

      {/* Hindi to Corporate English Translator Modal */}
      {showHindiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel border-amber-500/30 p-6 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white">Hindi ➜ Corporate English Helper</h3>
                  <p className="text-[11px] text-slate-400">Speak or type in Hindi/Hinglish to get polished IT English</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowHindiModal(false);
                  setTranslatedEnglish(null);
                  startUserListening();
                }}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Type or Speak your thought in Hindi/Hinglish:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Aaj main login bug fix karke staging pe deploy karunga aur team ko update dunga"
                  value={hindiInputText}
                  onChange={(e) => setHindiInputText(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <button
                onClick={handleTranslateHindi}
                disabled={isTranslating || !hindiInputText.trim()}
                className="btn-primary w-full justify-center text-xs bg-gradient-to-r from-amber-600 to-orange-600 shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isTranslating ? 'Translating to Corporate English...' : 'Translate to Natural IT English'}</span>
              </button>

              {translatedEnglish && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2 animate-in fade-in duration-300">
                  <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Natural Indian Corporate English:</p>
                  <p className="text-white font-bold text-sm leading-relaxed">"{translatedEnglish}"</p>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        speechEngine.speak(translatedEnglish, avatar.voiceCode || 'en-IN', 0.95, isFemaleAvatar);
                      }}
                      className="btn-secondary py-1.5 px-3 text-[11px] flex items-center gap-1 text-amber-300 border-amber-500/30"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Listen Pronunciation
                    </button>

                    <button
                      onClick={() => {
                        setShowHindiModal(false);
                        handleUserSubmitTurn(translatedEnglish);
                        setTranslatedEnglish(null);
                        setHindiInputText('');
                      }}
                      className="btn-primary py-1.5 px-3 text-[11px] flex items-center gap-1 bg-emerald-600"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Speak This to {avatar.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls Toolbar */}
      <div className="glass-panel p-3.5 sm:px-6 sm:py-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between border-white/10 gap-3">
        <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span className="text-[11px] sm:text-xs">Hands-free call active • Talk to {avatar.name} naturally</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => handleReplayAISpeech()}
            className="p-2.5 sm:p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/40 transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="Replay AI Speech Audio"
          >
            <Volume2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs">Tap to Hear AI</span>
          </button>

          <button
            onClick={() => {
              setIsMicMuted(!isMicMuted);
              if (!isMicMuted) {
                speechEngine.stopListening();
                clearSilenceTimer();
              } else {
                startUserListening();
              }
            }}
            className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
              isMicMuted 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                : 'bg-slate-900 border-white/10 text-slate-200 hover:bg-white/10'
            }`}
            title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isMicMuted ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={() => setIsCamEnabled(!isCamEnabled)}
            className={`p-2.5 sm:p-3 rounded-xl border transition-all ${
              !isCamEnabled 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                : 'bg-slate-900 border-white/10 text-slate-200 hover:bg-white/10'
            }`}
            title={isCamEnabled ? "Disable Camera" : "Enable Camera"}
          >
            {isCamEnabled ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={handleEndCallAction}
            className="btn-danger py-2 px-3 text-xs flex items-center gap-1.5 shadow-rose-500/30 font-bold"
            title="End Practice Call"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>

    </div>
  );
}
