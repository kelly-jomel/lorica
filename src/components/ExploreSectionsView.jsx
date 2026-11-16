import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  Flame, 
  Sparkles, 
  Flower2, 
  Compass, 
  Music, 
  HelpCircle, 
  Calendar, 
  BookMarked, 
  Sliders, 
  ChevronRight, 
  Play, 
  Check, 
  ArrowLeft 
} from 'lucide-react';
import { PRAY_SECTIONS, LEARN_SECTIONS } from '../data/categoriesData';
import { PRAYERS_DATA } from '../data/prayersData';
import NovenasPortal from './NovenasPortal';
import { soundEngine } from '../services/soundEngine';

export default function ExploreSectionsView({ onPlayPrayer, onSelectTool }) {
  const [activeMainTab, setActiveMainTab] = useState('PRAY'); // 'PRAY' | 'LEARN'
  const [selectedSection, setSelectedSection] = useState(null); // section object or null
  const [patronFilter, setPatronFilter] = useState('All');

  // Trigger full prayer audio with verses & soundscapes
  const handleLaunchPrayer = (item) => {
    soundEngine.init();
    const existing = PRAYERS_DATA.find(p => p.id === item.prayerId || p.id === item.id);
    if (existing) {
      onPlayPrayer(existing);
    } else {
      // Create playable prayer object with fallback verses
      const synthesizedPrayer = {
        id: item.id || `prayer-${Date.now()}`,
        title: item.title || item.name || item.saint,
        category: selectedSection?.title || 'Catholic Prayers',
        duration: item.duration || '2:30',
        description: item.desc || item.bio || item.prayer || 'Sacred Catholic devotion.',
        verses: [
          { id: 1, text: `${item.title || item.name || item.saint}. In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.` },
          { id: 2, text: item.desc || item.bio || item.prayer || 'Lord Jesus Christ, hear our prayers and enfold us in Your divine mercy.' },
          { id: 3, text: 'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.' }
        ]
      };
      onPlayPrayer(synthesizedPrayer);
    }
  };

  // If Novenas is selected in PRAY, render NovenasPortal
  if (selectedSection?.id === 'novenas') {
    return (
      <NovenasPortal 
        onBack={() => setSelectedSection(null)} 
        onPlayAudio={(prayerObj) => onPlayPrayer(prayerObj)}
      />
    );
  }

  // If a specific section detail is open
  if (selectedSection) {
    return (
      <div className="space-y-5 pb-28 pt-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSection(null)}
            className="text-xs text-slate-400 hover:text-gold-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {activeMainTab}</span>
          </button>
          <span className="text-[10px] font-mono text-gold-400 uppercase">
            {activeMainTab} • {selectedSection.title}
          </span>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-gold-200">{selectedSection.title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{selectedSection.subtitle}</p>
        </div>

        {/* GENERIC PRAYER LIST (Core Daily, Marian, Eucharistic, Litanies, Chaplets, Protection, Psalms) */}
        {selectedSection.items && selectedSection.id !== 'guides' && selectedSection.id !== 'explained' && selectedSection.id !== 'seasons' && selectedSection.id !== 'bible-verses' && (
          <div className="space-y-2.5">
            {selectedSection.items.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => handleLaunchPrayer(item)}
                className="group cursor-pointer p-3.5 rounded-2xl bg-obsidian-900 border border-obsidian-800 hover:border-gold-500/40 hover:bg-obsidian-850 transition flex items-center justify-between gap-3 active:scale-99"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {item.num && (
                      <span className="text-[10px] font-mono text-gold-400 uppercase">{item.num}</span>
                    )}
                    <h3 className="font-serif text-sm font-bold text-slate-100 group-hover:text-gold-200 transition">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.desc || item.theme}</p>
                  <span className="text-[10px] text-gold-400 font-mono mt-1 block">{item.duration}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchPrayer(item);
                  }}
                  className="w-9 h-9 rounded-full bg-obsidian-950 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500/20 group-hover:border-gold-500/60 transition shrink-0"
                >
                  <Play className="w-4 h-4 fill-current translate-x-0.2" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SECTION: Guides */}
        {selectedSection.id === 'guides' && (
          <div className="space-y-4">
            {selectedSection.items.map((guide, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 space-y-2.5">
                <h3 className="font-serif text-base font-bold text-gold-200">{guide.title}</h3>
                <ol className="space-y-1.5 pl-4 list-decimal text-xs text-slate-300">
                  {guide.steps.map((s, sIdx) => (
                    <li key={sIdx} className="leading-relaxed">{s}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {/* SECTION: Explained */}
        {selectedSection.id === 'explained' && (
          <div className="space-y-3.5">
            {selectedSection.items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 space-y-2">
                <h3 className="font-serif text-sm font-bold text-gold-300">{item.q}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-reading">{item.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* SECTION: Seasons */}
        {selectedSection.id === 'seasons' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-obsidian-900 border border-emerald-500/40 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Current Liturgical Season</span>
              <h3 className="font-serif text-lg font-bold text-slate-100">{selectedSection.currentSeason.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedSection.currentSeason.meaning}</p>
              <div className="pt-2 text-xs text-slate-400 border-t border-emerald-500/20">
                Next: {selectedSection.currentSeason.nextSeason}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">The Church Calendar:</span>
              {selectedSection.calendar.map((c, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color.includes('Green') ? '#10B981' : c.color.includes('Purple') || c.color.includes('Violet') ? '#8B5CF6' : '#F59E0B' }} />
                    <span className="text-xs font-medium text-slate-200">{c.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{c.focus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: Bible Verses */}
        {selectedSection.id === 'bible-verses' && (
          <div className="space-y-4">
            {selectedSection.categories.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400">{cat.topic}</h3>
                <div className="space-y-2">
                  {cat.verses.map((v, vIdx) => (
                    <div key={vIdx} className="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-800 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400">{v.ref}</span>
                      <p className="font-reading italic text-xs text-slate-200 leading-relaxed">"{v.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Master Hub: PRAY & LEARN Columns (Matching AngelGuard taxonomy)
  return (
    <div className="space-y-5 pb-28 pt-2">
      {/* Top Banner */}
      <div>
        <h2 className="font-serif text-xl font-bold text-gold-200">The Lorica Armory</h2>
        <p className="text-xs text-slate-400">Catholic devotions, novenas, teachings, and spiritual guides</p>
      </div>

      {/* PRAY vs LEARN Primary Switcher */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-obsidian-900 border border-obsidian-800">
        <button
          onClick={() => setActiveMainTab('PRAY')}
          className={`py-2 rounded-xl text-xs font-bold tracking-wider transition ${
            activeMainTab === 'PRAY'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          PRAY (8 SECTIONS)
        </button>
        <button
          onClick={() => setActiveMainTab('LEARN')}
          className={`py-2 rounded-xl text-xs font-bold tracking-wider transition ${
            activeMainTab === 'LEARN'
              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          LEARN (5 SECTIONS)
        </button>
      </div>

      {/* PRAY SECTIONS LIST */}
      {activeMainTab === 'PRAY' && (
        <div className="space-y-2.5">
          {PRAY_SECTIONS.map((sec) => (
            <div
              key={sec.id}
              onClick={() => setSelectedSection(sec)}
              className={`group cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-lg active:scale-99 ${
                sec.highlight
                  ? 'bg-gradient-to-r from-amber-950/40 via-obsidian-900 to-obsidian-900 border-candle-glow/40 hover:border-candle-glow'
                  : 'bg-obsidian-900/80 border-obsidian-800 hover:border-gold-500/40 hover:bg-obsidian-850'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl bg-obsidian-950 border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  sec.highlight ? 'border-candle-flame text-candle-flame' : 'border-gold-500/30 text-gold-400'
                }`}>
                  {sec.id === 'core-daily' && <BookOpen className="w-5 h-5" />}
                  {sec.id === 'marian-devotions' && <Flower2 className="w-5 h-5" />}
                  {sec.id === 'eucharistic-liturgical' && <Flame className="w-5 h-5" />}
                  {sec.id === 'major-litanies' && <Music className="w-5 h-5" />}
                  {sec.id === 'popular-chaplets' && <Sparkles className="w-5 h-5" />}
                  {sec.id === 'saints-protection' && <ShieldAlert className="w-5 h-5" />}
                  {sec.id === 'novenas' && <Flame className="w-5 h-5" />}
                  {sec.id === 'psalms' && <Music className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-sm text-slate-100 group-hover:text-gold-200 transition">
                      {sec.title}
                    </h3>
                    {sec.highlight && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-candle-flame/20 text-candle-amber font-mono font-bold">
                        9-Day Tracker
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{sec.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">{sec.count}</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LEARN SECTIONS LIST */}
      {activeMainTab === 'LEARN' && (
        <div className="space-y-2.5">
          {LEARN_SECTIONS.map((sec) => (
            <div
              key={sec.id}
              onClick={() => setSelectedSection(sec)}
              className="group cursor-pointer p-3.5 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 hover:border-gold-500/40 hover:bg-obsidian-850 transition-all flex items-center justify-between gap-3 shadow-lg active:scale-99"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-obsidian-950 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 group-hover:scale-105 transition-transform">
                  {sec.id === 'guides' && <Compass className="w-5 h-5" />}
                  {sec.id === 'free-tools' && <Sliders className="w-5 h-5" />}
                  {sec.id === 'explained' && <HelpCircle className="w-5 h-5" />}
                  {sec.id === 'seasons' && <Calendar className="w-5 h-5" />}
                  {sec.id === 'bible-verses' && <BookMarked className="w-5 h-5" />}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-sm text-slate-100 group-hover:text-gold-200 transition">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{sec.subtitle}</p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
