/**
 * Web Audio API & Studio Audio Engine for Lorica: Catholic Prayers & Spiritual Armor
 * Provides:
 * 1. High-fidelity studio audio track player (Gregorian chants, choral antiphons)
 * 2. Reverent contemplative voice synthesis (neural voice prioritization, warm pacing)
 * 3. Synthesized sacred church bells (acoustic partials)
 * 4. Cathedral ambient drone (deep D minor pipe organ resonance)
 * 5. Soothing night rain generator (filtered pink noise)
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientGain = null;
    this.rainGain = null;
    this.isDronePlaying = false;
    this.isRainPlaying = false;
    this.droneOscillators = [];
    this.rainNode = null;
    this.currentUtterance = null;
    
    // Studio Audio Track Player
    this.audioElement = null;
    this.isTrackPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // =========================================================================
  // 1. STUDIO AUDIO TRACK PLAYER (Real Human Chants & Recordings)
  // =========================================================================
  playTrack(url, options = {}) {
    this.init();
    this.stopTrack();

    try {
      this.audioElement = new Audio(url);
      this.audioElement.volume = options.volume !== undefined ? options.volume : 0.85;
      this.audioElement.loop = options.loop || false;

      if (options.onTimeUpdate) {
        this.audioElement.ontimeupdate = () => {
          options.onTimeUpdate(this.audioElement.currentTime, this.audioElement.duration || 0);
        };
      }

      if (options.onEnded) {
        this.audioElement.onended = () => {
          this.isTrackPlaying = false;
          options.onEnded();
        };
      }

      if (options.onError) {
        this.audioElement.onerror = (e) => {
          console.warn("Studio track playback error, falling back:", e);
          this.isTrackPlaying = false;
          options.onError(e);
        };
      }

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isTrackPlaying = true;
          })
          .catch((err) => {
            console.warn("Audio autoplay policy or decode error:", err);
            this.isTrackPlaying = false;
            if (options.onError) options.onError(err);
          });
      }
    } catch (e) {
      console.warn("Failed to initialize audio element:", e);
      if (options.onError) options.onError(e);
    }
  }

  pauseTrack() {
    if (this.audioElement && this.isTrackPlaying) {
      this.audioElement.pause();
      this.isTrackPlaying = false;
    }
  }

  resumeTrack() {
    if (this.audioElement && !this.isTrackPlaying) {
      this.audioElement.play().then(() => {
        this.isTrackPlaying = true;
      }).catch(e => console.warn("Failed to resume track:", e));
    }
  }

  stopTrack() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.ontimeupdate = null;
        this.audioElement.onended = null;
        this.audioElement.onerror = null;
      } catch (e) {}
      this.audioElement = null;
      this.isTrackPlaying = false;
    }
  }

  setTrackVolume(volume) {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  seekTrack(seconds) {
    if (this.audioElement) {
      this.audioElement.currentTime = seconds;
    }
  }

  // =========================================================================
  // 2. CHURCH BELL SYNTHESIS (Additive Partials)
  // =========================================================================
  playBell(freq = 440) {
    this.init();
    const now = this.ctx.currentTime;
    
    const partials = [
      { ratio: 1.0, gain: 0.8, decay: 4.5 },
      { ratio: 2.0, gain: 0.5, decay: 3.2 },
      { ratio: 2.76, gain: 0.35, decay: 2.6 },
      { ratio: 4.07, gain: 0.25, decay: 1.8 },
      { ratio: 5.43, gain: 0.15, decay: 1.2 },
    ];

    partials.forEach(p => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p.ratio, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(p.gain * 0.4, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  }

  // =========================================================================
  // 3. CATHEDRAL AMBIENT DRONE (432Hz D-Minor Pipe Organ Resonance)
  // =========================================================================
  startCathedralDrone(volume = 0.4) {
    this.init();
    if (this.isDronePlaying) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(volume * 0.3, this.ctx.currentTime + 3);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // Warm sacred chord notes: D2, A2, D3, F3
    const chordFreqs = [73.42, 110.00, 146.83, 174.61];

    this.droneOscillators = chordFreqs.map((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime((idx - 1.5) * 5, this.ctx.currentTime);
      osc.connect(filter);
      return osc;
    });

    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);

    this.droneOscillators.forEach(osc => osc.start());
    this.isDronePlaying = true;
  }

  setDroneVolume(volume) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(volume * 0.3, this.ctx.currentTime + 0.1);
    }
  }

  stopCathedralDrone() {
    if (!this.isDronePlaying) return;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
      setTimeout(() => {
        this.droneOscillators.forEach(osc => {
          try { osc.stop(); } catch(e) {}
        });
        this.droneOscillators = [];
        this.isDronePlaying = false;
      }, 1600);
    }
  }

  // =========================================================================
  // 4. NIGHT RAIN SOUND GENERATOR (Filtered Pink Noise)
  // =========================================================================
  startRain(volume = 0.3) {
    this.init();
    if (this.isRainPlaying) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.rainGain.gain.linearRampToValueAtTime(volume * 0.25, this.ctx.currentTime + 2);

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);

    whiteNoise.start();
    this.rainNode = whiteNoise;
    this.isRainPlaying = true;
  }

  setRainVolume(volume) {
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.linearRampToValueAtTime(volume * 0.25, this.ctx.currentTime + 0.1);
    }
  }

  stopRain() {
    if (!this.isRainPlaying) return;
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        try { this.rainNode.stop(); } catch(e) {}
        this.rainNode = null;
        this.isRainPlaying = false;
      }, 1300);
    }
  }

  // =========================================================================
  // 5. ENHANCED CONTEMPLATIVE VOICE SYNTHESIS (Natural Voices & Reverent Tempo)
  // =========================================================================
  speakText(text, options = {}) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Contemplative sacred cadence: deliberate, unrushed (0.78 rate)
    utterance.rate = options.rate || 0.78; 
    
    // Deep, warm grounding pitch (0.90 pitch)
    utterance.pitch = options.pitch || 0.90; 
    utterance.volume = options.volume !== undefined ? options.volume : 0.95;

    // Prioritize natural, human-sounding neural voices
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Neural') ||
      v.name.includes('Google US English') ||
      v.name.includes('Google UK English Male') ||
      v.name.includes('Daniel') || 
      v.name.includes('Serena') ||
      v.name.includes('Samantha') ||
      v.name.includes('Oliver') ||
      v.name.includes('Alex')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    if (options.onBoundary) {
      utterance.onboundary = options.onBoundary;
    }
    if (options.onEnd) {
      utterance.onend = options.onEnd;
    }

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // =========================================================================
  // 6. GLOBAL STOP
  // =========================================================================
  stopAll() {
    this.stopTrack();
    this.stopCathedralDrone();
    this.stopRain();
    this.stopSpeech();
  }
}

export const soundEngine = new SoundEngine();
