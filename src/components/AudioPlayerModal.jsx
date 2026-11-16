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
  ChevronDown 
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function AudioPlayerModal({ prayer, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(prayer?.loopRecommended || false);
  const [showMixer, setShowMixer] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(null); // in minutes
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null);

  // Mixer volume states
  const [voiceVol, setVoiceVol] = useState(0.9);
  const [droneVol, setDroneVol] = useState(0.4);
  const [rainVol, setRainVol] = useState(0.2);

  const verses = prayer?.verses || [];
  const verseTimeoutRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Start prayer recitation
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

    soundEngine.speakText(current.text, {
      volume: voiceVol,
      rate: 0.88,
      onEnd: () => {
        if (isPlaying) {
          playVerse(index + 1);
        }
      }
    });
  };

  const togglePlay = () => {
    soundEngine.init();

    if (isPlaying) {
      soundEngine.stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Start ambient sounds if volumes > 0
      if (droneVol > 0) soundEngine.startCathedralDrone(droneVol);
      if (rainVol > 0) soundEngine.startRain(rainVol);
      playVerse(activeVerseIndex);
    }
  };

  // Jump to specific verse
  const handleVerseClick = (index) => {
    soundEngine.init();
    setActiveVerseIndex(index);
    if (isPlaying) {
      soundEngine.stopSpeech();
      playVerse(index);
    }
  };

  // Mixer handlers
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
            // Stop playback
            setIsPlaying(false);
            soundEngine.stopSpeech();
            soundEngine.stopCathedralDrone();
            soundEngine.stopRain();
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
      soundEngine.stopSpeech();
      soundEngine.stopCathedralDrone();
      soundEngine.stopRain();
      clearTimeout(verseTimeoutRef.current);
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-obsidian-800/80">
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-obsidian-900 border border-obsidian-800 text-slate-300 hover:text-slate-100 transition"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase block">
            {prayer.category}
          </span>
          <h2 className="font-serif font-bold text-sm text-slate-100 truncate max-w-[220px]">
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
          title="Ambient Soundscape Mixer"
        >
          <Sliders className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area: Synchronized Read-Along Text */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 max-w-xl mx-auto w-full">
        {/* Sacred Art Iconography Header */}
        <div className="flex flex-col items-center text-center pb-4">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500/20 via-obsidian-850 to-obsidian-900 border border-gold-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.2)] mb-3">
            <Shield className="w-10 h-10 text-gold-400" />
            {isPlaying && (
              <span className="absolute inset-0 rounded-2xl border-2 border-gold-400/50 animate-ping pointer-events-none" />
            )}
          </div>
          <h3 className="font-serif text-lg font-bold text-gold-100">{prayer.title}</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">{prayer.description}</p>
        </div>

        {/* Synchronized Verses */}
        <div className="space-y-3 pt-2">
          {verses.map((verse, index) => {
            const isActive = index === activeVerseIndex;
            return (
              <div
                key={verse.id}
                onClick={() => handleVerseClick(index)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-transparent border-l-4 border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'hover:bg-obsidian-900/60 border-l-4 border-transparent text-slate-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-[10px] font-mono mt-1 ${isActive ? 'text-gold-400 font-bold' : 'text-slate-600'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className={`font-reading text-sm sm:text-base leading-relaxed ${
                    isActive ? 'text-gold-100 font-medium' : 'text-slate-300'
                  }`}>
                    {verse.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ambient Soundscape Mixer Overlay */}
      {showMixer && (
        <div className="mx-4 mb-2 p-4 rounded-2xl bg-obsidian-900/95 border border-gold-500/30 backdrop-blur-md shadow-2xl max-w-md mx-auto w-full animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-obsidian-800">
            <span className="text-xs font-semibold text-gold-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Dual-Stream Soundscape Mixer
            </span>
            <button onClick={() => setShowMixer(false)} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Voice Volume */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-gold-400" /> Prayer Narration</span>
                <span className="font-mono text-[11px] text-slate-400">{Math.round(voiceVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={voiceVol}
                onChange={(e) => setVoiceVol(parseFloat(e.target.value))}
                className="w-full accent-gold-500 h-1.5 bg-obsidian-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cathedral Ambient Drone */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1.5"><Church className="w-3.5 h-3.5 text-amber-400" /> Cathedral Reverberation (Drone)</span>
                <span className="font-mono text-[11px] text-slate-400">{Math.round(droneVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={droneVol}
                onChange={(e) => handleDroneVolChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-obsidian-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Night Rain Ambience */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1.5"><CloudRain className="w-3.5 h-3.5 text-blue-400" /> Night Sanctuary Rain</span>
                <span className="font-mono text-[11px] text-slate-400">{Math.round(rainVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={rainVol}
                onChange={(e) => handleRainVolChange(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-obsidian-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="bg-obsidian-900/90 border-t border-obsidian-800 px-6 py-4 max-w-xl mx-auto w-full">
        {/* Sleep Timer & Loop Controls */}
        <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
          {/* Loop Button */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
              isLooping 
                ? 'bg-gold-500/20 border-gold-500/50 text-gold-300' 
                : 'bg-obsidian-950 border-obsidian-800 hover:border-slate-700'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>All-Night Loop</span>
          </button>

          {/* Sleep Timer Preset Selector */}
          <div className="flex items-center gap-1.5">
            <Moon className="w-3.5 h-3.5 text-slate-400" />
            {[null, 15, 30, 60].map((m) => (
              <button
                key={m || 'off'}
                onClick={() => handleSetSleepTimer(m)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  sleepTimer === m 
                    ? 'bg-gold-400 text-obsidian-950 font-bold' 
                    : 'bg-obsidian-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {m ? `${m}m` : 'Off'}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Playback Bar */}
        <div className="flex items-center justify-around">
          {/* Rewind */}
          <button
            onClick={() => handleVerseClick(Math.max(0, activeVerseIndex - 1))}
            className="p-2.5 rounded-full bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white transition active:scale-95"
            title="Previous Verse"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Big Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-obsidian-950 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-obsidian-950" />
            ) : (
              <Play className="w-7 h-7 fill-obsidian-950 translate-x-0.5" />
            )}
          </button>

          {/* Fast Forward */}
          <button
            onClick={() => handleVerseClick(Math.min(verses.length - 1, activeVerseIndex + 1))}
            className="p-2.5 rounded-full bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 hover:text-white transition active:scale-95"
            title="Next Verse"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Waveform Animation when playing */}
        {isPlaying && (
          <div className="flex items-center justify-center gap-1 mt-3">
            {[4, 8, 14, 18, 12, 6, 16, 20, 10, 5, 12, 17, 8].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-gold-400/80 rounded-full animate-pulse"
                style={{
                  height: `${h}px`,
                  animationDelay: `${(i * 0.1).toFixed(1)}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
