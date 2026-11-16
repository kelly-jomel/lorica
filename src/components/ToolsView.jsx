import React, { useState, useEffect } from 'react';
import { Wind, CircleDot, Clock, Flame, Play, Pause, RotateCcw, Sparkles, Check, Heart, Shield } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function ToolsView() {
  const [activeTool, setActiveTool] = useState('breathwork'); // 'breathwork' | 'rosary' | 'timer' | 'forgiveness'

  // Tool 1: Breathwork state
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathPhase((prev) => {
          if (prev === 'Inhale') return 'Hold';
          if (prev === 'Hold') return 'Exhale';
          return 'Inhale';
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  // Tool 2: Rosary Bead Counter
  const [rosaryDecade, setRosaryDecade] = useState(1);
  const [rosaryBead, setRosaryBead] = useState(0); // 0 to 10

  const handleNextBead = () => {
    soundEngine.playBell(587.33); // D5 chime
    if (rosaryBead < 10) {
      setRosaryBead(rosaryBead + 1);
    } else {
      setRosaryBead(0);
      setRosaryDecade((d) => (d < 5 ? d + 1 : 1));
    }
  };

  // Tool 3: Ora et Labora Timer
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let t = null;
    if (isTimerRunning && timeLeft > 0) {
      t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      soundEngine.playBell(330); // E4 deep bell
      alert("Ora et Labora: Work session completed. Take 2 minutes in quiet prayer.");
    }
    return () => clearInterval(t);
  }, [isTimerRunning, timeLeft]);

  // Tool 4: Forgiveness Journal
  const [forgiveText, setForgiveText] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [isDissolved, setIsDissolved] = useState(false);

  const handleSurrender = () => {
    if (!forgiveText.trim()) return;
    setIsDissolving(true);
    soundEngine.playBell(440);
    setTimeout(() => {
      setForgiveText('');
      setIsDissolving(false);
      setIsDissolved(true);
      setTimeout(() => setIsDissolved(false), 4000);
    }, 1800);
  };

  return (
    <div className="space-y-5 pb-28 pt-2 max-w-xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl font-bold text-gold-200">Monastic Disciplines & Tools</h2>
        <p className="text-xs text-slate-400">Tactile spiritual practices adapted for daily modern life</p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-obsidian-900 border border-obsidian-800">
        {[
          { id: 'breathwork', label: 'Breathwork', icon: Wind },
          { id: 'rosary', label: 'Tap Rosary', icon: CircleDot },
          { id: 'timer', label: 'Work Timer', icon: Clock },
          { id: 'forgiveness', label: 'Unburden', icon: Flame },
        ].map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                soundEngine.init();
                setActiveTool(tool.id);
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs transition ${
                isActive
                  ? 'bg-gold-500/20 text-gold-300 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-[11px] truncate">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: Scripture Breathwork */}
      {activeTool === 'breathwork' && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-gold-500/30 flex flex-col items-center text-center shadow-xl space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase text-gold-400 tracking-wider">
              Vagus Nerve Spiritual Reset
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-100">Jesus Breath Prayer</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Slow your heart rate and ground your mind in God's peace.
            </p>
          </div>

          {/* Animated Halo Breathing Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full border border-gold-500/40 transition-all duration-[4000ms] ease-in-out ${
                isBreathing && breathPhase === 'Inhale'
                  ? 'scale-125 bg-gold-500/20 shadow-[0_0_40px_rgba(212,175,55,0.4)]'
                  : isBreathing && breathPhase === 'Hold'
                  ? 'scale-125 bg-amber-500/25 shadow-[0_0_50px_rgba(255,158,64,0.5)]'
                  : 'scale-90 bg-obsidian-950/80 shadow-none'
              }`}
            />
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-sm font-mono uppercase font-bold text-gold-300 tracking-widest">
                {isBreathing ? breathPhase : 'Ready'}
              </span>
              <p className="font-reading text-xs italic text-slate-200 mt-2 px-4 max-w-[150px]">
                {breathPhase === 'Inhale' && '"Lord Jesus Christ..."'}
                {breathPhase === 'Hold' && '"...Son of God..."'}
                {breathPhase === 'Exhale' && '"...have mercy on me."'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.init();
              setIsBreathing(!isBreathing);
            }}
            className="px-6 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:brightness-110 active:scale-95 transition shadow-lg"
          >
            {isBreathing ? 'Pause Breath' : 'Begin Breathwork'}
          </button>
        </div>
      )}

      {/* TOOL 2: Haptic / Tap Rosary Counter */}
      {activeTool === 'rosary' && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-gold-500/30 flex flex-col items-center text-center shadow-xl space-y-5">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 border-b border-obsidian-800 pb-2">
            <span className="font-mono text-gold-400">Decade {rosaryDecade} of 5</span>
            <span className="text-slate-300">Sorrowful Mysteries</span>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold text-gold-100">
              The First Mystery: Agony in the Garden
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Fruit of the Mystery: Sorrow for Sin & Conformity to God's Will
            </p>
          </div>

          {/* 10 Bead Progress Visualizer */}
          <div className="flex items-center justify-center gap-1.5 w-full">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${
                  idx < rosaryBead
                    ? 'bg-gold-500 text-obsidian-950 font-bold shadow-[0_0_8px_#D4AF37]'
                    : idx === rosaryBead
                    ? 'border-2 border-gold-400 bg-gold-500/20 text-gold-300 animate-pulse'
                    : 'bg-obsidian-950 border border-obsidian-750 text-slate-600'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Big Bead Tap Button */}
          <div className="pt-2">
            <button
              onClick={handleNextBead}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 flex flex-col items-center justify-center text-obsidian-950 shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95 transition"
            >
              <span className="font-serif font-black text-xl">{rosaryBead}/10</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Tap Bead</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            {rosaryBead === 0
              ? 'Begin decade with an Our Father'
              : rosaryBead === 10
              ? 'Complete with Glory Be & Fatima Prayer'
              : 'Hail Mary, full of grace, the Lord is with thee...'}
          </p>
        </div>
      )}

      {/* TOOL 3: Ora et Labora Pomodoro Timer */}
      {activeTool === 'timer' && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-gold-500/30 flex flex-col items-center text-center shadow-xl space-y-5">
          <div>
            <span className="text-[10px] font-mono uppercase text-gold-400 tracking-wider">
              Rule of St. Benedict
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-100">Ora et Labora Work Block</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Sanctify your daily work. 25 minutes of focus punctuated by a resonant abbey bell and sacred pause.
            </p>
          </div>

          {/* Timer Clock */}
          <div className="font-mono text-5xl font-bold text-gold-300 tracking-wider my-2">
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.init();
                setIsTimerRunning(!isTimerRunning);
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:brightness-110 active:scale-95 transition shadow-lg"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimeLeft(25 * 60);
              }}
              className="p-2.5 rounded-xl bg-obsidian-950 border border-obsidian-750 text-slate-400 hover:text-slate-200 transition"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TOOL 4: The Unburdening Forgiveness Journal */}
      {activeTool === 'forgiveness' && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-red-500/30 flex flex-col items-center text-center shadow-xl space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-red-400 tracking-wider">
              Ephemeral Surrender Ritual
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-100">The Unburdening Altar</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Write out grievances, wounds, or resentment. When you tap "Surrender to the Cross", the words dissolve forever into rising smoke. Zero data is stored.
            </p>
          </div>

          <div className="w-full relative">
            <textarea
              rows={4}
              placeholder="Lord, I hold anger against... I surrender this debt and release them to Your mercy..."
              value={forgiveText}
              disabled={isDissolving}
              onChange={(e) => setForgiveText(e.target.value)}
              className={`w-full p-4 rounded-2xl bg-obsidian-950 border border-obsidian-750 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 resize-none font-reading transition-all duration-1000 ${
                isDissolving ? 'opacity-0 scale-95 blur-md' : 'opacity-100'
              }`}
            />
            {isDissolving && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs text-gold-300 font-serif italic animate-pulse">
                  Surrendered to the Cross...
                </span>
              </div>
            )}
          </div>

          {isDissolved && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Your prayer has been released. Peace be upon your heart.</span>
            </div>
          )}

          <button
            onClick={handleSurrender}
            disabled={!forgiveText.trim() || isDissolving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-900 to-amber-900 text-gold-200 font-bold text-xs border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:brightness-110 disabled:opacity-40 active:scale-98 transition flex items-center justify-center gap-2"
          >
            <Flame className="w-4 h-4 text-candle-flame" />
            <span>Surrender to the Cross</span>
          </button>
        </div>
      )}
    </div>
  );
}
