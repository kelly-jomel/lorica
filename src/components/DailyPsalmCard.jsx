import React, { useState } from 'react';
import { BookOpen, Play, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock, Sparkles } from 'lucide-react';
import { DAILY_PSALMS, getTodayPsalm } from '../data/dailyPsalmsData';
import { soundEngine } from '../services/soundEngine';

export default function DailyPsalmCard({ onPlayPrayer, onOpenBible }) {
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay());
  const [isExpanded, setIsExpanded] = useState(false);

  const psalm = DAILY_PSALMS.find(p => p.dayIndex === currentDayIndex) || DAILY_PSALMS[1];
  const isToday = currentDayIndex === new Date().getDay();

  const handlePrevDay = () => {
    setCurrentDayIndex((prev) => (prev === 0 ? 6 : prev - 1));
  };

  const handleNextDay = () => {
    setCurrentDayIndex((prev) => (prev === 6 ? 0 : prev + 1));
  };

  const handlePlayPsalm = () => {
    soundEngine.init();
    soundEngine.playBell(440);
    onPlayPrayer({
      id: psalm.prayerId,
      title: psalm.title,
      category: "Daily Responsorial Psalm",
      duration: psalm.duration,
      description: `${psalm.dayName} Liturgical Psalm: ${psalm.antiphon}`,
      verses: psalm.verses
    });
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-gold-500/30 p-5 shadow-2xl">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar with Day Navigation */}
      <div className="relative z-10 flex items-center justify-between mb-3 border-b border-obsidian-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            Daily Responsorial Psalm
          </span>
          {isToday && (
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              Today
            </span>
          )}
        </div>

        {/* Day Switcher Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevDay}
            className="p-1 rounded-lg bg-obsidian-950 border border-obsidian-800 text-slate-400 hover:text-gold-300 transition"
            title="Previous Day"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-semibold text-slate-200 px-1 font-mono min-w-[70px] text-center">
            {psalm.dayName}
          </span>
          <button
            onClick={handleNextDay}
            className="p-1 rounded-lg bg-obsidian-950 border border-obsidian-800 text-slate-400 hover:text-gold-300 transition"
            title="Next Day"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Psalm Content */}
      <div className="relative z-10 space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-slate-100">
              {psalm.psalmNum}
            </h3>
            <span className="text-[10px] font-mono text-gold-400/80">
              {psalm.liturgicalTag}
            </span>
          </div>

          {/* Responsorial Antiphon Banner */}
          <div className="mt-2.5 p-3 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-left">
            <span className="text-[9px] font-mono uppercase text-gold-400 tracking-wider block mb-0.5">
              Responsorial Refrain (Antiphon):
            </span>
            <p className="font-reading italic text-sm text-gold-200 font-medium leading-relaxed">
              "{psalm.antiphon}"
            </p>
          </div>
        </div>

        {/* Reflection */}
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {psalm.reflection}
        </p>

        {/* Expandable Verses View */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-obsidian-800/80 space-y-2 animate-in fade-in duration-200">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Full Scripture Strophes (Douay-Rheims):
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {psalm.verses.map((v) => (
                <p key={v.id} className="font-reading text-xs text-slate-200 leading-relaxed">
                  {v.text}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
            >
              <span>{isExpanded ? 'Hide' : 'Strophes'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {onOpenBible && (
              <button
                onClick={onOpenBible}
                className="text-gold-400/90 hover:text-gold-200 flex items-center gap-1 font-medium"
                title="Read in Catholic Bible Reader"
              >
                <BookOpen className="w-3 h-3" />
                <span>Bible</span>
              </button>
            )}
          </div>

          <button
            onClick={handlePlayPsalm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition"
          >
            <Play className="w-3.5 h-3.5 fill-obsidian-950" />
            <span>Pray Psalm ({psalm.duration})</span>
          </button>
        </div>
      </div>
    </section>
  );
}
