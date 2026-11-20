import React from 'react';
import { Sparkles, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { CALENDAR_MONTHS, LITURGICAL_COLORS } from '../data/liturgicalCalendarData';

export default function DailyLiturgicalBanner({ onOpenCalendar }) {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const monthIdx = now.getMonth();

  // Find month data (defaults to November if within Nov 2026 or current)
  const monthData = CALENDAR_MONTHS.find(m => m.monthIndex === monthIdx) || CALENDAR_MONTHS[0];
  const todayFeast = monthData?.feasts?.[dayOfMonth];
  const seasonColorKey = todayFeast?.color || monthData?.seasonColor || 'green';
  const colorInfo = LITURGICAL_COLORS[seasonColorKey] || LITURGICAL_COLORS.green;

  return (
    <aside aria-label="Daily Liturgical Feast" className="w-full bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 border-b border-obsidian-800/80 px-4 sm:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        
        {/* Left: Liturgical Date & Season */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span 
            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: colorInfo.hex, color: colorInfo.hex }}
            title={`Liturgical Vestment: ${colorInfo.name}`}
          />
          <span className="font-mono text-[11px] text-slate-400">
            {monthData.name} {dayOfMonth}, {now.getFullYear()}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-obsidian-900 border border-obsidian-800 text-gold-300/90 font-medium">
            {monthData.liturgicalSeason}
          </span>
        </div>

        {/* Center / Right: Today's Feast Day */}
        <div className="flex items-center gap-3">
          {todayFeast ? (
            <div className="flex items-center gap-2 text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="font-serif font-bold text-gold-200">
                {todayFeast.rank}: {todayFeast.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-serif font-medium text-slate-300">
                Feria (Weekday in Ordinary Time) • Continuous Catholic Devotion
              </span>
            </div>
          )}

          <button
            onClick={onOpenCalendar}
            className="flex items-center gap-1 text-[11px] font-mono text-gold-400 hover:text-gold-200 font-semibold transition ml-1"
          >
            <span>Calendar</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </aside>
  );
}
