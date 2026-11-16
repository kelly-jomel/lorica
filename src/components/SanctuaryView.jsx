import React from 'react';
import { 
  Play, 
  ShieldAlert, 
  Moon, 
  Sword, 
  HeartHandshake, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Compass,
  Volume2,
  Heart,
  Calendar
} from 'lucide-react';
import { CRISIS_CAROUSEL, PRAYERS_DATA } from '../data/prayersData';
import DailyPsalmCard from './DailyPsalmCard';

export default function SanctuaryView({ onPlayPrayer, setActiveTab, unreadCandlesCount = 5, onOpenBenefactor, onOpenCalendar }) {
  const featuredPrayer = PRAYERS_DATA.find(p => p.id === 'psalm-91');
  const warfarePrayer = PRAYERS_DATA.find(p => p.id === 'st-michael');

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Daily Responsorial Psalm Component */}
      <DailyPsalmCard onPlayPrayer={onPlayPrayer} />

      {/* "Need Reinforcements?" Emergency Crisis Carousel */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-candle-flame" />
              Need Reinforcements?
            </h2>
            <p className="text-xs text-slate-400">One-tap immediate refuge for difficult moments</p>
          </div>
          <span className="text-[11px] text-gold-400/80 font-mono">0-sec delay</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CRISIS_CAROUSEL.map((item) => {
            const prayer = PRAYERS_DATA.find(p => p.id === item.id);
            return (
              <button
                key={item.id}
                onClick={() => prayer && onPlayPrayer(prayer)}
                className={`flex flex-col items-start p-3.5 rounded-xl border ${item.color} hover:border-gold-400/60 hover:bg-obsidian-800 transition-all text-left group shadow-lg active:scale-98`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-8 h-8 rounded-lg bg-obsidian-900/80 border border-white/10 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                    {item.icon === 'Moon' && <Moon className="w-4 h-4" />}
                    {item.icon === 'Sword' && <Sword className="w-4 h-4" />}
                    {item.icon === 'HeartPulse' && <HeartHandshake className="w-4 h-4" />}
                    {item.icon === 'Flame' && <Flame className="w-4 h-4" />}
                  </div>
                  <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400 transition" />
                </div>
                <span className="text-xs font-semibold text-slate-100 group-hover:text-gold-300">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Primary Devotion: Psalm 91 */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/30 p-5 shadow-2xl">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
          <Sword className="w-48 h-48 text-gold-500" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-[11px] text-gold-400 font-medium">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Continuous Sleep Loop Available
            </div>
            <h3 className="font-serif text-xl font-bold text-gold-100">
              Psalm 91: The Soldier's Shield
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Narrated with deep cathedral acoustic resonance and monastic choir. Designed to loop all night for insomnia and fear.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-gold-400" /> 4:30 (Loopable)
              </span>
              <span>•</span>
              <span className="text-gold-400/90 font-medium">Synchronized Text</span>
            </div>
          </div>

          <button
            onClick={() => onPlayPrayer(featuredPrayer)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-semibold text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-obsidian-950" />
            <span>Pray Now</span>
          </button>
        </div>
      </section>

      {/* Liturgical Daily Rhythm */}
      <section className="bg-obsidian-900/60 rounded-2xl border border-obsidian-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Liturgical Daily Rhythm
          </h2>
          <span className="text-[11px] text-slate-400">1 of 3 Completed</span>
        </div>

        <div className="space-y-2">
          {/* Morning */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-850 border border-obsidian-800/80">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <span className="text-xs font-medium text-slate-200">Morning Offering & Armor</span>
                <p className="text-[11px] text-slate-400">Completed at 7:15 AM</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Done</span>
          </div>

          {/* 3 PM Divine Mercy */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-850/80 border border-gold-500/20">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border border-gold-400/40 flex items-center justify-center text-[10px] text-gold-400 font-bold">
                3
              </div>
              <div>
                <span className="text-xs font-medium text-gold-200">3:00 PM Divine Mercy Chaplet</span>
                <p className="text-[11px] text-slate-400">The Hour of Great Mercy</p>
              </div>
            </div>
            <button 
              onClick={() => onPlayPrayer(PRAYERS_DATA.find(p => p.id === 'divine-mercy'))}
              className="text-xs px-2.5 py-1 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 transition"
            >
              Start
            </button>
          </div>

          {/* Night Compline */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-850 border border-obsidian-800/80">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-slate-500" />
              <div>
                <span className="text-xs font-medium text-slate-300">Night Compline & Examination</span>
                <p className="text-[11px] text-slate-400">Before entering sleep silence</p>
              </div>
            </div>
            <button 
              onClick={() => onPlayPrayer(PRAYERS_DATA.find(p => p.id === 'night-compline'))}
              className="text-xs px-2.5 py-1 rounded-lg bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-gold-300 transition"
            >
              Prepare
            </button>
          </div>
        </div>
      </section>

      {/* Household Vigil Altar Teaser */}
      <section 
        onClick={() => setActiveTab('altar')}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950/30 via-obsidian-900 to-obsidian-900 border border-candle-glow/30 p-5 hover:border-candle-glow/60 transition group shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-b from-candle-amber/20 to-obsidian-950 border border-candle-glow/50">
              <Flame className="w-6 h-6 text-candle-flame animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm text-slate-100 group-hover:text-gold-300 transition">
                  Household Vigil Altar
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-candle-flame/20 border border-candle-flame/40 text-candle-amber font-mono">
                  {unreadCandlesCount} Burning
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Elena, Michael & 3 others under prayer protection
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
        </div>
      </section>

      {/* Liturgical Calendar Card */}
      <section 
        onClick={onOpenCalendar}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-emerald-500/25 p-5 hover:border-emerald-500/50 transition group shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm text-slate-100 group-hover:text-emerald-200 transition">
                  Liturgical Calendar & Feast Days
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                  Nov 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                St. Gertrude Memorial • Ordinary Time • Advent starts Nov 29
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </div>
      </section>

      {/* Catholic Novenas & Armory Hub Teaser */}
      <section 
        onClick={() => setActiveTab('explore')}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/25 p-5 hover:border-gold-500/50 transition group shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm text-slate-100 group-hover:text-gold-200 transition">
                  Catholic Novenas (9-Day Journeys)
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-gold-500/15 border border-gold-500/30 text-gold-400 font-mono">
                  PRAY & LEARN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                St. Michael Novena, The Surrender Novena & St. Jude Desperation
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
        </div>
      </section>

      {/* Pay It Forward Benefactor Banner */}
      <section 
        onClick={onOpenBenefactor}
        className="cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 border border-gold-500/30 p-4.5 hover:border-gold-400/60 transition group shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-xs text-gold-200 group-hover:text-gold-100 transition">
                  Keep Lorica 100% Free
                </h4>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  No Ads • No Paywall
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                Funded by prayer warriors. Sponsor souls seeking peace tonight.
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenBenefactor();
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-gold-500 text-obsidian-950 font-bold hover:brightness-110 active:scale-95 transition shrink-0"
          >
            Pay It Forward
          </button>
        </div>
      </section>
    </div>
  );
}
