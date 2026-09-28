// Web Speech Recognition & Gender-Specific Voice Selection Service (Mobile PWA & Multi-Turn Audio Enhanced)

class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioCtx = null;
    this.voices = [];
    this.activeAudioFallback = null;
    this.resumeInterval = null;
    
    this.onResultCallback = null;
    this.onEndCallback = null;
    this.onErrorCallback = null;
    this.onSpeakingStateChange = null;

    this.initRecognition();
    this.initVoices();
  }

  initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN';

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (this.onResultCallback) {
          this.onResultCallback({
            final: finalTranscript,
            interim: interimTranscript,
            full: finalTranscript || interimTranscript
          });
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {}
        } else if (this.onEndCallback) {
          this.onEndCallback();
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error !== 'no-speech' && this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
      };
    }
  }

  initVoices() {
    if (!this.synth) return;
    
    const loadVoices = () => {
      try {
        this.voices = this.synth.getVoices() || [];
      } catch (e) {
        this.voices = [];
      }
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  playSpeakerTestChime() {
    try {
      if (typeof window === 'undefined') return false;
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return false;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.4);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Explicit Mobile Audio & Web Speech Synthesis Unlocker
  unlockAudioContext() {
    if (this.synth) {
      try {
        this.synth.resume();
        const silentUtterance = new SpeechSynthesisUtterance(' ');
        silentUtterance.volume = 0.01;
        this.synth.speak(silentUtterance);
      } catch (e) {}
    }
    this.playSpeakerTestChime();
  }

  getBestVoice(voiceCode = 'en-IN', isFemale = true) {
    if (!this.synth) return null;
    if (this.voices.length === 0) {
      try {
        this.voices = this.synth.getVoices() || [];
      } catch (e) {}
    }

    if (this.voices.length === 0) return null;

    const maleKeywords = ['Ravi', 'Prabhat', 'David', 'George', 'Daniel', 'Mark', 'Alex', 'Male', 'Guy'];
    const femaleKeywords = ['Heera', 'Veena', 'Zira', 'Samantha', 'Victoria', 'Karen', 'Female', 'Google हिन्दी', 'Google UK English Female', 'Google US English'];

    let accentMatches = this.voices.filter(v => 
      v.lang === voiceCode || 
      v.lang.startsWith(voiceCode.substring(0, 2)) ||
      v.lang.includes('IN')
    );

    if (accentMatches.length === 0) {
      accentMatches = this.voices;
    }

    if (isFemale) {
      const femaleMatch = accentMatches.find(v => 
        femaleKeywords.some(kw => v.name.includes(kw)) &&
        !maleKeywords.some(kw => v.name.includes(kw))
      );
      if (femaleMatch) return femaleMatch;

      const anyFemale = this.voices.find(v => 
        femaleKeywords.some(kw => v.name.includes(kw))
      );
      if (anyFemale) return anyFemale;
    } else {
      const maleMatch = accentMatches.find(v => 
        maleKeywords.some(kw => v.name.includes(kw))
      );
      if (maleMatch) return maleMatch;
    }

    return accentMatches[0] || this.voices[0] || null;
  }

  startListening(onResult, onError) {
    if (!this.recognition) {
      if (onError) onError('SpeechRecognition not supported.');
      return false;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.isListening = true;

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      return false;
    }
  }

  // Abort microphone track immediately so mobile speaker hardware is freed up for TTS playback
  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        try { this.recognition.stop(); } catch (err) {}
      }
    }
  }

  // Multi-sentence Audio Fallback Player for 100% Mobile Reliability
  playAudioFallback(text, onStart, onEnd) {
    try {
      this.stopSpeaking();

      // Split text into short natural sentences
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      let index = 0;

      const playNextSentence = () => {
        if (index >= sentences.length) {
          this.activeAudioFallback = null;
          if (onEnd) onEnd();
          if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
          return;
        }

        const sentenceText = sentences[index].trim();
        index++;

        if (!sentenceText) {
          playNextSentence();
          return;
        }

        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sentenceText)}&tl=en&client=tw-ob`;
        const audio = new Audio(ttsUrl);
        this.activeAudioFallback = audio;
        audio.volume = 1.0;

        if (index === 1) {
          audio.onplay = () => {
            if (onStart) onStart();
            if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);
          };
        }

        audio.onended = () => {
          playNextSentence();
        };

        audio.onerror = () => {
          playNextSentence();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn('Audio sentence play blocked:', err);
            playNextSentence();
          });
        }
      };

      playNextSentence();
    } catch (e) {
      console.warn('Audio fallback error:', e);
      if (onEnd) onEnd();
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
    }
  }

  speak(text, voiceCode = 'en-IN', rate = 1.0, isFemale = true, onStart, onEnd) {
    this.stopSpeaking();
    this.playSpeakerTestChime();

    if (!this.synth) {
      this.playAudioFallback(text, onStart, onEnd);
      return;
    }

    try {
      this.synth.cancel();
      this.synth.resume();
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Gender & Accent Selection
    const selectedVoice = this.getBestVoice(voiceCode, isFemale);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = voiceCode || 'en-US';
    }

    utterance.rate = rate || 1.0;
    utterance.pitch = isFemale ? 1.15 : 0.95;
    utterance.volume = 1.0;

    let hasStarted = false;
    let hasEnded = false;

    utterance.onstart = () => {
      hasStarted = true;
      if (onStart) onStart();
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);

      if (this.resumeInterval) clearInterval(this.resumeInterval);
      this.resumeInterval = setInterval(() => {
        if (this.synth && this.synth.speaking) {
          this.synth.resume();
        } else {
          clearInterval(this.resumeInterval);
        }
      }, 350);
    };

    utterance.onend = () => {
      if (this.resumeInterval) clearInterval(this.resumeInterval);
      if (!hasEnded) {
        hasEnded = true;
        if (onEnd) onEnd();
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      }
    };

    utterance.onerror = (e) => {
      if (this.resumeInterval) clearInterval(this.resumeInterval);
      console.warn('SpeechSynthesis error, falling back to Audio Stream:', e);
      if (!hasEnded) {
        hasEnded = true;
        this.playAudioFallback(text, onStart, onEnd);
      }
    };

    // If SpeechSynthesis fails to fire onstart within 500ms (common on mobile turn 2), switch to Audio Fallback
    setTimeout(() => {
      if (!hasStarted && !hasEnded) {
        console.warn('SpeechSynthesis silent on turn 2, switching to Audio Fallback...');
        hasEnded = true;
        try { this.synth.cancel(); } catch (e) {}
        this.playAudioFallback(text, onStart, onEnd);
      }
    }, 500);

    const estimatedDurationMs = Math.max((text.length / 15) * 1000 * (1 / (rate || 1.0)), 2000);
    setTimeout(() => {
      if (this.resumeInterval) clearInterval(this.resumeInterval);
      if (!hasEnded) {
        hasEnded = true;
        if (onEnd) onEnd();
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      }
    }, estimatedDurationMs + 1500);

    try {
      this.synth.speak(utterance);
      this.synth.resume();
    } catch (err) {
      console.warn('Speech synthesis speak exception:', err);
      this.playAudioFallback(text, onStart, onEnd);
    }
  }

  stopSpeaking() {
    if (this.resumeInterval) clearInterval(this.resumeInterval);
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    if (this.activeAudioFallback) {
      try {
        this.activeAudioFallback.pause();
        this.activeAudioFallback.currentTime = 0;
        this.activeAudioFallback = null;
      } catch (e) {}
    }
    if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
  }
}

export const speechEngine = new SpeechEngine();
