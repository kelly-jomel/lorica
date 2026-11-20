import React, { useState } from 'react';
import { Flame, Play, CheckCircle2, ChevronRight, ArrowLeft, Calendar, Shield, Sparkles, BookOpen, Clock } from 'lucide-react';
import { NOVENAS_DATA } from '../data/novenasData';
import { soundEngine } from '../services/soundEngine';

export default function NovenasPortal({ onBack, onPlayAudio }) {
  const [selectedNovena, setSelectedNovena] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [completedDays, setCompletedDays] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('All');

  const groups = ['All', 'Jesus & Trinity', 'Marian', 'Saints', 'Seasonal & Special'];

  const filteredNovenas = NOVENAS_DATA.filter((novena) => {
    return selectedGroup === 'All' || novena.group === selectedGroup;
  });

  const handleNovenaSelect = (novena) => {
    setSelectedNovena(novena);
    setActiveDayIndex(0);
  };

  const handleToggleDayComplete = (novenaId, dayNum) => {
    soundEngine.playBell(523.25);
    setCompletedDays(prev => ({
      ...prev,
      [`${novenaId}-day-${dayNum}`]: !prev[`${novenaId}-day-${dayNum}`]
    }));
  };

  const handlePlayDayPrayer = (day) => {
    soundEngine.init();
    soundEngine.playBell(587.33);

    if (onPlayAudio) {
      onPlayAudio({
        id: `${selectedNovena.id}-day-${day.day}`,
        title: `${selectedNovena.title} — Day ${day.day}`,
        category: `9-Day Novena • ${selectedNovena.group}`,
        duration: day.duration || "18:45",
        description: `${day.title || `Day ${day.day}`} • ${day.intention || ''}`,
        narratorTrack: day.narratorTrack,
        narratorName: day.narratorName || selectedNovena.narratorName,
        audioTrack: "/audio/gregorian_chant_cathedral.ogg",
        chantName: "Novena Liturgical Choral",
        verses: [
          { id: 1, text: `${selectedNovena.title} — ${day.title}. In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.` },
          { id: 2, text: `Intention: ${day.intention}` },
          ...(day.scripture ? [{ id: 3, text: `Scripture: ${day.scripture}` }] : []),
          { id: 4, text: day.prayer },
          { id: 5, text: `${selectedNovena.closingPrayer || ''} ${selectedNovena.closingInvocation || 'Amen.'}` }
        ]
      });
    } else {
      soundEngine.speakText(`${day.title}. Intention: ${day.intention}. Scripture: ${day.scripture}. ${day.prayer}`);
    }
  };

  if (!selectedNovena) {
    return (
      <div className="space-y-5 pb-28 pt-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase">
                PRAY • 9-Day Journeys
              </span>
            </div>
            <h2 className="font-serif text-xl font-bold text-gold-200 flex items-center gap-2">
              <Flame className="w-5 h-5 text-candle-flame" />
              Catholic Novenas
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Traditional 9-day devotions of petition, deliverance, and feast-day preparation.
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs text-slate-400 hover:text-gold-300 flex items-center gap-1 p-1.5 rounded-lg bg-obsidian-900 border border-obsidian-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Biblical Origin Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/20 text-xs text-slate-300">
          <span className="font-semibold text-gold-300 block mb-1">
            Why 9 Days of Prayer?
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            The word novena comes from the Latin <em>novem</em> (nine). Its biblical foundation is the nine days of steadfast prayer by the Apostles and Mary in the Upper Room between the Ascension of Christ and the descent of the Holy Ghost at Pentecost (Acts 1:14).
          </p>
        </div>

        {/* Group Filter Tabs (Jesus & Trinity, Marian, Saints, Seasonal) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedGroup === grp
                  ? 'bg-gold-500/20 border border-gold-500/60 text-gold-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                  : 'bg-obsidian-900 border border-obsidian-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>

        {/* Novenas List */}
        <div className="space-y-3.5">
          {filteredNovenas.map((novena) => {
            const completedCount = Array.from({ length: 9 }).filter(
              (_, i) => completedDays[`${novena.id}-day-${i + 1}`]
            ).length;

            return (
              <div
                key={novena.id}
                onClick={() => handleNovenaSelect(novena)}
                className="group cursor-pointer p-4 rounded-2xl bg-obsidian-900/90 border border-obsidian-800 hover:border-gold-500/40 hover:bg-obsidian-850 transition-all shadow-xl active:scale-99"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-obsidian-950 border border-candle-glow/40 flex items-center justify-center text-candle-flame shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block">
                        {novena.category} • 9 Days
                      </span>
                      <h3 className="font-serif text-base font-bold text-slate-100 group-hover:text-gold-200 transition">
                        {novena.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {novena.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all shrink-0" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-obsidian-800/80">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" /> Feast: {novena.feastDate}
                  </span>
                  <span className="text-gold-300 font-mono">
                    {completedCount}/9 Days Complete
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Selected Novena: 9-Day Journey Player
  const currentDay = selectedNovena.days[activeDayIndex];
  const isCurrentDayDone = completedDays[`${selectedNovena.id}-day-${currentDay.day}`];

  return (
    <div className="space-y-5 pb-28 pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedNovena(null)}
          className="text-xs text-slate-400 hover:text-gold-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-obsidian-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Novenas</span>
        </button>
        <span className="text-[11px] font-mono text-gold-400 uppercase">
          Day {currentDay.day} of 9
        </span>
      </div>

      {/* Novena Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-gold-500/30">
        <h2 className="font-serif text-lg font-bold text-gold-100">{selectedNovena.title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{selectedNovena.subtitle}</p>
        
        {/* 9-Day Tracker Pills */}
        <div className="grid grid-cols-9 gap-1.5 mt-4">
          {selectedNovena.days.map((d, idx) => {
            const isDone = completedDays[`${selectedNovena.id}-day-${d.day}`];
            const isSelected = idx === activeDayIndex;
            return (
              <button
                key={d.day}
                onClick={() => setActiveDayIndex(idx)}
                className={`py-2 rounded-lg flex flex-col items-center justify-center text-xs font-mono transition-all ${
                  isSelected
                    ? 'border-2 border-gold-400 bg-gold-500/20 text-gold-200 font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                    : isDone
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-obsidian-950 border border-obsidian-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>{d.day}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Day Detail Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400">
            {currentDay.title}
          </span>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gold-400" /> {currentDay.duration}
          </span>
        </div>

        {/* Intention */}
        <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-gold-500/20">
          <span className="text-[10px] uppercase font-mono text-gold-400 block mb-1">
            Day {currentDay.day} Intention:
          </span>
          <p className="text-xs text-slate-200 font-medium">
            {currentDay.intention}
          </p>
        </div>

        {/* Scripture Anchor */}
        <div className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-800">
          <p className="font-reading italic text-xs text-slate-300">
            {currentDay.scripture}
          </p>
        </div>

        {/* Main Prayer Text */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">
            Day {currentDay.day} Prayer:
          </span>
          <p className="font-reading text-sm text-slate-100 leading-relaxed whitespace-pre-wrap">
            {currentDay.prayer}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => handlePlayDayPrayer(currentDay)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-obsidian-950" />
            <span>Listen & Pray</span>
          </button>

          <button
            onClick={() => handleToggleDayComplete(selectedNovena.id, currentDay.day)}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition active:scale-95 ${
              isCurrentDayDone
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                : 'bg-obsidian-800 border-obsidian-750 text-slate-200 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCurrentDayDone ? 'Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
