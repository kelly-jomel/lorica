import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Flame, 
  Sparkles, 
  Moon, 
  Play, 
  Heart, 
  Calendar as CalendarIcon, 
  BookOpen, 
  Compass, 
  ChevronRight, 
  CheckCircle2, 
  Volume2, 
  Users, 
  Star, 
  ShieldAlert, 
  Sword, 
  ExternalLink,
  Search,
  Menu,
  X,
  Cross,
  Clock,
  ShieldCheck,
  Disc,
  Languages,
  Zap,
  ArrowRight,
  HeartHandshake,
  Music,
  User
} from 'lucide-react';
import { PRAY_SECTIONS, LEARN_SECTIONS } from '../data/categoriesData';
import { NOVENAS_DATA } from '../data/novenasData';
import { PRAYERS_DATA, CRISIS_CAROUSEL } from '../data/prayersData';
import { soundEngine } from '../services/soundEngine';
import DailyPsalmCard from './DailyPsalmCard';
import { currencyService, SUPPORTED_CURRENCIES } from '../services/currencyService';
import { TRANSLATIONS } from '../data/translationsData';

export default function WebsiteView({ 
  onLaunchApp, 
  onPlayPrayer, 
  onOpenBenefactor, 
  onOpenCalendar, 
  onSelectNovena, 
  onOpenBible, 
  onOpenConfession,
  onOpenRosary,
  onOpenIntentions,
  onOpenProfile,
  onShareCard
}) {
  // Multi-Language State (en, es, pt)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lorica_user_lang') || 'en';
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleLanguageChange = (newLang) => {
    soundEngine.init();
    soundEngine.playBell(523.25);
    setLang(newLang);
    try {
      localStorage.setItem('lorica_user_lang', newLang);
    } catch (e) {}
  };
  // Page Navigation State: 'home' | 'treasury' | 'novenas' | 'warfare'
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('treasury')) return 'treasury';
      if (hash.includes('novena')) return 'novenas';
      if (hash.includes('warfare') || hash.includes('spirit') || hash.includes('protection')) return 'warfare';
    }
    return 'home';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTabGroup, setActiveTabGroup] = useState('PRAY');
  const [activeSectionId, setActiveSectionId] = useState('prayers');
  const [treasurySearch, setTreasurySearch] = useState('');
  const [novenaFilter, setNovenaFilter] = useState('all');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Benefactor Free-Will Donation State (matching the Sanctuary Benefactor Covenant)
  const [selectedPlan, setSelectedPlan] = useState('warrior'); // 'guardian' | 'warrior' | 'pillar' | 'custom'
  const [donationFrequency, setDonationFrequency] = useState('monthly'); // 'monthly' | 'one-time'
  const [currency, setCurrency] = useState(() => currencyService.getCurrency());
  const [customAmount, setCustomAmount] = useState(() => String(currencyService.getCurrency().defaultCustom));
  const [inlineDonorName, setInlineDonorName] = useState('');
  const [inlineDonorEmail, setInlineDonorEmail] = useState('');
  const [isInlineSubmitting, setIsInlineSubmitting] = useState(false);

  useEffect(() => {
    currencyService.autoDetect().then((c) => {
      if (c) {
        setCurrency(c);
        setCustomAmount(String(c.defaultCustom));
      }
    });
    const unsub = currencyService.subscribe((c) => {
      if (c) {
        setCurrency(c);
        setCustomAmount(String(c.defaultCustom));
      }
    });
    return () => unsub();
  }, []);
  const [hasDonated, setHasDonated] = useState(false);

  // Sync Hash on Browser Back/Forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('treasury')) setCurrentPage('treasury');
      else if (hash.includes('novena')) setCurrentPage('novenas');
      else if (hash.includes('warfare') || hash.includes('spirit') || hash.includes('protection')) setCurrentPage('warfare');
      else setCurrentPage('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dynamic SEO Page Title & Description Updates
  useEffect(() => {
    const seoMeta = {
      home: {
        title: "Lorica | Catholic Prayers, 9-Day Novenas & Spiritual Warfare Armor",
        desc: "Free traditional Catholic prayer armory featuring authentic studio voice narration, Gregorian monastic chants, 12 complete 9-day novenas with Rosary, and Psalm 91 sleep loops."
      },
      treasury: {
        title: "Catholic Prayer Treasury | 7 Pray & 5 Learn Libraries | Lorica",
        desc: "Browse the complete Catholic prayer library: foundational prayers, Eucharistic Adoration, Marian litanies, and patristic Latin chants with authentic studio audio."
      },
      novenas: {
        title: "12 Catholic Novenas Directory | Full 9 Days & 5-Decade Rosary | Lorica",
        desc: "All 12 complete traditional Catholic novenas. Full 9-day liturgical journey with daily intentions, Scripture meditations, authentic studio audio, and the complete Holy Rosary."
      },
      warfare: {
        title: "Spirit Warfare & Sacred Protection | St. Michael, St. Benedict & Psalm 91 | Lorica",
        desc: "Centuries of traditional Catholic spiritual armor against panic, demonic oppression, and nighttime fear. St. Michael battle prayer, St. Benedict exorcism blessing, and Lorica of St. Patrick."
      }
    };

    const currentSeo = seoMeta[currentPage] || seoMeta.home;
    document.title = currentSeo.title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', currentSeo.desc);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', currentSeo.title);
    }
  }, [currentPage]);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const benefactorTiers = [
    {
      id: 'guardian',
      name: 'Guardian Benefactor',
      monthlyPrice: currency.guardian.monthly,
      oneTimePrice: currency.guardian.oneTime,
      soulsImpact: '10 Souls Sponsored',
      desc: 'Ensures free audio prayers and sleep peace for 10 people battling anxiety or insomnia each month.',
      icon: Shield
    },
    {
      id: 'warrior',
      name: 'St. Michael Warrior',
      monthlyPrice: currency.warrior.monthly,
      oneTimePrice: currency.warrior.oneTime,
      soulsImpact: '35 Souls Sponsored',
      desc: 'Funds continuous server bandwidth, scripture translations, and high-fidelity vocal recordings.',
      icon: Flame,
      highlight: true
    },
    {
      id: 'pillar',
      name: 'Sanctuary Pillar',
      monthlyPrice: currency.pillar.monthly,
      oneTimePrice: currency.pillar.oneTime,
      soulsImpact: '75 Souls Sponsored',
      desc: 'Endows new sacred audio production, Gregorian choir recording sessions, and parish outreach.',
      icon: Sparkles
    }
  ];

  const currentTier = benefactorTiers.find((t) => t.id === selectedPlan);
  const currentDonation =
    selectedPlan === 'custom'
      ? parseFloat(customAmount) || 0
      : donationFrequency === 'monthly'
      ? currentTier?.monthlyPrice || 15
      : currentTier?.oneTimePrice || 50;

  const handleInlineDonation = async (e) => {
    e.preventDefault();
    if (currentDonation <= 0) return;
    if (!inlineDonorName.trim() || !inlineDonorEmail.trim()) {
      alert('Please enter your Full Name and Email Address so we can register your benefaction.');
      return;
    }

    setIsInlineSubmitting(true);
    soundEngine.init();
    soundEngine.playBell(523.25);

    try {
      await fetch('/api/user-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_donation',
          name: inlineDonorName.trim(),
          email: inlineDonorEmail.trim().toLowerCase(),
          amount: currentDonation,
          currency: currency.code,
          tier: selectedPlan === 'custom' ? 'Custom Offering' : currentTier?.name,
          frequency: donationFrequency
        })
      });
    } catch (err) {
      console.warn('Inline donation recording error:', err);
    } finally {
      setIsInlineSubmitting(false);
      setHasDonated(true);
    }
  };

  const handleTogglePreviewAudio = () => {
    soundEngine.init();
    if (isPlayingPreview) {
      soundEngine.stopAll();
      setIsPlayingPreview(false);
    } else {
      soundEngine.playBell(523.25);
      setIsPlayingPreview(true);
    }
  };

  const currentSection = activeTabGroup === 'PRAY' 
    ? PRAY_SECTIONS.find(s => s.id === activeSectionId) || PRAY_SECTIONS[0]
    : LEARN_SECTIONS.find(s => s.id === activeSectionId) || LEARN_SECTIONS[0];

  // Filtered Novenas list
  const filteredNovenas = NOVENAS_DATA.filter((n) => {
    if (novenaFilter === 'marian') return n.group?.toLowerCase().includes('marian');
    if (novenaFilter === 'patron') return n.group?.toLowerCase().includes('patron') || n.group?.toLowerCase().includes('apostle');
    if (novenaFilter === 'christ') return n.group?.toLowerCase().includes('christ') || n.group?.toLowerCase().includes('spirit') || n.group?.toLowerCase().includes('mercy');
    return true;
  });

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-gold-500 selection:text-obsidian-950">
      
      {/* 1. TOP GLOBAL NAVBAR */}
      <header className="sticky top-0 z-50 bg-obsidian-950/90 backdrop-blur-xl border-b border-obsidian-800/80 px-4 sm:px-8 py-3 flex items-center justify-between transition-all">
        <div className="flex items-center gap-6">
          {/* Brand Logo & Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigateTo('home')}
            title="Lorica Home"
          >
            <div className="relative">
              <img 
                src="/logo.jpg" 
                alt="Lorica Emblem" 
                className="w-10 h-10 rounded-xl object-contain border border-gold-500/40 shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-obsidian-900 group-hover:scale-105 transition-transform" 
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-candle-flame rounded-full animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-wider text-gold-100 group-hover:text-gold-300 transition">
                  LORICA
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30 text-gold-400">
                  SCUTUM FIDEI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Desktop Nav Menu: Home | Prayer Treasury | Novenas | Spirit Warfare */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-1.5 rounded-xl transition ${
                currentPage === 'home'
                  ? 'bg-gold-500/20 text-gold-200 border border-gold-500/50 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                  : 'text-slate-300 hover:text-gold-300 hover:bg-obsidian-900'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => navigateTo('treasury')}
              className={`px-3 py-1.5 rounded-xl transition ${
                currentPage === 'treasury'
                  ? 'bg-gold-500/20 text-gold-200 border border-gold-500/50 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                  : 'text-slate-300 hover:text-gold-300 hover:bg-obsidian-900'
              }`}
            >
              {t.navTreasury}
            </button>
            <button
              onClick={() => navigateTo('novenas')}
              className={`px-3 py-1.5 rounded-xl transition ${
                currentPage === 'novenas'
                  ? 'bg-gold-500/20 text-gold-200 border border-gold-500/50 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                  : 'text-slate-300 hover:text-gold-300 hover:bg-obsidian-900'
              }`}
            >
              {t.navNovenas}
            </button>
            <button
              onClick={onOpenRosary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 transition text-xs font-semibold"
              title="Daily Holy Rosary with Latin / English Mode"
            >
              <Disc className="w-3.5 h-3.5 text-gold-400" />
              <span>{t.navRosary}</span>
            </button>
            <button
              onClick={onOpenIntentions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 transition text-xs font-semibold"
              title="Community Prayer Intentions Altar"
            >
              <Flame className="w-3.5 h-3.5 text-candle-flame" />
              <span>{t.navIntentions}</span>
            </button>
            <button
              onClick={onOpenConfession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 transition text-xs font-semibold"
              title="Open Examination of Conscience & Confession Helper"
            >
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              <span>{t.navConfession}</span>
            </button>
            <button
              onClick={onOpenBible}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/40 text-gold-300 transition shadow-[0_0_12px_rgba(212,175,55,0.15)]"
              title="Open Roman Catholic Holy Bible (73 Books)"
            >
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              <span>Catholic Bible</span>
              <span className="text-[9px] bg-gold-500/20 text-gold-200 px-1 py-0.2 rounded font-mono font-bold">73</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-Language Switcher (EN, ES, PT) */}
          <div className="flex items-center bg-obsidian-900 border border-obsidian-800 rounded-xl px-1.5 py-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-gold-400 mr-1 hidden sm:inline" />
            <select
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-gold-300 font-mono text-[11px] font-bold focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-obsidian-950 text-slate-200">EN</option>
              <option value="es" className="bg-obsidian-950 text-slate-200">ES</option>
              <option value="pt" className="bg-obsidian-950 text-slate-200">PT</option>
            </select>
          </div>

          {/* Liturgical Calendar Trigger */}
          <button
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition active:scale-95"
            title="Open Catholic Liturgical Calendar"
          >
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{t.liturgicalCalendar}</span>
          </button>

          {/* Pay It Forward Benefactor Trigger */}
          <button
            onClick={onOpenBenefactor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 font-semibold text-xs hover:bg-gold-500/20 active:scale-95 transition"
          >
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
            <span>{t.payItForward}</span>
          </button>

          {/* Pilgrim Benefactor Portal Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition active:scale-95"
            title="My Pilgrim Profile & Benefactor Portal"
          >
            <User className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">My Portal</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-obsidian-900 border border-obsidian-800 text-slate-300 hover:text-gold-300 transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] z-40 bg-obsidian-950/95 backdrop-blur-2xl border-b border-obsidian-800 p-4 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenProfile && onOpenProfile();
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl font-medium text-xs bg-gold-500/15 text-gold-200 border border-gold-500/40 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gold-400" />
              <span className="font-semibold">My Pilgrim & Benefactor Portal</span>
            </div>
            <span className="text-[10px] bg-gold-500/20 text-gold-300 px-1.5 py-0.5 rounded font-mono">My Giving</span>
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenBible && onOpenBible();
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl font-medium text-xs bg-gold-500/20 text-gold-200 border border-gold-500/50 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold-400" />
              <span className="font-semibold">The Catholic Bible (73 Books)</span>
            </div>
            <span className="text-[10px] bg-gold-500/30 text-gold-200 px-1.5 py-0.5 rounded font-mono">NABRE / NRSVCE</span>
          </button>
          <button
            onClick={() => navigateTo('home')}
            className={`w-full text-left px-4 py-3 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-between ${
              currentPage === 'home' ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-slate-300 hover:bg-obsidian-900'
            }`}
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => navigateTo('treasury')}
            className={`w-full text-left px-4 py-3 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-between ${
              currentPage === 'treasury' ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-slate-300 hover:bg-obsidian-900'
            }`}
          >
            <span>Prayer Treasury</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => navigateTo('novenas')}
            className={`w-full text-left px-4 py-3 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-between ${
              currentPage === 'novenas' ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-slate-300 hover:bg-obsidian-900'
            }`}
          >
            <span>Novenas (12 Traditional)</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenRosary && onOpenRosary();
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-between text-gold-300 hover:bg-obsidian-900 border border-gold-500/30"
          >
            <div className="flex items-center gap-2">
              <Disc className="w-4 h-4 text-gold-400" />
              <span>Daily Holy Rosary (Latin/English)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenIntentions && onOpenIntentions();
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-between text-candle-flame hover:bg-obsidian-900 border border-gold-500/30"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-candle-flame" />
              <span>Community Intentions Altar</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenConfession && onOpenConfession();
            }}
            className="w-full text-left px-4 py-3 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-between text-gold-300 hover:bg-obsidian-900 border border-gold-500/30"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold-400" />
              <span>Examination & Confession Helper</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={() => navigateTo('warfare')}
            className={`w-full text-left px-4 py-3 rounded-xl font-serif text-sm font-semibold transition flex items-center justify-between ${
              currentPage === 'warfare' ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'text-slate-300 hover:bg-obsidian-900'
            }`}
          >
            <span>Spirit Warfare & Armor</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* PAGE 1: HOME PAGE                                        */}
      {/* ======================================================== */}
      {currentPage === 'home' && (
        <main className="animate-in fade-in duration-300">
          {/* HERO SECTION */}
          <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-gold-500/15 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
              
              {/* Majestic Emblem Logo */}
              <div className="relative mb-2 group">
                <div className="absolute -inset-3 bg-gradient-to-r from-gold-500/30 via-amber-500/20 to-gold-500/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500" />
                <img 
                  src="/logo.jpg" 
                  alt="Lorica: Catholic Prayers & Spiritual Armor" 
                  className="relative w-36 sm:w-44 md:w-52 h-auto rounded-3xl border border-gold-500/50 shadow-[0_0_40px_rgba(212,175,55,0.4)] mx-auto object-contain transition-transform group-hover:scale-105 duration-300"
                />
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-xs text-gold-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>{t.ephesiansBadge}</span>
              </div>

              {/* Hero Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-100 tracking-tight leading-[1.15]">
                {t.heroTitlePart1} <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-amber-500">
                  {t.heroTitlePart2}
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-light leading-relaxed">
                {t.heroSubtitle}
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('treasury')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition"
                >
                  <BookOpen className="w-4 h-4 text-obsidian-950" />
                  <span>{t.btnTreasury}</span>
                </button>

                <button
                  onClick={onOpenRosary}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-obsidian-900 border border-gold-500/40 text-gold-200 font-bold text-sm hover:bg-obsidian-850 hover:border-gold-400 active:scale-95 transition"
                >
                  <Disc className="w-4 h-4 text-gold-400" />
                  <span>{t.btnRosary}</span>
                </button>

                <button
                  onClick={onOpenIntentions}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-obsidian-900 border border-gold-500/40 text-candle-flame font-bold text-sm hover:bg-obsidian-850 hover:border-gold-400 active:scale-95 transition"
                >
                  <Flame className="w-4 h-4 text-candle-flame" />
                  <span>{t.btnIntentions}</span>
                </button>

                <button
                  onClick={() => navigateTo('novenas')}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-obsidian-900 border border-obsidian-800 text-slate-300 font-bold text-sm hover:text-gold-200 active:scale-95 transition"
                >
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>{t.btnNovenas}</span>
                </button>

                <button
                  onClick={() => navigateTo('warfare')}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-obsidian-900 border border-red-500/40 text-red-200 font-bold text-sm hover:bg-obsidian-850 hover:border-red-400 active:scale-95 transition"
                >
                  <Sword className="w-4 h-4 text-red-400" />
                  <span>{t.btnWarfare}</span>
                </button>

                {/* Acoustic Soundscape Preview Button */}
                <button
                  onClick={handleTogglePreviewAudio}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-obsidian-900/80 border border-obsidian-750 text-slate-300 text-xs font-mono hover:text-gold-300 transition"
                  title="Test Sacred Sound Engine"
                >
                  <Volume2 className="w-4 h-4 text-gold-400" />
                  <span>{isPlayingPreview ? t.btnSilenceAudio : t.btnCathedralChime}</span>
                </button>
              </div>
            </div>
          </section>

          {/* TODAY'S LITURGICAL PSALM SECTION */}
          <section className="py-8 px-4 sm:px-8 max-w-4xl mx-auto">
            <div className="mb-3 text-center">
              <span className="text-[11px] font-mono text-gold-400 uppercase tracking-widest block">LITURGIA HORARUM</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">{t.dailyPsalmHeading}</h2>
            </div>
            <DailyPsalmCard onPlayPrayer={onPlayPrayer} />
          </section>

          {/* 3 CORE PORTAL PILLARS */}
          <section className="py-16 sm:py-24 bg-obsidian-900/40 border-y border-obsidian-800 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-mono text-gold-400 uppercase tracking-widest">FORGED FOR SOULS</span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-100">
                  {t.reinforcementsSubtitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  {t.reinforcementsDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pillar 1: Spirit Warfare */}
                <div 
                  onClick={() => navigateTo('warfare')}
                  className="cursor-pointer p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-red-500/20 hover:border-red-500/50 transition-all space-y-4 group shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-red-200">{t.pillarWarfareTitle}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {t.pillarWarfareDesc}
                  </p>
                  <div className="text-xs text-red-400 font-semibold font-mono flex items-center gap-1 group-hover:underline">
                    <span>{t.pillarWarfareBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Pillar 2: 9-Day Novenas */}
                <div 
                  onClick={() => navigateTo('novenas')}
                  className="cursor-pointer p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-gold-500/20 hover:border-gold-500/50 transition-all space-y-4 group shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-gold-200">{t.pillarNovenasTitle}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {t.pillarNovenasDesc}
                  </p>
                  <div className="text-xs text-gold-400 font-semibold font-mono flex items-center gap-1 group-hover:underline">
                    <span>{t.pillarNovenasBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Pillar 3: Prayer Treasury */}
                <div 
                  onClick={() => navigateTo('treasury')}
                  className="cursor-pointer p-6 rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-amber-500/20 hover:border-amber-500/50 transition-all space-y-4 group shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-amber-200">{t.pillarTreasuryTitle}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {t.pillarTreasuryDesc}
                  </p>
                  <div className="text-xs text-amber-400 font-semibold font-mono flex items-center gap-1 group-hover:underline">
                    <span>{t.pillarTreasuryBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* THE BENEFACTOR COVENANT SECTION */}
          <section id="benefactor" className="py-16 sm:py-24 px-4 sm:px-8 max-w-2xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-gold-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
              {!hasDonated ? (
                <div className="space-y-5">
                  <div className="text-center space-y-1.5 pt-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-medium">
                      <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
                      <span>The Benefactor Covenant • Pay It Forward</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gold-100">
                      Keep Lorica 100% Free for Everyone
                    </h2>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      We believe nobody should ever have to pay to pray. Lorica has zero ads and zero paywalls. Every prayer, sleep loop, and novena is funded entirely by users who choose to pay it forward.
                    </p>
                  </div>

                  {/* Impact Metric Bar */}
                  <div className="p-3.5 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex items-center justify-around text-center">
                    <div>
                      <span className="font-mono text-base font-bold text-gold-300 block">18,420</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Souls Praying Tonight</span>
                    </div>
                    <div className="w-px h-8 bg-obsidian-800" />
                    <div>
                      <span className="font-mono text-base font-bold text-emerald-400 block">100% Free</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Zero Ads • Zero Walls</span>
                    </div>
                    <div className="w-px h-8 bg-obsidian-800" />
                    <div>
                      <span className="font-mono text-base font-bold text-candle-amber block">2,410</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Active Benefactors</span>
                    </div>
                  </div>

                  {/* Frequency Switcher */}
                  <div className="grid grid-cols-2 p-1 rounded-xl bg-obsidian-950 border border-obsidian-800 max-w-xs mx-auto text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setDonationFrequency('monthly')}
                      className={`py-1.5 rounded-lg transition ${
                        donationFrequency === 'monthly'
                          ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Monthly Almsgiving
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationFrequency('one-time')}
                      className={`py-1.5 rounded-lg transition ${
                        donationFrequency === 'one-time'
                          ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      One-Time Gift
                    </button>
                  </div>

                  {/* Benefactor Tiers */}
                  <form onSubmit={handleInlineDonation} className="space-y-3">
                    <div className="space-y-2.5">
                      {benefactorTiers.map((tier) => {
                        const Icon = tier.icon;
                        const isSelected = selectedPlan === tier.id;
                        const price = donationFrequency === 'monthly' ? tier.monthlyPrice : tier.oneTimePrice;

                        return (
                          <div
                            key={tier.id}
                            onClick={() => setSelectedPlan(tier.id)}
                            className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-gold-500/15 border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                                : 'bg-obsidian-950/60 border-obsidian-800 hover:border-obsidian-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected ? 'bg-gold-500/20 border-gold-400 text-gold-300' : 'bg-obsidian-900 border-obsidian-800 text-slate-400'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-serif font-bold text-sm text-slate-100">{tier.name}</h4>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-300 font-mono">
                                    {tier.soulsImpact}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{tier.desc}</p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono text-base font-bold text-gold-300">{currency.symbol}{price.toLocaleString()}</span>
                              <span className="text-[10px] text-slate-500 block">
                                {donationFrequency === 'monthly' ? '/month' : 'one-time'}
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Custom Amount Free-Will Option */}
                      <div
                        onClick={() => setSelectedPlan('custom')}
                        className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2.5 ${
                          selectedPlan === 'custom'
                            ? 'bg-gold-500/15 border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                            : 'bg-obsidian-950/60 border-obsidian-800 hover:border-obsidian-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-gold-400" />
                            <span className="font-serif font-bold text-sm text-slate-100">
                              Custom Free-Will Offering
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-gold-400">Donate what you wish</span>
                        </div>

                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-400 font-mono text-sm font-bold">{currency.symbol}</span>
                          <input
                            type="number"
                            min="1"
                            step="any"
                            placeholder="Enter amount..."
                            value={customAmount}
                            onFocus={() => setSelectedPlan('custom')}
                            onChange={(e) => {
                              setSelectedPlan('custom');
                              setCustomAmount(e.target.value);
                            }}
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 text-slate-100 text-sm font-mono outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Donor Contact Intake (Full Name & Email) */}
                    <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-gold-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-gold-300 font-serif font-bold text-xs">
                        <User className="w-3.5 h-3.5 text-gold-400" />
                        <span>Benefactor Registry & Account</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. John Doe"
                            value={inlineDonorName}
                            onChange={(e) => setInlineDonorName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 text-slate-100 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={inlineDonorEmail}
                            onChange={(e) => setInlineDonorEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 text-slate-100 text-xs font-mono outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Used to send your receipt, link your Holy Mass remembrance, and give you 1-click access to view or cancel subscriptions in your Pilgrim Portal.
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button
                      type="submit"
                      disabled={currentDonation <= 0 || isInlineSubmitting}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-40"
                    >
                      <Heart className="w-4 h-4 fill-obsidian-950" />
                      <span>{isInlineSubmitting ? 'Registering Pledge...' : `Pay It Forward & Keep Lorica Free (${currency.symbol}${Number(currentDonation).toLocaleString()})`}</span>
                    </button>

                    <div className="space-y-1.5 pt-1 text-center">
                      <p className="text-[10px] text-slate-400">
                        Zero commitment • Cancel anytime with one tap • A monthly Holy Mass is offered for all Benefactors
                      </p>
                      <p className="text-[9px] text-slate-500 leading-relaxed max-w-sm mx-auto font-sans">
                        Lorica is developed and maintained by <span className="text-gold-400/90 font-medium">Xydris</span>. All voluntary Pay-It-Forward contributions directly subsidize server infrastructure, vocal recordings, and free access worldwide. Contributions are voluntary digital patronage and not tax-deductible charitable gifts under Section 80G.
                      </p>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-gold-400 uppercase tracking-widest">Covenant Confirmed</span>
                    <h3 className="font-serif text-2xl font-bold text-slate-100">God Bless Your Generosity</h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed pt-1">
                      You have just ensured that souls experiencing sleepless dread, panic, and spiritual combat will find Christ's peace tonight for free.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* ======================================================== */}
      {/* PAGE 2: PRAYER TREASURY PAGE                             */}
      {/* ======================================================== */}
      {currentPage === 'treasury' && (
        <main className="animate-in fade-in duration-300 py-10 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>THE SACRED LIBRARY • 100% FREE</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100">
              Catholic Prayer Treasury
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Foundational prayers, Marian antiphons, traditional litanies, and liturgical guides with authentic studio voice narration and monastic choral accompaniment.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search prayers, litanies, psalms..."
              value={treasurySearch}
              onChange={(e) => setTreasurySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-800 focus:border-gold-500/60 text-slate-100 text-xs font-sans placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* PRAY vs LEARN Primary Switcher */}
          <div className="flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-obsidian-900 border border-obsidian-800 shadow-lg">
              <button
                onClick={() => {
                  setActiveTabGroup('PRAY');
                  setActiveSectionId('prayers');
                }}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider transition ${
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
                className={`px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider transition ${
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
                    ? 'bg-gold-500/20 border border-gold-500/60 text-gold-300 font-bold shadow-md'
                    : 'bg-obsidian-950 border border-obsidian-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>

          {/* Active Category Display */}
          <div className="p-6 sm:p-8 rounded-3xl bg-obsidian-900/60 border border-gold-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-obsidian-800 pb-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-200">{currentSection.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{currentSection.subtitle}</p>
              </div>
            </div>

            {/* Novenas Category Direct Grid */}
            {currentSection.id === 'novenas' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {NOVENAS_DATA
                    .filter((novena) => {
                      if (!treasurySearch) return true;
                      const query = treasurySearch.toLowerCase();
                      return (
                        novena.title.toLowerCase().includes(query) ||
                        (novena.purpose && novena.purpose.toLowerCase().includes(query)) ||
                        (novena.description && novena.description.toLowerCase().includes(query))
                      );
                    })
                    .map((novena) => (
                      <div
                        key={novena.id}
                        onClick={() => onSelectNovena(novena)}
                        className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 hover:border-gold-500/50 hover:bg-obsidian-900 cursor-pointer flex flex-col justify-between gap-3 group transition shadow-md active:scale-99"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 font-bold">
                              {novena.group}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{novena.feastDate}</span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-slate-100 group-hover:text-gold-200 transition">
                            {novena.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {novena.purpose || novena.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-obsidian-800 flex items-center justify-between text-xs text-gold-400 font-medium group-hover:text-gold-300">
                          <span className="font-mono text-[11px]">Begin 9-Day Novena</span>
                          <div className="w-7 h-7 rounded-full bg-obsidian-900 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition shrink-0">
                            <Play className="w-3 h-3 fill-current" />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Seasons Category Direct Display */}
            {currentSection.id === 'seasons' && currentSection.currentSeason && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-obsidian-900 to-obsidian-950 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      CURRENT LITURGICAL SEASON
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Vestment Color: {currentSection.currentSeason.color}</span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-slate-100">{currentSection.currentSeason.name}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{currentSection.currentSeason.meaning}</p>
                  <p className="text-xs text-gold-400/90 pt-1">Next: {currentSection.currentSeason.nextSeason}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {currentSection.calendar.map((c, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h5 className="font-serif font-bold text-sm text-gold-200">{c.name}</h5>
                        <span className="text-[10px] font-mono text-slate-400">{c.color}</span>
                      </div>
                      <p className="text-xs text-slate-400">{c.focus}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bible Verses Category Direct Display */}
            {currentSection.id === 'bible-verses' && currentSection.categories && (
              <div className="space-y-6">
                {currentSection.categories.map((cat, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-serif text-base font-bold text-gold-200 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gold-400" />
                      <span>{cat.topic}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {cat.verses.map((v, vIdx) => (
                        <div key={vIdx} className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-2 flex flex-col justify-between">
                          <p className="font-reading italic text-xs text-slate-300 leading-relaxed">
                            "{v.text}"
                          </p>
                          <span className="text-[11px] font-mono text-gold-400 block pt-1 border-t border-obsidian-850">
                            — {v.ref}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Guides Category Display (LEARN) */}
            {currentSection.id === 'guides' && currentSection.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSection.items
                  .filter(item => !treasurySearch || item.title.toLowerCase().includes(treasurySearch.toLowerCase()))
                  .map((guide, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-3.5 shadow-md">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-gold-400" />
                        <h4 className="font-serif font-bold text-base text-gold-200">{guide.title}</h4>
                      </div>
                      <ol className="space-y-2">
                        {guide.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
              </div>
            )}

            {/* Free Tools Category Display (LEARN) */}
            {currentSection.id === 'free-tools' && currentSection.items && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentSection.items
                  .filter(item => !treasurySearch || (item.name && item.name.toLowerCase().includes(treasurySearch.toLowerCase())) || (item.desc && item.desc.toLowerCase().includes(treasurySearch.toLowerCase())))
                  .map((tool, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 hover:border-gold-500/40 transition space-y-3 shadow-md flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 font-bold">
                            FREE SANCTUARY TOOL
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-base text-slate-100">{tool.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{tool.desc}</p>
                      </div>
                      <button
                        onClick={onLaunchApp}
                        className="w-full py-2.5 rounded-xl bg-obsidian-900 border border-gold-500/30 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition flex items-center justify-center gap-2 shadow"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Launch in Sanctuary App</span>
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Explained Category Display (LEARN) */}
            {currentSection.id === 'explained' && currentSection.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSection.items
                  .filter(item => !treasurySearch || (item.q && item.q.toLowerCase().includes(treasurySearch.toLowerCase())) || (item.a && item.a.toLowerCase().includes(treasurySearch.toLowerCase())))
                  .map((faq, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-2.5 shadow-md">
                      <h4 className="font-serif font-bold text-sm text-gold-200 flex items-start gap-2">
                        <span className="text-gold-400 font-mono text-xs mt-0.5">Q.</span>
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed pl-4 border-l-2 border-gold-500/30">
                        {faq.a}
                      </p>
                    </div>
                  ))}
              </div>
            )}

            {/* Prayers / Items in Section (PRAY) */}
            {activeTabGroup === 'PRAY' && currentSection.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentSection.items
                  .filter((item) => {
                    if (!treasurySearch) return true;
                    const query = treasurySearch.toLowerCase();
                    return (
                      (item.title && item.title.toLowerCase().includes(query)) ||
                      (item.name && item.name.toLowerCase().includes(query)) ||
                      (item.desc && item.desc.toLowerCase().includes(query))
                    );
                  })
                  .map((item, idx) => {
                    const existing = PRAYERS_DATA.find(p => p.id === item.prayerId || p.id === item.id);
                    return (
                      <div
                        key={idx}
                        onClick={() => {
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
                        className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 hover:border-gold-500/50 hover:bg-obsidian-900 cursor-pointer flex items-center justify-between gap-3 group transition shadow-md active:scale-99"
                      >
                        <div className="space-y-1">
                          <h4 className="font-serif text-sm font-bold text-slate-100 group-hover:text-gold-200 transition">
                            {item.title || item.name}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {item.desc || item.theme}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5">
                            {item.duration && (
                              <span className="text-[10px] text-gold-400 font-mono">{item.duration}</span>
                            )}
                            {existing && existing.verses && (
                              <span className="text-[10px] text-slate-500 font-mono">• {existing.verses.length} verses</span>
                            )}
                          </div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-obsidian-900 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition shrink-0 shadow">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Patron Saints Directory Preview */}
            {currentSection.isPatronDirectory && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentSection.patrons.map((patron) => (
                  <div
                    key={patron.id}
                    className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-2.5 flex flex-col justify-between"
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
                      className="w-full mt-2 py-2 rounded-xl bg-obsidian-900 border border-gold-500/30 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Pray Intercession</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* PAGE 3: NOVENAS DIRECTORY PAGE                           */}
      {/* ======================================================== */}
      {currentPage === 'novenas' && (
        <main className="animate-in fade-in duration-300 py-10 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>9-DAY SACRED DEVOTIONS • SCUTUM FIDEI</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100">
              Catholic Novenas Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              All 12 complete traditional Catholic novenas. Each devotion includes the full 9 days of prayers, daily intentions, Scripture meditations, authentic studio audio tracks, and the complete 5-decade Holy Rosary integrated according to liturgical tradition.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setNovenaFilter('all')}
              className={`text-xs px-4 py-2 rounded-xl transition ${
                novenaFilter === 'all'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'bg-obsidian-900 border border-obsidian-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All 12 Novenas
            </button>
            <button
              onClick={() => setNovenaFilter('marian')}
              className={`text-xs px-4 py-2 rounded-xl transition ${
                novenaFilter === 'marian'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'bg-obsidian-900 border border-obsidian-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Marian Devotions
            </button>
            <button
              onClick={() => setNovenaFilter('patron')}
              className={`text-xs px-4 py-2 rounded-xl transition ${
                novenaFilter === 'patron'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'bg-obsidian-900 border border-obsidian-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Patron Saints & Apostles
            </button>
            <button
              onClick={() => setNovenaFilter('christ')}
              className={`text-xs px-4 py-2 rounded-xl transition ${
                novenaFilter === 'christ'
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                  : 'bg-obsidian-900 border border-obsidian-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Sacred Heart & Holy Spirit
            </button>
          </div>

          {/* Grid of Novenas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNovenas.map((novena) => (
              <div
                key={novena.id}
                onClick={() => onSelectNovena(novena)}
                className="cursor-pointer p-5 rounded-2xl bg-obsidian-900/90 border border-obsidian-800 hover:border-gold-500/50 hover:bg-obsidian-850 transition-all flex flex-col justify-between space-y-4 group shadow-xl active:scale-99 hover:-translate-y-1 duration-200"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-semibold">
                      {novena.group}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{novena.feastDate}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-slate-100 group-hover:text-gold-200 transition">
                    {novena.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {novena.purpose || novena.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-obsidian-800 flex items-center justify-between text-xs text-gold-400 font-medium group-hover:text-gold-300">
                  <span className="font-mono text-[11px]">Begin 9-Day Novena</span>
                  <div className="w-7 h-7 rounded-full bg-obsidian-950 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition shrink-0">
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* PAGE 4: SPIRIT WARFARE PAGE                              */}
      {/* ======================================================== */}
      {currentPage === 'warfare' && (
        <main className="animate-in fade-in duration-300 py-10 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-medium">
              <Sword className="w-3.5 h-3.5 text-red-400" />
              <span>EPHESIANS 6:11 • SCUTUM FIDEI</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100">
              Spirit Warfare & Sacred Protection
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Centuries of liturgical armor against spiritual assault, demonic oppression, sleepless panic, and nocturnal fear. Deployed instantly with zero delay.
            </p>
          </div>

          {/* Emergency Crisis Carousel */}
          <section className="p-6 rounded-3xl bg-obsidian-900/60 border border-red-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-candle-flame" />
                  Need Reinforcements? Immediate Crisis Shield
                </h2>
                <p className="text-xs text-slate-400">One-tap immediate refuge for difficult moments</p>
              </div>
              <span className="text-[11px] text-gold-400/80 font-mono">0-sec delay</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CRISIS_CAROUSEL.map((item) => {
                const prayer = PRAYERS_DATA.find(p => p.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => prayer && onPlayPrayer(prayer)}
                    className={`flex flex-col items-start p-4 rounded-2xl border ${item.color} hover:border-gold-400/60 hover:bg-obsidian-850 transition-all text-left group shadow-lg active:scale-98`}
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

          {/* Featured Primary Weapons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRAYERS_DATA.filter(p => p.category === 'Spiritual Warfare' || p.id === 'psalm-91').map((prayer) => (
              <div
                key={prayer.id}
                onClick={() => onPlayPrayer(prayer)}
                className="cursor-pointer p-5 rounded-2xl bg-obsidian-900/90 border border-obsidian-800 hover:border-gold-500/50 hover:bg-obsidian-850 transition-all flex flex-col justify-between space-y-3 group shadow-xl active:scale-99"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold">
                      {prayer.tag || "Spiritual Weapon"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{prayer.duration}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-slate-100 group-hover:text-gold-200 transition">
                    {prayer.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {prayer.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-obsidian-800 flex items-center justify-between text-xs text-gold-400 font-medium group-hover:text-gold-300">
                  <span className="font-mono text-[11px]">Deploy Spiritual Armor</span>
                  <div className="w-7 h-7 rounded-full bg-obsidian-950 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition shrink-0">
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SCRIPTURAL ARMOR OF GOD BREAKDOWN */}
          <section className="p-6 sm:p-8 rounded-3xl bg-obsidian-900 border border-gold-500/30 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest">PAULINE LITURGICAL DOCTRINE</span>
              <h3 className="font-serif text-2xl font-bold text-slate-100">The Whole Armour of God (Ephesians 6:10–18)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1">
                <span className="font-bold text-gold-300 font-serif">1. Cingulum Veritatis</span>
                <p className="text-slate-400">The Belt of Truth: Fastening the mind to divine truth against the deceit and illusions of the adversary.</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1">
                <span className="font-bold text-gold-300 font-serif">2. Lorica Justitiae</span>
                <p className="text-slate-400">The Breastplate of Righteousness (Lorica): Shielding the vital center of the soul by grace and sacramental confession.</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1">
                <span className="font-bold text-gold-300 font-serif">3. Calceamentum Evangelii</span>
                <p className="text-slate-400">Feet Shod with the Gospel of Peace: Standing firm in Christ's peace regardless of tribulations or unrest.</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1">
                <span className="font-bold text-gold-300 font-serif">4. Scutum Fidei</span>
                <p className="text-slate-400">The Shield of Faith: Quenching all the fiery darts of the wicked one through unshakeable trust in the Cross.</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1">
                <span className="font-bold text-gold-300 font-serif">5. Galea Salutis</span>
                <p className="text-slate-400">The Helmet of Salvation: Guarding the thoughts, mind, and imagination from despair and demonic lies.</p>
              </div>
              <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-1">
                <span className="font-bold text-gold-300 font-serif">6. Gladius Spiritus</span>
                <p className="text-slate-400">The Sword of the Spirit: The Living Word of God, Psalms, and Sacred Latin liturgy driving back the darkness.</p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ======================================================== */}
      {/* 7. GLOBAL FOOTER                                         */}
      {/* ======================================================== */}
      <footer className="mt-20 border-t border-obsidian-800/80 bg-obsidian-950/90 pt-14 pb-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigateTo('home')}>
              <img 
                src="/logo.jpg" 
                alt="Lorica Logo" 
                className="w-9 h-9 rounded-xl object-contain border border-gold-500/40" 
              />
              <span className="font-serif font-bold text-lg tracking-wider text-gold-100">LORICA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Catholic spiritual armor, loopable night psalms, and complete 9-day novenas with authentic studio recordings and monastic choral accompaniment.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-200 uppercase tracking-wider block font-mono text-[11px]">PAGES</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => navigateTo('home')} className="hover:text-gold-300 text-left">Home</button></li>
              <li><button onClick={() => navigateTo('treasury')} className="hover:text-gold-300 text-left">Prayer Treasury</button></li>
              <li><button onClick={() => navigateTo('novenas')} className="hover:text-gold-300 text-left">12 Catholic Novenas</button></li>
              <li><button onClick={() => navigateTo('warfare')} className="hover:text-gold-300 text-left">Spirit Warfare & SOS</button></li>
            </ul>
          </div>

          {/* Col 3: Spiritual Treasury */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-200 uppercase tracking-wider block font-mono text-[11px]">LEARN & DEVOTION</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><button onClick={() => { navigateTo('treasury'); setActiveTabGroup('LEARN'); setActiveSectionId('guides'); }} className="hover:text-gold-300 text-left">How to Pray Novenas</button></li>
              <li><button onClick={() => { navigateTo('treasury'); setActiveTabGroup('LEARN'); setActiveSectionId('guides'); }} className="hover:text-gold-300 text-left">Lectio Divina Guide</button></li>
              <li><button onClick={() => { navigateTo('treasury'); setActiveTabGroup('LEARN'); setActiveSectionId('doctrine'); }} className="hover:text-gold-300 text-left">Examination of Conscience</button></li>
              <li><button onClick={() => navigateTo('warfare')} className="hover:text-gold-300 text-left">Spiritual Warfare Explained</button></li>
              <li><button onClick={() => { const p = PRAYERS_DATA.find(x => x.id === 'psalm-91'); if (p) onPlayPrayer(p); }} className="hover:text-gold-300 text-left">Psalm 91 Sleep Loop</button></li>
            </ul>
          </div>

          {/* Col 4: Tools, Legal & Contact */}
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-200 uppercase tracking-wider block font-mono text-[11px]">ABOUT & CONTACT</span>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="/about.html" className="hover:text-gold-300 block">About Lorica</a></li>
              <li><a href="/contact.html" className="hover:text-gold-300 block">Contact Us</a></li>
              <li><a href="mailto:info@xydris.in" className="hover:text-gold-300 text-gold-400 flex items-center gap-1">info@xydris.in</a></li>
              <li><a href="/privacy.html" className="hover:text-gold-300 block">Privacy Policy</a></li>
              <li><a href="/terms.html" className="hover:text-gold-300 block">Terms of Service</a></li>
              <li><a href="/llms.txt" className="hover:text-gold-300 block font-mono text-[10px]">llms.txt (Agent Index)</a></li>
              <li><button onClick={onOpenBenefactor} className="hover:text-gold-300 text-left flex items-center gap-1.5 pt-1"><Heart className="w-3.5 h-3.5 text-red-400" /> Pay It Forward</button></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-obsidian-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <p>© 2026 Lorica. Maintained by <a href="https://xydris.in" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 underline underline-offset-2">Xydris.in</a> • Inquiries: <a href="mailto:info@xydris.in" className="text-slate-300 hover:text-gold-300">info@xydris.in</a></p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[10px] text-slate-400">
              <a href="/about.html" className="hover:text-gold-300">About</a>
              <span>•</span>
              <a href="/contact.html" className="hover:text-gold-300">Contact</a>
              <span>•</span>
              <a href="/privacy.html" className="hover:text-gold-300">Privacy Policy</a>
              <span>•</span>
              <a href="/terms.html" className="hover:text-gold-300">Terms</a>
              <span>•</span>
              <a href="/llms.txt" className="hover:text-gold-300 font-mono">llms.txt</a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gold-400/70 font-serif italic">
            <span>Benedicat vos omnipotens Deus</span><a href="#admin" title="Admin" className="opacity-0 hover:opacity-100 text-[10px] text-slate-700 transition cursor-default select-none">•</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
