import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Bell, 
  BookOpen, 
  Cross, 
  Heart, 
  ChevronDown,
  ChevronUp,
  Disc,
  Layers
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { downloadNovenaICS, openGoogleCalendarNovena, syncLoricaInAppNovena } from '../utils/calendarExport';
import { ROSARY_MYSTERIES, getTodayMystery } from '../data/rosaryData';

export default function NovenaDetailModal({ novena, isOpen, onClose, onPlayAudio }) {
  const [activeDay, setActiveDay] = useState(1);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [calendarNotification, setCalendarNotification] = useState(null);
  
  // Rosary Mysteries State
  const [selectedMysteryKey, setSelectedMysteryKey] = useState(() => {
    const today = getTodayMystery();
    return today.id || 'joyful';
  });
  const [activeDecadeTab, setActiveDecadeTab] = useState(1); // 1, 2, 3, 4, 5
  const [expandedDecades, setExpandedDecades] = useState({ 1: true, 2: false, 3: false, 4: false, 5: false });

  if (!isOpen || !novena) return null;

  const currentDayData = novena.days.find(d => d.day === activeDay) || novena.days[0];
  const activeMystery = ROSARY_MYSTERIES[selectedMysteryKey] || ROSARY_MYSTERIES.joyful;

  const toggleDecade = (num) => {
    setExpandedDecades(prev => ({
      ...prev,
      [num]: !prev[num]
    }));
  };

  const handlePrayDay = () => {
    soundEngine.init();
    soundEngine.playBell(587.33);
    
    // Synthesize full liturgical prayer verses with 5 decades for audio player
    onPlayAudio({
      id: `${novena.id}-day-${activeDay}`,
      title: `${novena.title} — Day ${activeDay}`,
      category: `9-Day Novena • ${novena.group}`,
      duration: "18:45",
      description: `${currentDayData.title || `Day ${activeDay}`} • With 5 Decades of the Holy Rosary (${activeMystery.name})`,
      narratorTrack: currentDayData.narratorTrack,
      narratorName: currentDayData.narratorName || novena.narratorName,
      audioTrack: "/audio/gregorian_chant_cathedral.ogg",
      chantName: `Novena & 5-Decade Rosary Choral`,
      verses: [
        { 
          id: 1, 
          text: `In the Name of the Father, and of the Son, and of the Holy Spirit. Amen. O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love.` 
        },
        { 
          id: 2, 
          text: `The First 3 Decades of the Holy Rosary: ${activeMystery.name}. 1st Decade: ${activeMystery.decades[0].title}. Fruit: ${activeMystery.decades[0].fruit}. ${activeMystery.decades[0].meditation}` 
        },
        { 
          id: 3, 
          text: `2nd Decade: ${activeMystery.decades[1].title}. Fruit: ${activeMystery.decades[1].fruit}. ${activeMystery.decades[1].meditation}` 
        },
        { 
          id: 4, 
          text: `3rd Decade: ${activeMystery.decades[2].title}. Fruit: ${activeMystery.decades[2].fruit}. ${activeMystery.decades[2].meditation}` 
        },
        { 
          id: 5, 
          text: `${novena.title}. ${currentDayData.title || `Day ${activeDay}`}. Intention: ${currentDayData.intention || ''}. ${currentDayData.scripture ? `Scripture: ${currentDayData.scripture}.` : ''}` 
        },
        { 
          id: 6, 
          text: currentDayData.prayer 
        },
        { 
          id: 7, 
          text: `Pause in the silence of your heart to present your personal petitions before God and Our Lady.` 
        },
        { 
          id: 8, 
          text: `The Final 2 Decades of the Holy Rosary: 4th Decade: ${activeMystery.decades[3].title}. Fruit: ${activeMystery.decades[3].fruit}. ${activeMystery.decades[3].meditation}` 
        },
        { 
          id: 9, 
          text: `5th Decade: ${activeMystery.decades[4].title}. Fruit: ${activeMystery.decades[4].fruit}. ${activeMystery.decades[4].meditation}` 
        },
        { 
          id: 10, 
          text: `Our Father, who art in heaven, hallowed be Thy name. Thy kingdom come, Thy will be done on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses as we forgive those who trespass against us, and lead us not into temptation, but deliver us from evil. Amen.` 
        },
        { 
          id: 11, 
          text: `Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.` 
        },
        { 
          id: 12, 
          text: `Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.` 
        },
        { 
          id: 13, 
          text: `${novena.closingPrayer || ''} ${novena.closingInvocation || 'Amen.'}` 
        }
      ]
    });
  };

  const handleAddToCalendar = (type) => {
    soundEngine.init();
    soundEngine.playBell(523.25);

    if (type === 'ics') {
      downloadNovenaICS(novena, new Date());
      showToast("✓ Downloaded 9-Day .ics calendar file for Apple/Outlook!");
    } else if (type === 'gcal') {
      openGoogleCalendarNovena(novena, new Date());
      showToast("✓ Opened Google Calendar with 9-day daily series!");
    } else if (type === 'lorica') {
      syncLoricaInAppNovena(novena, activeDay);
      showToast("✓ Synced with Lorica Liturgical Calendar!");
    }
    setShowCalendarMenu(false);
  };

  const showToast = (msg) => {
    setCalendarNotification(msg);
    setTimeout(() => setCalendarNotification(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-obsidian-900 border border-gold-500/40 p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.85)] space-y-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-obsidian-800 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-semibold tracking-wider">
              {novena.group.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              Feast: {novena.feastDate}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
              <Layers className="w-3 h-3 text-amber-400" />
              5 Decades of the Rosary
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Calendar Sync Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-gold-500/30 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 transition active:scale-95 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add 9 Days to Calendar</span>
                <span className="sm:hidden">Calendar</span>
              </button>

              {showCalendarMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-obsidian-950 border border-gold-500/40 shadow-2xl z-50 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 px-3 py-1 uppercase tracking-wider border-b border-obsidian-800">
                    Sync 9-Day Journey
                  </div>
                  
                  <button
                    onClick={() => handleAddToCalendar('gcal')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-200 hover:bg-gold-500/10 hover:text-gold-200 transition"
                  >
                    <ExternalLink className="w-4 h-4 text-gold-400 shrink-0" />
                    <div>
                      <div className="font-semibold">Google Calendar</div>
                      <span className="text-[10px] text-slate-400">Add 9 recurring daily prayer events</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAddToCalendar('ics')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-200 hover:bg-gold-500/10 hover:text-gold-200 transition"
                  >
                    <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold">Apple / Outlook (.ics)</div>
                      <span className="text-[10px] text-slate-400">Downloads 9 daily events with full prayer text</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAddToCalendar('lorica')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-200 hover:bg-gold-500/10 hover:text-gold-200 transition"
                  >
                    <Flame className="w-4 h-4 text-candle-flame shrink-0" />
                    <div>
                      <div className="font-semibold">Lorica Liturgical Calendar</div>
                      <span className="text-[10px] text-slate-400">Track daily novena inside app</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-obsidian-800 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Novena Devotional Body */}
        <div className="overflow-y-auto space-y-6 pr-1 -mr-1">
          
          {/* Novena Title & Description */}
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">{novena.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{novena.purpose}</p>
          </div>

          {/* Toast Notification */}
          {calendarNotification && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{calendarNotification}</span>
            </div>
          )}

          {/* Day Selector Pills (Days 1 to 9) */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Select Day of Novena:
            </span>
            <div className="grid grid-cols-9 gap-1 sm:gap-2">
              {novena.days.map((d) => (
                <button
                  key={d.day}
                  onClick={() => {
                    soundEngine.playBell(440);
                    setActiveDay(d.day);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeDay === d.day
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                      : 'bg-obsidian-950 border border-obsidian-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {d.day}
                </button>
              ))}
            </div>
          </div>

          {/* COMPLETE NOVENA ON THE ROSARY RITE */}
          <div className="space-y-5">
            
            {/* 1. DAY BANNER & AUDIO TRIGGER */}
            <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-950 border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div>
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block font-bold">
                  DAY {activeDay} OF 9 DEVOTION
                </span>
                <h3 className="font-serif font-bold text-lg text-gold-200">
                  {currentDayData.title || `Day ${activeDay}`}
                </h3>
                {currentDayData.intention && (
                  <p className="text-xs text-slate-300 mt-1 font-sans">
                    <strong className="text-gold-300">Intention:</strong> {currentDayData.intention}
                  </p>
                )}
                {currentDayData.scripture && (
                  <p className="text-xs text-slate-400 mt-0.5 font-reading italic">
                    {currentDayData.scripture}
                  </p>
                )}
              </div>

              <button
                onClick={handlePrayDay}
                className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-xs hover:brightness-110 active:scale-95 transition shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-obsidian-950" />
                <span>Pray with Audio</span>
              </button>
            </div>

            {/* 2. STEP 1: OPENING RITE & ACT OF CONTRITION */}
            <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-3">
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block font-bold">
                1. OPENING RITE • SIGN OF THE CROSS & ACT OF CONTRITION
              </span>
              <div className="text-xs sm:text-sm text-slate-200 font-reading leading-relaxed space-y-2">
                <p className="font-semibold text-gold-300 font-mono text-xs">
                  + In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.
                </p>
                <p>
                  <strong className="text-slate-100 block not-italic mb-0.5 font-mono text-[11px] text-gold-400">ACT OF CONTRITION (ACTUS CONTRITIONIS):</strong>
                  "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve with the help of Thy grace to sin no more and to avoid the near occasion of sin. Amen."
                </p>
              </div>
            </div>

            {/* 3. STEP 2: FIRST 3 DECADES OF THE ROSARY */}
            <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-950 border border-gold-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block font-bold">
                    2. FIRST THREE DECADES OF THE ROSARY
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Prayed before the daily Novena meditation
                  </span>
                </div>

                {/* Mystery Selector Tabs */}
                <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-obsidian-800">
                  {Object.keys(ROSARY_MYSTERIES).map((k) => (
                    <button
                      key={k}
                      onClick={() => setSelectedMysteryKey(k)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                        selectedMysteryKey === k
                          ? 'bg-gold-500 text-obsidian-950 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {ROSARY_MYSTERIES[k].name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gold-300/90 font-mono flex items-center justify-between">
                <span>Active: <strong>{activeMystery.name}</strong> ({activeMystery.traditionalDays})</span>
                <span className="text-[10px] text-slate-400">Decades 1, 2 & 3</span>
              </div>

              {/* Decades 1, 2, and 3 */}
              <div className="space-y-3">
                {activeMystery.decades.slice(0, 3).map((dec) => (
                  <div 
                    key={dec.decade}
                    className="rounded-xl bg-obsidian-900/70 border border-obsidian-800 p-3.5 space-y-2"
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleDecade(dec.decade)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-mono font-bold flex items-center justify-center">
                          {dec.decade}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-slate-100">{dec.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Fruit: {dec.fruit}
                        </span>
                        {expandedDecades[dec.decade] ? (
                          <ChevronUp className="w-4 h-4 text-gold-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-reading leading-relaxed">
                      {dec.meditation}
                    </p>

                    {expandedDecades[dec.decade] && (
                      <div className="pt-2 border-t border-obsidian-800/80 space-y-2 text-xs text-slate-300 font-reading">
                        <div className="text-[11px] font-mono text-gold-400 italic">
                          Scripture: {dec.scripture}
                        </div>
                        <div className="p-2.5 rounded-lg bg-obsidian-950 border border-obsidian-800 text-[11px] text-slate-300 space-y-1">
                          <div><strong>1x Our Father:</strong> Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven...</div>
                          <div><strong>10x Hail Mary:</strong> Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus...</div>
                          <div><strong>1x Glory Be & Fatima:</strong> Glory be to the Father, and to the Son, and to the Holy Spirit... O My Jesus, forgive us our sins, save us from the fires of hell...</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. STEP 3: DAILY NOVENA MEDITATION & SPECIFIC PETITION */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-amber-950/20 border border-gold-500/40 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-obsidian-800 pb-2">
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block font-bold">
                  3. DAILY NOVENA MEDITATION (DAY {activeDay})
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Voice: {currentDayData.narratorName || novena.narratorName}
                </span>
              </div>
              
              <p className="font-reading text-sm sm:text-base text-slate-100 leading-relaxed italic whitespace-pre-line">
                "{currentDayData.prayer}"
              </p>
            </div>

            {/* 5. STEP 4: PERSONAL PETITION (SILENCE OF THE HEART) */}
            <div className="p-4 rounded-2xl bg-obsidian-950 border border-amber-500/30 flex items-center gap-3 text-xs sm:text-sm text-amber-200/90 font-sans shadow-sm">
              <Flame className="w-5 h-5 text-candle-flame shrink-0 animate-pulse" />
              <span>
                <strong>Place your intention before God:</strong> Pause in the silence of your heart to name your specific intention for this 9-day novena...
              </span>
            </div>

            {/* 6. STEP 5: FINAL 2 DECADES OF THE ROSARY */}
            <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-950 border border-gold-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-obsidian-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block font-bold">
                    4. FINAL TWO DECADES OF THE ROSARY
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Completing the 5-decade Holy Rosary
                  </span>
                </div>
                <span className="text-xs text-gold-300/90 font-mono">
                  {activeMystery.name} • Decades 4 & 5
                </span>
              </div>

              {/* Decades 4 and 5 */}
              <div className="space-y-3">
                {activeMystery.decades.slice(3, 5).map((dec) => (
                  <div 
                    key={dec.decade}
                    className="rounded-xl bg-obsidian-900/70 border border-obsidian-800 p-3.5 space-y-2"
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleDecade(dec.decade)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-mono font-bold flex items-center justify-center">
                          {dec.decade}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-slate-100">{dec.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Fruit: {dec.fruit}
                        </span>
                        {expandedDecades[dec.decade] ? (
                          <ChevronUp className="w-4 h-4 text-gold-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-reading leading-relaxed">
                      {dec.meditation}
                    </p>

                    {expandedDecades[dec.decade] && (
                      <div className="pt-2 border-t border-obsidian-800/80 space-y-2 text-xs text-slate-300 font-reading">
                        <div className="text-[11px] font-mono text-gold-400 italic">
                          Scripture: {dec.scripture}
                        </div>
                        <div className="p-2.5 rounded-lg bg-obsidian-950 border border-obsidian-800 text-[11px] text-slate-300 space-y-1">
                          <div><strong>1x Our Father:</strong> Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven...</div>
                          <div><strong>10x Hail Mary:</strong> Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus...</div>
                          <div><strong>1x Glory Be & Fatima:</strong> Glory be to the Father, and to the Son, and to the Holy Spirit... O My Jesus, forgive us our sins, save us from the fires of hell...</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 7. STEP 6: LITURGICAL DECADES TEXT REFERENCE (FULL TEXT OF CORE PRAYERS) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-4">
              <div className="flex items-center justify-between border-b border-obsidian-800 pb-2">
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block font-bold">
                  5. CORE ROSARY PRAYERS • FULL LITURGICAL TEXT
                </span>
                <span className="text-[10px] font-mono text-slate-400">Traditional Latin & English Rite</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 font-reading leading-relaxed">
                <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-obsidian-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-gold-300 font-mono text-xs not-italic">
                      THE LORD'S PRAYER • PATER NOSTER
                    </strong>
                    <span className="text-[10px] font-mono text-gold-400/80">Matthew 6:9-13</span>
                  </div>
                  <p className="text-slate-200">
                    Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-obsidian-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-gold-300 font-mono text-xs not-italic">
                      THE ANGELIC SALUTATION • AVE MARIA
                    </strong>
                    <span className="text-[10px] font-mono text-gold-400/80">Luke 1:28, 42</span>
                  </div>
                  <p className="text-slate-200">
                    Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-obsidian-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-gold-300 font-mono text-xs not-italic">
                      THE MINOR DOXOLOGY • GLORIA PATRI
                    </strong>
                    <span className="text-[10px] font-mono text-gold-400/80">Apostolic Doxology</span>
                  </div>
                  <p className="text-slate-200">
                    Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.
                  </p>
                </div>
              </div>
            </div>

            {/* 8. STEP 7: SOLEMN CLOSING NOVENA PRAYER */}
            {novena.closingPrayer && (
              <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-900/70 border border-gold-500/30 space-y-2.5">
                <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block font-bold">
                  6. SOLEMN CLOSING NOVENA PRAYER
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-reading leading-relaxed italic">
                  "{novena.closingPrayer}"
                </p>
                {novena.closingInvocation && (
                  <p className="text-xs text-gold-300 font-mono font-bold pt-1">
                    {novena.closingInvocation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="pt-4 border-t border-obsidian-800 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <button
            onClick={() => setActiveDay(Math.max(1, activeDay - 1))}
            disabled={activeDay === 1}
            className="flex items-center gap-1 hover:text-gold-300 disabled:opacity-30 transition px-2 py-1 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Day
          </button>
          
          <button
            onClick={handlePrayDay}
            className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:brightness-110 active:scale-95 transition flex items-center gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-obsidian-950" />
            <span>Pray Day {activeDay} with 5 Decades</span>
          </button>

          <button
            onClick={() => setActiveDay(Math.min(9, activeDay + 1))}
            disabled={activeDay === 9}
            className="flex items-center gap-1 hover:text-gold-300 disabled:opacity-30 transition px-2 py-1 rounded-lg"
          >
            Next Day <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
