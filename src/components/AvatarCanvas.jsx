import React from 'react';

export default function AvatarCanvas({ avatar, isSpeaking, isListening, lastAIText }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl bg-slate-900 border border-slate-200 shadow-lg">
      
      {/* Studio Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 pointer-events-none" />

      {/* WitSpeak Style Stylized Digital Human Avatar Frame */}
      <div className="relative h-full aspect-[3/4] max-w-full flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-slate-900">
        
        {/* Character Portrait Image */}
        <img
          src={avatar.image || '/avatars/priya.jpg'}
          alt={avatar.name}
          className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out ${
            isSpeaking ? 'scale-105 filter brightness-105' : 'scale-100'
          }`}
        />

        {/* Ambient Dark Gradient Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Active Speaking Pulsating Rim Light Frame */}
        {isSpeaking && (
          <div className="absolute inset-0 border-2 border-indigo-400/80 rounded-3xl shadow-[inset_0_0_50px_rgba(99,102,241,0.5)] animate-pulse pointer-events-none" />
        )}
        {isListening && (
          <div className="absolute inset-0 border-2 border-emerald-400/70 rounded-3xl shadow-[inset_0_0_50px_rgba(16,185,129,0.35)] pointer-events-none" />
        )}
      </div>

      {/* WitSpeak / Loora Style Floating Speech Dialog Bubble */}
      {lastAIText && (
        <div className="absolute top-4 left-4 right-4 sm:right-auto max-w-md bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl animate-in fade-in slide-in-from-top-3 duration-300 z-30">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">😊</span>
            <div>
              <p className="text-xs font-bold text-indigo-700">{avatar.name}</p>
              <p className="text-xs text-slate-800 font-medium leading-relaxed mt-0.5 line-clamp-3">
                "{lastAIText}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WitSpeak Style Bottom Persona Tag & Audio Wave Indicator */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xl">
          <div className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-indigo-600 animate-ping' : isListening ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-900 leading-tight">{avatar.name}</h4>
              <span className="badge badge-emerald text-[8px] py-0 px-1.5">LIVE WITSPEAK AI</span>
            </div>
            <p className="text-[10px] text-indigo-700 font-semibold">{avatar.title} • {avatar.accent}</p>
          </div>
        </div>

        {/* Live Audio Equalizer Bars when speaking */}
        {isSpeaking && (
          <div className="flex items-end gap-1 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-indigo-200 shadow-lg">
            <div className="audio-bar" />
            <div className="audio-bar" />
            <div className="audio-bar" />
            <div className="audio-bar" />
            <span className="text-[10px] font-bold text-indigo-700 ml-1.5">Speaking...</span>
          </div>
        )}
      </div>

    </div>
  );
}
