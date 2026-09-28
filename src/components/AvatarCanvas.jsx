import React from 'react';

export default function AvatarCanvas({ avatar, isSpeaking, isListening, lastAIText }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl bg-slate-950 border border-indigo-500/30 shadow-2xl">
      
      {/* Studio Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />

      {/* WitSpeak Style Stylized Digital Human Avatar Frame */}
      <div className="relative h-full aspect-[3/4] max-w-full flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-slate-900/60">
        
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
        <div className="absolute top-6 left-6 max-w-sm bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-300 z-30">
          <div className="flex items-start gap-3">
            <span className="text-xl">😊</span>
            <div>
              <p className="text-xs font-bold text-indigo-300">{avatar.name}</p>
              <p className="text-xs text-white font-medium leading-relaxed mt-0.5 line-clamp-3">
                "{lastAIText}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WitSpeak Style Bottom Persona Tag & Audio Wave Indicator */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 shadow-xl">
          <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-indigo-400 animate-ping' : isListening ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white leading-tight">{avatar.name}</h4>
              <span className="badge badge-emerald text-[8px] py-0 px-1.5">LIVE WITSPEAK AI</span>
            </div>
            <p className="text-[10px] text-indigo-300 font-semibold">{avatar.title} • {avatar.accent}</p>
          </div>
        </div>

        {/* Live Audio Equalizer Bars when speaking */}
        {isSpeaking && (
          <div className="flex items-end gap-1 bg-indigo-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-indigo-500/40 shadow-lg">
            <div className="audio-bar" />
            <div className="audio-bar" />
            <div className="audio-bar" />
            <div className="audio-bar" />
            <span className="text-[10px] font-bold text-indigo-300 ml-1.5">Speaking...</span>
          </div>
        )}
      </div>

    </div>
  );
}
