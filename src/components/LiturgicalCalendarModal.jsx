import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Sparkles, Flame, Shield, Play, Info } from 'lucide-react';
import { CALENDAR_MONTHS, LITURGICAL_COLORS } from '../data/liturgicalCalendarData';
import { soundEngine } from '../services/soundEngine';
import { getActiveNovena } from '../utils/calendarExport';

export default function LiturgicalCalendarModal({ isOpen, onClose, onPlayPrayer }) {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(10); // 10 = November 2026
  const [selectedDay, setSelectedDay] = useState(16); // Default to today (Nov 16)
  const activeNovena = getActiveNovena();

  if (!isOpen) return null;

  const monthData = CALENDAR_MONTHS.find(m => m.monthIndex === currentMonthIdx) || CALENDAR_MONTHS[0];
  const feast = monthData.feasts[selectedDay];

  const handlePrevMonth = () => {
    if (currentMonthIdx === 11) {
      setCurrentMonthIdx(10);
      setSelectedDay(1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIdx === 10) {
      setCurrentMonthIdx(11);
      setSelectedDay(1);
    }
  };

  const handleSelectDay = (day) => {
    soundEngine.playBell(587.33); // D5 soft chime
    setSelectedDay(day);
  };

  const handlePlayFeastPrayer = () => {
    soundEngine.init();
    soundEngine.playBell(440);
    onPlayPrayer({
      id: `feast-${monthData.name}-${selectedDay}`,
      title: feast ? feast.name : `Day ${selectedDay} of ${monthData.name}`,
      category: feast?.rank || "Daily Liturgical Office",
      duration: "3:30",
      description: feast?.desc || "Sacred liturgy and daily Catholic devotion.",
      verses: [
        { id: 1, text: `${feast ? feast.name : `Daily Devotion of ${monthData.name} ${selectedDay}`}. Liturgical Color: ${feast ? feast.color : 'Green'}.` },
        { id: 2, text: feast?.desc || "O God, who gladden us with the annual commemoration of Thy holy saints, grant us by their intercession to walk faithfully in Thy commandments." },
        { id: 3, text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen." }
      ]
    });
  };

  // Generate blank leading days
  const leadingBlanks = Array.from({ length: monthData.startDayOfWeek });
  const daysArray = Array.from({ length: monthData.daysInMonth }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-gold-500/40 p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-full bg-obsidian-900 border border-obsidian-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-gold-100">Catholic Liturgical Calendar</h2>
            <p className="text-xs text-slate-400">{monthData.liturgicalSeason}</p>
          </div>
        </div>

        {/* Active Novena In Progress Banner */}
        {activeNovena && (
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-transparent border border-gold-500/40 flex items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 text-candle-flame" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block font-bold">
                  ACTIVE NOVENA IN PROGRESS
                </span>
                <h4 className="font-serif text-xs font-bold text-slate-100">
                  {activeNovena.title} • Day {activeNovena.currentDay || 1} of 9
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                <span
                  key={d}
                  className={`w-2 h-2 rounded-full ${
                    d <= (activeNovena.currentDay || 1) ? 'bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'bg-obsidian-800'
                  }`}
                  title={`Day ${d}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Month Navigation Bar */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-obsidian-950 border border-obsidian-800 mb-4">
          <button
            onClick={handlePrevMonth}
            disabled={currentMonthIdx === 10}
            className="p-1.5 rounded-xl bg-obsidian-900 text-slate-300 hover:text-gold-300 disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <h3 className="font-serif font-bold text-sm text-gold-200">
              {monthData.name} {monthData.year}
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Liturgical Season: {monthData.seasonColor.toUpperCase()}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            disabled={currentMonthIdx === 11}
            className="p-1.5 rounded-xl bg-obsidian-900 text-slate-300 hover:text-gold-300 disabled:opacity-30 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 mb-4">
          {leadingBlanks.map((_, i) => (
            <div key={`blank-${i}`} className="h-10 rounded-xl bg-transparent" />
          ))}

          {daysArray.map((day) => {
            const dayFeast = monthData.feasts[day];
            const isSelected = selectedDay === day;
            const isToday = currentMonthIdx === 10 && day === 16;

            // Determine liturgical dot color
            let dotColor = '#10B981'; // green default
            if (dayFeast?.color === 'white') dotColor = '#F59E0B'; // gold/white
            if (dayFeast?.color === 'red') dotColor = '#EF4444'; // red
            if (dayFeast?.color === 'purple') dotColor = '#8B5CF6'; // purple
            if (dayFeast?.color === 'rose') dotColor = '#F472B6'; // rose

            return (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`relative h-11 rounded-xl flex flex-col items-center justify-between p-1 text-xs font-mono transition-all ${
                  isSelected
                    ? 'border-2 border-gold-400 bg-gold-500/20 text-gold-200 font-bold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : isToday
                    ? 'border border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                    : dayFeast
                    ? 'bg-obsidian-950/80 border border-obsidian-800 text-slate-200 hover:border-slate-700'
                    : 'bg-obsidian-950/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{day}</span>
                <div className="flex items-center gap-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  {dayFeast?.holyDay && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Holy Day of Obligation" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Feast Card */}
        <div className="p-4 rounded-2xl bg-obsidian-950 border border-gold-500/30 space-y-3">
          <div className="flex items-center justify-between border-b border-obsidian-800 pb-2">
            <div>
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider block">
                {monthData.name} {selectedDay}, {monthData.year}
              </span>
              <h4 className="font-serif font-bold text-sm text-slate-100">
                {feast ? feast.name : "Feria of Ordinary Time"}
              </h4>
            </div>

            {feast && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                feast.color === 'white' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                feast.color === 'red' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                feast.color === 'purple' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {feast.rank}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {feast?.desc || "No major solemnity assigned. The daily office of Ordinary Time continues, offering daily duties to God."}
          </p>

          {feast?.holyDay && (
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Holy Day of Obligation • Mass Attendance Prescribed</span>
            </div>
          )}

          {feast?.novenaStart && (
            <div className="p-2 rounded-xl bg-candle-flame/10 border border-candle-flame/30 text-[11px] text-candle-amber flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 shrink-0" />
              <span>Novena Begins: {feast.novenaStart}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500 font-mono">
              Vestment: {feast ? feast.color.toUpperCase() : 'GREEN'}
            </span>
            <button
              onClick={handlePlayFeastPrayer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 text-obsidian-950 font-bold text-xs hover:brightness-110 active:scale-95 transition"
            >
              <Play className="w-3 h-3 fill-obsidian-950" />
              <span>Pray Day Office</span>
            </button>
          </div>
        </div>

        {/* Liturgical Colors Legend */}
        <div className="mt-4 pt-3 border-t border-obsidian-850 flex items-center justify-around text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Green (Ordinary)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> White/Gold (Feasts)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Red (Martyrs)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Violet (Advent)
          </span>
        </div>
      </div>
    </div>
  );
}
