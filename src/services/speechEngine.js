// Web Speech Recognition & Gender-Specific Voice Selection Service

class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = window.speechSynthesis || null;
    this.audioCtx = null;
    this.voices = [];
    
    this.onResultCallback = null;
    this.onEndCallback = null;
    this.onErrorCallback = null;
    this.onSpeakingStateChange = null;

    this.initRecognition();
    this.initVoices();
  }

  initRecognition() {
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
      this.voices = this.synth.getVoices() || [];
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  playSpeakerTestChime() {
    try {
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

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
      return true;
    } catch (e) {
      return false;
    }
  }

  unlockAudioContext() {
    if (this.synth) {
      try {
        this.synth.resume();
      } catch (e) {}
    }
    this.playSpeakerTestChime();
  }

  getBestVoice(voiceCode = 'en-IN', isFemale = true) {
    if (!this.synth) return null;
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices() || [];
    }

    if (this.voices.length === 0) return null;

    const maleKeywords = ['Ravi', 'Prabhat', 'David', 'George', 'Daniel', 'Mark', 'Alex', 'Male', 'Guy'];
    const femaleKeywords = ['Heera', 'Veena', 'Zira', 'Samantha', 'Victoria', 'Karen', 'Female', 'Google हिन्दी', 'Google UK English Female', 'Google US English'];

    // Filter by Accent
    let accentMatches = this.voices.filter(v => 
      v.lang === voiceCode || 
      v.lang.startsWith(voiceCode.substring(0, 2)) ||
      v.lang.includes('IN')
    );

    if (accentMatches.length === 0) {
      accentMatches = this.voices;
    }

    if (isFemale) {
      // Find female voice
      const femaleMatch = accentMatches.find(v => 
        femaleKeywords.some(kw => v.name.includes(kw)) &&
        !maleKeywords.some(kw => v.name.includes(kw))
      );
      if (femaleMatch) return femaleMatch;

      // Fallback female voice from all voices
      const anyFemale = this.voices.find(v => 
        femaleKeywords.some(kw => v.name.includes(kw))
      );
      if (anyFemale) return anyFemale;
    } else {
      // Find male voice
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

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  speak(text, voiceCode = 'en-IN', rate = 1.0, isFemale = true, onStart, onEnd) {
    this.playSpeakerTestChime();

    if (!this.synth) {
      if (onStart) onStart();
      setTimeout(() => { if (onEnd) onEnd(); }, Math.max(text.length * 65, 1500));
      return;
    }

    try {
      this.synth.cancel();
      this.synth.resume();
    } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Gender-aware Voice Selection
    const selectedVoice = this.getBestVoice(voiceCode, isFemale);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = rate || 1.0;
    utterance.pitch = isFemale ? 1.15 : 0.95; // Female vs Male pitch tuning
    utterance.volume = 1.0;

    let hasEnded = false;

    utterance.onstart = () => {
      if (onStart) onStart();
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);
    };

    utterance.onend = () => {
      if (!hasEnded) {
        hasEnded = true;
        if (onEnd) onEnd();
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      }
    };

    utterance.onerror = (e) => {
      if (!hasEnded) {
        hasEnded = true;
        if (onEnd) onEnd();
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      }
    };

    const estimatedDurationMs = Math.max((text.length / 15) * 1000 * (1 / (rate || 1.0)), 2000);
    setTimeout(() => {
      if (!hasEnded) {
        hasEnded = true;
        if (onEnd) onEnd();
        if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      }
    }, estimatedDurationMs + 1000);

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
  }
}

export const speechEngine = new SpeechEngine();
