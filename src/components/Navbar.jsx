import React from 'react';
import { Shield, Smartphone, Monitor, Sparkles, Volume2, Bell, Heart, Calendar, Globe, BookOpen } from 'lucide-react';

export default function Navbar({ isPhoneMockup, setIsPhoneMockup, onOpenSOS, onOpenBenefactor, onOpenCalendar, onSwitchToWebsite, onOpenBible }) {
  return (
    <header className="sticky top-0 z-40 bg-obsidian-950/80 backdrop-blur-md border-b border-obsidian-700/60 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img 
          src="/logo.jpg" 
          alt="Lorica Logo" 
          className="w-9 h-9 rounded-xl object-contain border border-gold-500/40 shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-obsidian-900"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base tracking-wide text-gold-200">Lorica</span>
            <button
              onClick={onOpenBenefactor}
              className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-300 font-mono font-semibold hover:bg-gold-500/25 transition flex items-center gap-1 cursor-pointer"
              title="Keep Lorica 100% Free - Benefactor Covenant"
            >
              <Heart className="w-2.5 h-2.5 text-red-400 fill-current" />
              <span>Pay It Forward</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 font-sans flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            Liturgical Vigil • St. Michael Season
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Catholic Bible Reader Quick Trigger */}
        <button
          onClick={onOpenBible}
          className="p-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition active:scale-95"
          title="The Holy Roman Catholic Bible (73 Books)"
        >
          <BookOpen className="w-4 h-4 text-gold-400" />
        </button>

        {/* Switch to Website Button */}
        {onSwitchToWebsite && (
          <button
            onClick={onSwitchToWebsite}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition active:scale-95"
            title="Switch to Lorica Public Website"
          >
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Website</span>
          </button>
        )}

        {/* Liturgical Calendar Quick Trigger */}
        <button
          onClick={onOpenCalendar}
          className="p-1.5 rounded-lg bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition active:scale-95"
          title="Catholic Liturgical Calendar"
        >
          <Calendar className="w-4 h-4 text-gold-400" />
        </button>

        {/* SOS Spiritual Shield Quick Trigger */}
        <button
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-red-950/60 border border-red-500/50 text-red-300 hover:bg-red-900/60 transition shadow-[0_0_12px_rgba(239,68,68,0.2)] active:scale-95"
          title="Instant Spiritual Shield - Psalm 91"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          SOS Shield
        </button>

        {/* Mockup Frame Toggle */}
        <button
          onClick={() => setIsPhoneMockup(!isPhoneMockup)}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition"
          title="Toggle Phone Bezel / Full Width View"
        >
          {isPhoneMockup ? (
            <>
              <Monitor className="w-3.5 h-3.5" />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone Frame</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
