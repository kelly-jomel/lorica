import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Repeat, 
  Moon, 
  Volume2, 
  Sliders, 
  Sparkles, 
  Shield, 
  CloudRain, 
  Church, 
  ChevronDown,
  Music,
  Mic,
  VolumeX,
  Clock
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function AudioPlayerModal({ prayer, onClose }) {
  // Determine default audio track if available
  const defaultTrack = prayer?.audioTrack || "/audio/gregorian_chant_cathedral.ogg";
  const [audioMode, setAudioMode] = useState(prayer?.narratorTrack ? 'contemplative' : (prayer?.audioTrack ? 'chant' : 'contemplative')); // 'chant' | 'contemplative' | 'ambient'
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(prayer?.loopRecommended || false);
  const [showMixer, setShowMixer] = useState(false);
  
  // Track playback time
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sleep timer
  const [sleepTimer, setSleepTimer] = useState(null); // in minutes
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null);

  // Mixer volume states
  const [mainVol, setMainVol] = useState(0.85);
  const [droneVol, setDroneVol] = useState(0.35);
  const [rainVol, setRainVol] = useState(0.20);

  const verses = prayer?.verses || [];
  const timerIntervalRef = useRef(null);
  const ambientIntervalRef = useRef(null);

  // Format mm:ss
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // =========================================================================
  // PLAYBACK LOGIC BY MODE
  // =========================================================================

  const startPlayback = (modeToUse = audioMode, verseIdx = activeVerseIndex) => {
    soundEngine.init();

    // Start background atmospheric layers if volume > 0
    if (droneVol > 0) soundEngine.startCathedralDrone(droneVol);
    if (rainVol > 0) soundEngine.startRain(rainVol);

    if (modeToUse === 'chant') {
      // 1. MONASTIC CHORAL AUDIO TRACK
      soundEngine.stopSpeech();
      soundEngine.playTrack(defaultTrack, {
        volume: mainVol,
        loop: isLooping,
        onTimeUpdate: (cur, dur) => {
          setCurrentTime(cur);
          setDuration(dur);
          
          // Map track progress to verse highlight
          if (dur > 0 && verses.length > 0) {
            const verseDuration = dur / verses.length;
            const newIndex = Math.min(Math.floor(cur / verseDuration), verses.length - 1);
            setActiveVerseIndex(newIndex);
          }
        },
        onEnded: () => {
          if (!isLooping) {
            setIsPlaying(false);
          }
        },
        onError: () => {
          // If track fails to load, gracefully fall back to contemplative voice
          setAudioMode('contemplative');
          playVerse(0);
        }
      });
    } else if (modeToUse === 'contemplative') {
      // 2. CONTEMPLATIVE WARM HUMAN VOICE NARRATION (ElevenLabs Studio Voice or Speech fallback)
      soundEngine.stopSpeech();
      soundEngine.stopTrack();

      if (prayer?.narratorTrack) {
        soundEngine.playTrack(prayer.narratorTrack, {
          volume: mainVol,
          loop: isLooping,
          onTimeUpdate: (cur, dur) => {
            setCurrentTime(cur);
            setDuration(dur);
            
            // Map track progress to verse highlight
            if (dur > 0 && verses.length > 0) {
              const verseDuration = dur / verses.length;
              const newIndex = Math.min(Math.floor(cur / verseDuration), verses.length - 1);
              setActiveVerseIndex(newIndex);
            }
          },
          onEnded: () => {
            if (!isLooping) {
              setIsPlaying(false);
            }
          },
          onError: () => {
            playVerse(verseIdx);
          }
        });
      } else {
        playVerse(verseIdx);
      }
    } else if (modeToUse === 'ambient') {
      // 3. SILENT AMBIENT MEDITATION (Cathedral Drone + Rain only)
      soundEngine.stopTrack();
      soundEngine.stopSpeech();
      
      // Auto-advance verse every 12 seconds in silent meditation mode
      clearInterval(ambientIntervalRef.current);
      ambientIntervalRef.current = setInterval(() => {
        setActiveVerseIndex(prev => {
          const next = prev + 1;
          if (next >= verses.length) {
            if (isLooping) return 0;
            setIsPlaying(false);
            clearInterval(ambientIntervalRef.current);
            return prev;
          }
          soundEngine.playBell(587.33); // soft chime on advance
          return next;
        });
      }, 12000);
    }
  };

  const playVerse = (index) => {
    if (!verses[index]) {
      if (isLooping) {
        setActiveVerseIndex(0);
        playVerse(0);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    setActiveVerseIndex(index);
    const current = verses[index];

    // Soft chime between strophes
    if (index > 0) {
      soundEngine.playBell(587.33);
    }

    soundEngine.speakText(current.text, {
      volume: mainVol,
      rate: 0.78, // slow, contemplative tempo
      pitch: 0.90, // warm, deeper reverent pitch
      onEnd: () => {
        if (isPlaying && audioMode === 'contemplative') {
          setTimeout(() => {
            playVerse(index + 1);
          }, 1200); // 1.2s reverent breath pause
        }
      }
    });
  };

  const togglePlay = () => {
    soundEngine.init();

    if (isPlaying) {
      soundEngine.stopSpeech();
      soundEngine.pauseTrack();
      clearInterval(ambientIntervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startPlayback(audioMode, activeVerseIndex);
    }
  };

  // Switch between Monastic Choir, Contemplative Voice, and Ambient
  const handleModeChange = (newMode) => {
    setAudioMode(newMode);
    soundEngine.init();
    soundEngine.playBell(523.25); // C5 chime

    if (isPlaying) {
      soundEngine.stopAll();
      clearInterval(ambientIntervalRef.current);
      startPlayback(newMode, activeVerseIndex);
    }
  };

  // Jump to specific verse
  const handleVerseClick = (index) => {
    soundEngine.init();
    setActiveVerseIndex(index);
    if ((audioMode === 'chant' || (audioMode === 'contemplative' && prayer?.narratorTrack)) && duration > 0 && verses.length > 0) {
      const targetTime = (index / verses.length) * duration;
      soundEngine.seekTrack(targetTime);
      setCurrentTime(targetTime);
    } else if (isPlaying && audioMode === 'contemplative') {
      soundEngine.stopSpeech();
      playVerse(index);
    }
  };

  // Mixer handlers
  const handleMainVolChange = (val) => {
    setMainVol(val);
    soundEngine.setTrackVolume(val);
  };

  const handleDroneVolChange = (val) => {
    setDroneVol(val);
    if (val > 0) {
      soundEngine.startCathedralDrone(val);
      soundEngine.setDroneVolume(val);
    } else {
      soundEngine.stopCathedralDrone();
    }
  };

  const handleRainVolChange = (val) => {
    setRainVol(val);
    if (val > 0) {
      soundEngine.startRain(val);
      soundEngine.setRainVolume(val);
    } else {
      soundEngine.stopRain();
    }
  };

  // Sleep timer logic
  const handleSetSleepTimer = (minutes) => {
    setSleepTimer(minutes);
    setSleepTimerRemaining(minutes ? minutes * 60 : null);
  };

  useEffect(() => {
    if (sleepTimerRemaining !== null && sleepTimerRemaining > 0 && isPlaying) {
      timerIntervalRef.current = setInterval(() => {
        setSleepTimerRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            soundEngine.stopAll();
            clearInterval(timerIntervalRef.current);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [sleepTimerRemaining, isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopAll();
      clearInterval(timerIntervalRef.current);
      clearInterval(ambientIntervalRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/95 backdrop-blur-2xl flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      
      {/* 1. TOP HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-800/80 shrink-0">
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-obsidian-900 border border-obsidian-800 text-slate-300 hover:text-slate-100 transition active:scale-95"
          title="Minimize player"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase block">
            {prayer.category}
          </span>
          <h2 className="font-serif font-bold text-base text-slate-100 max-w-[240px] sm:max-w-md truncate">
            {prayer.title}
          </h2>
        </div>

        <button
          onClick={() => setShowMixer(!showMixer)}
          className={`p-2 rounded-xl border transition ${
            showMixer 
              ? 'bg-gold-500/20 border-gold-500/60 text-gold-300' 
              : 'bg-obsidian-900 border-obsidian-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Acoustic Sound Mixer"
        >
          <Sliders className="w-5 h-5" />
        </button>
      </div>

      {/* 2. AUDIO MODE SELECTOR (Monastic Choir vs Contemplative Voice vs Ambient) */}
      <div className="px-6 pt-3 shrink-0 flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-obsidian-900 border border-obsidian-800 shadow-lg">
          <button
            onClick={() => handleModeChange('chant')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              audioMode === 'chant'
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Monastic Choir</span>
          </button>

          <button
            onClick={() => handleModeChange('contemplative')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              audioMode === 'contemplative'
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Contemplative Voice</span>
          </button>

          <button
            onClick={() => handleModeChange('ambient')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              audioMode === 'ambient'
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Silent Sleep Ambient</span>
          </button>
        </div>
      </div>

      {/* Audio Mode Subtitle Tag */}
      <div className="text-center pt-1 shrink-0">
        <span className="text-[11px] font-mono text-gold-400/90">
          {audioMode === 'chant' && (prayer?.chantName || "Authentic Monastic Schola Gregoriana • Real Human Recording")}
          {audioMode === 'contemplative' && (prayer?.narratorName ? `Studio Narration by ${prayer.narratorName}` : "Warm Reverent Human Cadence • Cathedral Acoustic Reverb")}
          {audioMode === 'ambient' && "432Hz Sacred Organ Drone & Soft Rain • Silent Contemplation"}
        </span>
      </div>

      {/* 3. SCROLLABLE SYNCHRONIZED VERSES */}
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full space-y-4">
        {verses.map((verse, index) => {
          const isActive = index === activeVerseIndex;
          return (
            <div
              key={verse.id || index}
              onClick={() => handleVerseClick(index)}
              className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 relative border ${
                isActive
                  ? 'bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-transparent border-gold-500/40 shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-[1.01]'
                  : 'bg-obsidian-900/40 border-obsidian-850 hover:border-obsidian-750 opacity-60 hover:opacity-90'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`text-xs font-mono font-bold mt-0.5 shrink-0 ${isActive ? 'text-gold-400' : 'text-slate-500'}`}>
                  {index + 1}
                </span>
                <p className={`font-reading text-sm sm:text-base leading-relaxed tracking-wide ${
                  isActive ? 'text-gold-100 font-medium' : 'text-slate-300'
                }`}>
                  {verse.text}
                </p>
              </div>

              {isActive && isPlaying && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse delay-150" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. SOUND MIXER DRAWER (Cathedral Reverb & Rain Layer) */}
      {showMixer && (
        <div className="px-6 py-4 bg-obsidian-900 border-t border-obsidian-800 animate-in slide-in-from-bottom duration-200 space-y-3 max-w-md mx-auto w-full rounded-t-3xl shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-gold-400" /> Acoustic Mixer
            </span>
            <button onClick={() => setShowMixer(false)} className="text-xs text-slate-400 hover:text-slate-200">
              Done
            </button>
          </div>

          {/* Main Track Volume */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-gold-400" />
                {audioMode === 'chant' ? "Monastic Choral Volume" : "Voice Recitation"}
              </span>
              <span className="font-mono text-slate-400">{Math.round(mainVol * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05"
              value={mainVol}
              onChange={(e) => handleMainVolChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
          </div>

          {/* Cathedral Drone */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Church className="w-3.5 h-3.5 text-gold-400" /> Cathedral Organ Resonance
              </span>
              <span className="font-mono text-slate-400">{Math.round(droneVol * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05"
              value={droneVol}
              onChange={(e) => handleDroneVolChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
          </div>

          {/* Night Rain */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Gentle Night Rain
              </span>
              <span className="font-mono text-slate-400">{Math.round(rainVol * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.05"
              value={rainVol}
              onChange={(e) => handleRainVolChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
          </div>
        </div>
      )}

      {/* 5. PLAYER CONTROLS FOOTER */}
      <div className="px-6 py-5 border-t border-obsidian-800/80 bg-obsidian-950/90 max-w-xl mx-auto w-full space-y-4 shrink-0">
        
        {/* Track Scrubbing Bar (In Choral Mode) */}
        {audioMode === 'chant' && duration > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input 
              type="range" min="0" max={duration || 100} step="0.5"
              value={currentTime}
              onChange={(e) => {
                const newT = parseFloat(e.target.value);
                setCurrentTime(newT);
                soundEngine.seekTrack(newT);
              }}
              className="w-full h-1.5 bg-obsidian-850 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
          </div>
        )}

        {/* Main Buttons */}
        <div className="flex items-center justify-between">
          {/* Continuous Loop Switch */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2.5 rounded-xl border transition ${
              isLooping 
                ? 'bg-gold-500/20 border-gold-500/60 text-gold-300' 
                : 'bg-obsidian-900 border-obsidian-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Loop All Night (Continuous Spiritual Shield)"
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Previous Verse */}
          <button
            onClick={() => handleVerseClick(Math.max(0, activeVerseIndex - 1))}
            disabled={activeVerseIndex === 0}
            className="p-2.5 text-slate-400 hover:text-slate-100 disabled:opacity-20 transition"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Primary Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-obsidian-950" />
            ) : (
              <Play className="w-6 h-6 fill-obsidian-950 translate-x-0.5" />
            )}
          </button>

          {/* Next Verse */}
          <button
            onClick={() => handleVerseClick(Math.min(verses.length - 1, activeVerseIndex + 1))}
            disabled={activeVerseIndex >= verses.length - 1}
            className="p-2.5 text-slate-400 hover:text-slate-100 disabled:opacity-20 transition"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          {/* Sleep Timer Preset Selector */}
          <div className="relative">
            <button
              onClick={() => {
                if (sleepTimer === null) handleSetSleepTimer(15);
                else if (sleepTimer === 15) handleSetSleepTimer(30);
                else if (sleepTimer === 30) handleSetSleepTimer(60);
                else handleSetSleepTimer(null);
              }}
              className={`p-2.5 rounded-xl border text-xs font-mono transition flex items-center gap-1 ${
                sleepTimer 
                  ? 'bg-gold-500/20 border-gold-500/60 text-gold-300 font-bold' 
                  : 'bg-obsidian-900 border-obsidian-800 text-slate-500 hover:text-slate-300'
              }`}
              title="Sleep Timer (15m, 30m, 60m)"
            >
              <Moon className="w-4 h-4" />
              {sleepTimer && <span>{sleepTimer}m</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
