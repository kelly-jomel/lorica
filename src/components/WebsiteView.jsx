import React, { useState } from 'react';
import { 
  Shield, 
  Flame, 
  Sparkles, 
  Moon, 
  Play, 
  Pause,
  Heart, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Compass, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  Users, 
  Star, 
  Lock, 
  Award,
  Flower2,
  Music,
  Sliders,
  HelpCircle,
  BookMarked,
  ShieldAlert,
  Sword,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { PRAY_SECTIONS, LEARN_SECTIONS } from '../data/categoriesData';
import { NOVENAS_DATA } from '../data/novenasData';
import { PRAYERS_DATA } from '../data/prayersData';
import { soundEngine } from '../services/soundEngine';

export default function WebsiteView({ onLaunchApp, onPlayPrayer, onOpenBenefactor, onOpenCalendar, onSelectNovena }) {
  const [activeTabGroup, setActiveTabGroup] = useState('PRAY');
  const [activeSectionId, setActiveSectionId] = useState('prayers');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Benefactor Free-Will Donation State
  const [donationFrequency, setDonationFrequency] = useState('monthly'); // 'monthly' | 'one-time'
  const [donationAmount, setDonationAmount] = useState(15);
  const [customDonationInput, setCustomDonationInput] = useState('');
  const [hasDonated, setHasDonated] = useState(false);

  const currentDonation = customDonationInput !== '' ? parseFloat(customDonationInput) || 0 : donationAmount;

  const handleInlineDonation = (e) => {
    e.preventDefault();
    if (currentDonation <= 0) return;
    soundEngine.init();
    soundEngine.playBell(523.25);
    setHasDonated(true);
  };

  const handleTogglePreviewAudio = () => {
    soundEngine.init();
    if (isPlayingPreview) {
      soundEngine.stopAll();
      setIsPlayingPreview(false);
    } else {
      soundEngine.startCathedralDrone(0.25);
      soundEngine.startRain(0.15);
      soundEngine.playBell(440);
      setIsPlayingPreview(true);
    }
  };

  const currentSection = activeTabGroup === 'PRAY' 
    ? PRAY_SECTIONS.find(s => s.id === activeSectionId) || PRAY_SECTIONS[0]
    : LEARN_SECTIONS.find(s => s.id === activeSectionId) || LEARN_SECTIONS[0];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-gold-500 selection:text-obsidian-950">
      
      {/* 1. TOP GLOBAL NAVBAR */}
      <header className="sticky top-0 z-50 bg-obsidian-950/85 backdrop-blur-xl border-b border-obsidian-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-500/25 to-obsidian-850 border border-gold-500/50 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Shield className="w-5 h-5 text-gold-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-candle-flame rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-wider text-gold-100">LORICA</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400">
                  SCUTUM FIDEI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                Catholic Prayers & Spiritual Armor
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-300">
            <a href="#novenas" className="hover:text-gold-300 transition">Novenas (9-Day)</a>
            <a href="#treasury" className="hover:text-gold-300 transition">Prayer Treasury</a>
            <a href="#protection" className="hover:text-gold-300 transition">Spiritual Warfare</a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Liturgical Calendar Trigger */}
          <button
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition active:scale-95"
            title="Open Catholic Liturgical Calendar"
          >
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Liturgical Calendar</span>
          </button>

          {/* Pay It Forward Benefactor Trigger */}
          <button
            onClick={onOpenBenefactor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 font-semibold text-xs hover:bg-gold-500/20 active:scale-95 transition"
          >
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
            <span>Pay It Forward</span>
          </button>

          {/* Open Sanctuary App Button */}
          {onLaunchApp && (
            <button
              onClick={onLaunchApp}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Open Sanctuary App</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-gold-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-xs text-gold-300 font-medium animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Ephesians 6:11 • Put on the whole armour of God</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-100 tracking-tight leading-[1.15]">
            A Sacred Catholic Shield for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-amber-500">
              Nighttime Fear & Spiritual Combat
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans">
            Over 2,000 years of Catholic prayers, 9-day novena journeys, and sleepless-night Scripture shields. 
            Narrated with cathedral acoustic resonance. <strong className="text-gold-200">100% Free Forever</strong> through our Benefactor Covenant.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 w-full sm:w-auto">
            {/* Play Psalm 91 directly on website */}
            <button
              onClick={() => {
                const psalm91 = PRAYERS_DATA.find(p => p.id === 'psalm-91');
                if (psalm91) onPlayPrayer(psalm91);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-base shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-obsidian-950" />
              <span>Pray Online (Psalm 91)</span>
            </button>

            {onLaunchApp && (
              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-obsidian-900 border border-gold-500/40 text-gold-200 font-bold text-base hover:bg-gold-500 hover:text-obsidian-950 active:scale-95 transition shadow-lg"
              >
                <Smartphone className="w-4 h-4" />
                <span>Launch Sanctuary App</span>
              </button>
            )}
          </div>

          {/* Free Guarantee Trust Marks */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free Forever
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Commercial Ads
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Paywalls or Locked Prayers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Catholic Orthodoxy
            </span>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS GRID */}
      <section id="protection" className="py-16 sm:py-24 bg-obsidian-900/40 border-y border-obsidian-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-gold-400 uppercase tracking-widest">WHY LORICA EXISTS</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-100">
              When You Need Spiritual Reinforcements
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Not just another routine prayer tracker. Lorica was forged specifically for moments of panic, spiritual warfare, insomnia, and deep intercession.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div 
              onClick={() => {
                const psalm91 = PRAYERS_DATA.find(p => p.id === 'psalm-91');
                if (psalm91) onPlayPrayer(psalm91);
              }}
              className="cursor-pointer p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-gold-500/20 hover:border-gold-500/50 transition-all space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                <Moon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-gold-200">Continuous Sleep Loops</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Insomnia and racing thoughts melt away under the Soldier’s Shield. Psalm 91 and Night Compline are designed to loop all night with cathedral acoustics and pink-noise rain.
              </p>
              <div className="text-[11px] text-gold-400 font-mono flex items-center gap-1 group-hover:underline">
                <Play className="w-3 h-3 fill-current" />
                <span>Pray Psalm 91 Now</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div 
              onClick={() => {
                const stMichael = PRAYERS_DATA.find(p => p.id === 'st-michael');
                if (stMichael) onPlayPrayer(stMichael);
              }}
              className="cursor-pointer p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-red-500/20 hover:border-red-500/50 transition-all space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-red-200">One-Tap Spiritual SOS</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                When you feel paralyzed or spiritually attacked, there is no time to navigate menus. Deploy Pope Leo XIII’s St. Michael battle prayer and ancient breastplates instantly.
              </p>
              <div className="text-[11px] text-red-400 font-mono flex items-center gap-1 group-hover:underline">
                <Play className="w-3 h-3 fill-current" />
                <span>Deploy St. Michael Defense</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div 
              onClick={() => {
                const stJoseph = PRAYERS_DATA.find(p => p.id === 'st-joseph-terror-demons');
                if (stJoseph) onPlayPrayer(stJoseph);
              }}
              className="cursor-pointer p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-candle-glow/20 hover:border-candle-glow/50 transition-all space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-candle-flame/10 border border-candle-flame/30 flex items-center justify-center text-candle-flame group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-amber-200">Sacred Intercessions</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Keep continuous prayer vigils for children, sick family members, or deceased loved ones. Deep petitions through St. Joseph Terror of Demons and holy intercessors.
              </p>
              <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1 group-hover:underline">
                <Play className="w-3 h-3 fill-current" />
                <span>Pray St. Joseph Intercession</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE NOVENAS DIRECTORY SHOWCASE */}
      <section id="novenas" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-candle-amber uppercase tracking-widest">9-DAY SACRED DEVOTIONS</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-100 mt-1">
              Catholic Novenas Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Click any novena to open the 9-day prayer guide and start praying online right now.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {NOVENAS_DATA.map((novena) => (
            <div
              key={novena.id}
              onClick={() => onSelectNovena(novena)}
              className="cursor-pointer p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 hover:border-gold-500/50 hover:bg-obsidian-850 transition-all flex flex-col justify-between space-y-3 group shadow-lg active:scale-99"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-semibold">
                    {novena.group}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{novena.feastDate}</span>
                </div>
                <h4 className="font-serif font-bold text-sm text-slate-100 group-hover:text-gold-200 transition">
                  {novena.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {novena.purpose}
                </p>
              </div>

              <div className="pt-2 border-t border-obsidian-800 flex items-center justify-between text-xs text-gold-400 font-medium group-hover:text-gold-300">
                <span>Open 9-Day Guide</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE ARMORY TREASURY (7 PRAY & 5 LEARN DIRECTORY) */}
      <section id="treasury" className="py-16 sm:py-24 bg-obsidian-900/60 border-t border-obsidian-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-gold-400 uppercase tracking-widest">THE SACRED LIBRARY</span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-100">
              Browse the Lorica Armory
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any prayer to listen directly in the web player.
            </p>
          </div>

          {/* PRAY vs LEARN Primary Switcher */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-obsidian-950 border border-obsidian-800">
              <button
                onClick={() => {
                  setActiveTabGroup('PRAY');
                  setActiveSectionId('prayers');
                }}
                className={`px-6 py-2 rounded-xl text-xs font-bold tracking-wider transition ${
                  activeTabGroup === 'PRAY'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PRAY (7 CATEGORIES)
              </button>
              <button
                onClick={() => {
                  setActiveTabGroup('LEARN');
                  setActiveSectionId('guides');
                }}
                className={`px-6 py-2 rounded-xl text-xs font-bold tracking-wider transition ${
                  activeTabGroup === 'LEARN'
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LEARN (5 CATEGORIES)
              </button>
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {(activeTabGroup === 'PRAY' ? PRAY_SECTIONS : LEARN_SECTIONS).map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`text-xs px-4 py-2 rounded-xl whitespace-nowrap transition-all font-medium ${
                  activeSectionId === sec.id
                    ? 'bg-gold-500/20 border border-gold-500/60 text-gold-300 font-bold'
                    : 'bg-obsidian-950 border border-obsidian-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Active Category Display */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-950 border border-gold-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-gold-200">{currentSection.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentSection.subtitle}</p>
              </div>
            </div>

            {/* Novenas Category Direct Grid */}
            {currentSection.id === 'novenas' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {NOVENAS_DATA.map((novena) => (
                    <div
                      key={novena.id}
                      onClick={() => onSelectNovena(novena)}
                      className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 hover:border-gold-500/50 hover:bg-obsidian-850 cursor-pointer flex flex-col justify-between gap-3 group transition shadow-md active:scale-99"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 font-bold">
                            {novena.group}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{novena.feastDate}</span>
                        </div>
                        <h4 className="font-serif text-sm font-bold text-slate-100 group-hover:text-gold-200 transition">
                          {novena.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {novena.description || novena.purpose}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-obsidian-800 flex items-center justify-between text-xs text-gold-400 font-medium group-hover:text-gold-300">
                        <span className="font-mono text-[11px]">9-Day Liturgical Journey</span>
                        <div className="w-7 h-7 rounded-full bg-obsidian-950 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition shrink-0">
                          <Play className="w-3 h-3 fill-current" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prayers / Items in Section */}
            {currentSection.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentSection.items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const existing = PRAYERS_DATA.find(p => p.id === item.prayerId || p.id === item.id);
                      if (existing) {
                        onPlayPrayer(existing);
                      } else {
                        onPlayPrayer({
                          id: item.id || `prayer-${Date.now()}`,
                          title: item.title || item.name,
                          category: currentSection.title,
                          duration: item.duration || "2:30",
                          description: item.desc || item.theme,
                          verses: [
                            { id: 1, text: `${item.title || item.name}. In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.` },
                            { id: 2, text: item.desc || item.theme || "Lord Jesus Christ, hear our prayers and enfold us in Your divine mercy." },
                            { id: 3, text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be. Amen." }
                          ]
                        });
                      }
                    }}
                    className="p-3.5 rounded-2xl bg-obsidian-900 border border-obsidian-800 hover:border-gold-500/40 hover:bg-obsidian-850 cursor-pointer flex items-center justify-between gap-3 group transition shadow-md active:scale-99"
                  >
                    <div>
                      <h4 className="font-serif text-sm font-bold text-slate-100 group-hover:text-gold-200 transition">
                        {item.title || item.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {item.desc || item.theme}
                      </p>
                      {item.duration && (
                        <span className="text-[10px] text-gold-400 font-mono mt-1 block">{item.duration}</span>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-obsidian-950 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition shrink-0">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Patron Saints Directory Preview */}
            {currentSection.isPatronDirectory && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentSection.patrons.slice(0, 6).map((patron) => (
                  <div
                    key={patron.id}
                    className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 font-bold">
                          {patron.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{patron.feastDay}</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-slate-100">{patron.name}</h4>
                      <p className="text-xs text-gold-300 font-medium">Patron of {patron.patronage}</p>
                      <p className="text-xs text-slate-400 line-clamp-2">{patron.bio}</p>
                    </div>
                    <button
                      onClick={() => {
                        onPlayPrayer({
                          id: patron.id,
                          title: `Prayer to ${patron.name}`,
                          category: `Patron Saint • ${patron.category}`,
                          duration: patron.duration || "2:30",
                          description: `Patron of ${patron.patronage}`,
                          narratorTrack: patron.narratorTrack,
                          narratorName: patron.narratorName,
                          verses: [
                            { id: 1, text: `Prayer to ${patron.name}, Patron of ${patron.patronage}.` },
                            { id: 2, text: patron.prayer },
                            { id: 3, text: "Glory be to the Father, and to the Son, and to the Holy Spirit. Amen." }
                          ]
                        });
                      }}
                      className="w-full mt-2 py-2 rounded-xl bg-obsidian-950 border border-gold-500/30 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Pray Intercession</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. THE BENEFACTOR COVENANT */}
      <section id="benefactor" className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-amber-950/40 border border-gold-500/40 p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <Heart className="w-3.5 h-3.5 fill-current text-emerald-400" />
              <span>THE BENEFACTOR COVENANT • 100% FREE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-100 leading-tight">
              Give Freely as You Wish • Zero Paywalls, Ads, or Locked Prayers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              We believe sacred prayers, spiritual deliverance, and Holy Scripture should never be gated behind a subscription paywall.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Lorica is funded entirely by prayer warriors and benefactors who freely choose to sponsor souls in distress. There are no fixed pricing tiers—donate whatever amount you decide in your heart, whether as a sustained monthly blessing or a one-time gift.
            </p>
          </div>

          {/* Interactive Free-Will Donation Module */}
          {!hasDonated ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-950/80 border border-gold-500/30 space-y-6">
              {/* Frequency Toggle: Monthly Recurring vs One-Time */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-800 pb-5">
                <div>
                  <span className="text-xs font-mono text-gold-400 uppercase tracking-wider block">GIFT FREQUENCY</span>
                  <p className="text-xs text-slate-400">Choose between sustained monthly almsgiving or a one-time gift.</p>
                </div>
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-obsidian-900 border border-obsidian-800 max-w-xs text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setDonationFrequency('monthly')}
                    className={`px-4 py-2 rounded-xl transition ${
                      donationFrequency === 'monthly'
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Monthly Recurring
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationFrequency('one-time')}
                    className={`px-4 py-2 rounded-xl transition ${
                      donationFrequency === 'one-time'
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    One-Time Gift
                  </button>
                </div>
              </div>

              {/* Amount Selection: Presets + Custom Amount */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
                  Select or Enter Any Amount:
                </span>
                
                {/* Preset Suggested Chips */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {[5, 10, 15, 25, 50, 100].map((amt) => {
                    const isSelected = donationAmount === amt && customDonationInput === '';
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setDonationAmount(amt);
                          setCustomDonationInput('');
                        }}
                        className={`py-3 rounded-xl font-mono text-sm font-bold transition-all ${
                          isSelected
                            ? 'bg-gold-500 text-obsidian-950 shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                            : 'bg-obsidian-900 border border-obsidian-800 text-slate-300 hover:border-gold-500/40'
                        }`}
                      >
                        ${amt}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input Field */}
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400 font-mono text-base font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    placeholder="Or enter any custom amount (e.g. 12, 20, 75)..."
                    value={customDonationInput}
                    onChange={(e) => setCustomDonationInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-3.5 rounded-2xl bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 text-slate-100 placeholder:text-slate-500 font-mono text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* Dynamic Impact Summary */}
              <div className="p-4 rounded-2xl bg-obsidian-900 border border-gold-500/20 flex items-center gap-3 text-xs text-slate-300">
                <Sparkles className="w-5 h-5 text-gold-400 shrink-0" />
                <span>
                  Your <strong className="text-gold-300">{donationFrequency === 'monthly' ? 'monthly recurring gift' : 'one-time gift'}</strong> of{' '}
                  <strong className="text-gold-300 font-mono text-sm">${currentDonation || 0}</strong>{' '}
                  {donationFrequency === 'monthly' ? '/ month' : ''} ensures someone fighting fear, insomnia, or grief tonight receives free spiritual refuge.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs italic text-slate-400 font-reading text-center sm:text-left">
                  "Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7
                </span>
                <button
                  onClick={handleInlineDonation}
                  disabled={currentDonation <= 0}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-40"
                >
                  <Heart className="w-4 h-4 fill-obsidian-950" />
                  <span>
                    Pay It Forward: ${currentDonation || 0} {donationFrequency === 'monthly' ? '/ month' : 'one-time'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            /* Confirmation Blessing State */
            <div className="p-8 rounded-2xl bg-obsidian-950/80 border border-emerald-500/40 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-100">
                May God Bless Your Generosity
              </h3>
              <p className="text-sm text-gold-300 font-mono">
                ${currentDonation} {donationFrequency === 'monthly' ? '/ month recurring' : 'one-time gift'} pledged
              </p>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                You are now a registered benefactor in the Lorica Covenant. Because of your willingness to give freely, weary souls seeking refuge tonight will never be turned away.
              </p>
              <div className="p-4 rounded-xl bg-obsidian-900 border border-gold-500/20 max-w-lg mx-auto text-xs italic text-gold-200/90 font-reading">
                "The Lord repay you for what you have done, and a full reward be given you by the Lord, the God of Israel, under whose wings you have come to take refuge!" — Ruth 2:12
              </div>
              <button
                onClick={() => setHasDonated(false)}
                className="px-6 py-2.5 rounded-xl bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 hover:text-white text-xs font-semibold border border-obsidian-800 transition"
              >
                Change or Update Gift
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-obsidian-950 border-t border-obsidian-850 px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-base text-gold-200">LORICA</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An independent Catholic prayer, novena, and spiritual warfare companion. Named after the ancient 5th-century Celtic breastplate of St. Patrick.
            </p>
            <p className="text-[11px] text-gold-400/80 font-mono">
              Non-profit Benefactor Covenant • 100% Free
            </p>
          </div>

          {/* Col 2: PRAY */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-200 uppercase tracking-wider block font-mono text-[11px]">PRAY</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#treasury" className="hover:text-gold-300">Daily Prayers</a></li>
              <li><a href="#protection" className="hover:text-gold-300">Spiritual Warfare</a></li>
              <li><a href="#novenas" className="hover:text-gold-300">Catholic Novenas</a></li>
              <li><a href="#treasury" className="hover:text-gold-300">The Holy Rosary</a></li>
              <li><a href="#treasury" className="hover:text-gold-300">Patron Saints</a></li>
              <li><a href="#treasury" className="hover:text-gold-300">Psalms of Refuge</a></li>
            </ul>
          </div>

          {/* Col 3: LEARN */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-200 uppercase tracking-wider block font-mono text-[11px]">LEARN</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#treasury" className="hover:text-gold-300">How to Pray Novenas</a></li>
              <li><a href="#treasury" className="hover:text-gold-300">Lectio Divina Guide</a></li>
              <li><a href="#treasury" className="hover:text-gold-300">Examination of Conscience</a></li>
              <li><a href="#treasury" className="hover:text-gold-300">Spiritual Warfare Explained</a></li>
              <li><a href="#treasury" className="hover:text-gold-300">Bible Verses for Fear</a></li>
            </ul>
          </div>

          {/* Col 4: TOOLS & CALENDAR */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-200 uppercase tracking-wider block font-mono text-[11px]">TOOLS</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={onOpenCalendar} className="hover:text-gold-300 text-left">Liturgical Calendar</button></li>
              <li><a href="#treasury" className="hover:text-gold-300 text-left">Prayer Armory</a></li>
              <li><a href="#novenas" className="hover:text-gold-300 text-left">9-Day Novenas</a></li>
              <li><button onClick={onOpenBenefactor} className="hover:text-gold-300 text-left">Pay It Forward</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-obsidian-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Lorica Catholic Prayers. All sacred texts from public domain Douay-Rheims and traditional Catholic liturgical rites.</p>
          <div className="flex items-center gap-4 text-gold-400/70 font-serif italic">
            <span>Benedicat vos omnipotens Deus</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
