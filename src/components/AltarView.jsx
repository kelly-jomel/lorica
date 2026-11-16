import React, { useState } from 'react';
import { Flame, Plus, Heart, Share2, Clock, Sparkles, X, Shield, Bell } from 'lucide-react';
import { CANDLE_TYPES } from '../data/candlesData';
import { soundEngine } from '../services/soundEngine';

export default function AltarView({ candles, onAddCandle }) {
  const [selectedCandle, setSelectedCandle] = useState(null);
  const [isLightingModalOpen, setIsLightingModalOpen] = useState(false);
  const [joinedPrayers, setJoinedPrayers] = useState({});

  // New candle form state
  const [name, setName] = useState('');
  const [intention, setIntention] = useState('');
  const [litBy, setLitBy] = useState('');
  const [selectedType, setSelectedType] = useState(CANDLE_TYPES[0].id);

  const handleLightCandleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !intention.trim()) return;

    soundEngine.playBell(392); // G4 resonant sanctuary bell

    const newCandle = {
      id: `candle-${Date.now()}`,
      name: name.trim(),
      intention: intention.trim(),
      litBy: litBy.trim() || 'Anonymous Pilgrim',
      type: CANDLE_TYPES.find(t => t.id === selectedType)?.name || 'Vigil Candle',
      hoursRemaining: selectedType === 'sanctuary' ? 168 : 48,
      flameIntensity: 1.0,
      color: selectedType === 'sanctuary' ? 'amber' : 'gold'
    };

    onAddCandle(newCandle);
    setName('');
    setIntention('');
    setLitBy('');
    setIsLightingModalOpen(false);
  };

  const handleJoinPrayer = (candleId) => {
    soundEngine.playBell(523.25); // C5 bright chime
    setJoinedPrayers(prev => ({
      ...prev,
      [candleId]: (prev[candleId] || 0) + 1
    }));
  };

  return (
    <div className="space-y-6 pb-28 pt-2">
      {/* Altar Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-bold text-gold-200 flex items-center gap-2">
            <Flame className="w-5 h-5 text-candle-flame" />
            The Household Vigil
          </h2>
          <p className="text-xs text-slate-400">
            A perpetual sanctuary of prayer for your family, departed souls, and urgent intentions.
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.init();
            setIsLightingModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-candle-glow to-candle-flame text-obsidian-950 font-semibold text-xs shadow-[0_0_15px_rgba(255,158,64,0.4)] hover:brightness-110 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Light Candle</span>
        </button>
      </div>

      {/* The Sacred Altar Table (Visual Candle Shelf) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-obsidian-900 via-obsidian-850 to-obsidian-950 border border-gold-500/20 p-6 shadow-2xl min-h-[380px] flex flex-col justify-between">
        {/* Ambient Chapel Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-candle-glow/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-950/80 border border-gold-500/20 text-[10px] text-gold-300 font-mono tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-gold-400" />
          {candles.length} Candles Burning Before the Cross
        </div>

        {/* Floating Candles Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-14 pb-8">
          {candles.map((candle) => {
            const extraPrayers = joinedPrayers[candle.id] || 0;
            return (
              <div
                key={candle.id}
                onClick={() => setSelectedCandle(candle)}
                className="group cursor-pointer flex flex-col items-center justify-end transition-transform hover:-translate-y-1 active:scale-95"
              >
                {/* Candle Visual */}
                <div className="relative flex flex-col items-center mb-2">
                  {/* Aura Glow */}
                  <div className="candle-glow-aura" />
                  {/* Flame */}
                  <div className="candle-flame">
                    <div className="candle-flame-inner" />
                  </div>
                  {/* Wick */}
                  <div className="candle-wick" />

                  {/* Wax Pillar Glass Body */}
                  <div className={`w-12 h-20 rounded-t-lg rounded-b-md border shadow-lg relative overflow-hidden transition-all ${
                    candle.color === 'amber' 
                      ? 'bg-gradient-to-b from-amber-600/60 to-red-950/90 border-amber-500/40 shadow-[0_0_15px_rgba(217,119,6,0.3)]'
                      : candle.color === 'red'
                      ? 'bg-gradient-to-b from-red-600/60 to-red-950/90 border-red-500/40 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                      : candle.color === 'emerald'
                      ? 'bg-gradient-to-b from-emerald-600/60 to-emerald-950/90 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-gradient-to-b from-yellow-500/60 to-amber-950/90 border-gold-500/40 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  }`}>
                    {/* Candle Glass Reflection */}
                    <div className="absolute top-0 left-1 w-1.5 h-full bg-white/15 rounded-full blur-[0.5px]" />
                    <div className="absolute bottom-1 right-1 text-[7px] font-mono text-white/40">
                      {candle.hoursRemaining}h
                    </div>
                  </div>
                </div>

                {/* Candle Label */}
                <div className="text-center max-w-[120px]">
                  <span className="text-xs font-medium text-slate-200 line-clamp-1 group-hover:text-gold-300 transition">
                    {candle.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    by {candle.litBy}
                  </span>
                  {extraPrayers > 0 && (
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-gold-500/20 text-gold-300 font-mono">
                      +{extraPrayers} prayers
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Polished Altar Wood Table Surface */}
        <div className="relative z-10 w-full h-4 rounded-xl bg-gradient-to-r from-amber-950 via-[#2E1A0C] to-amber-950 border-t-2 border-amber-600/40 shadow-[0_-4px_20px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Altar Devotion Note */}
      <div className="p-4 rounded-2xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-300 flex items-start gap-3">
        <Shield className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-gold-300">The Power of the Vigil</span>
          <p className="text-slate-400 mt-1 leading-relaxed">
            In Catholic tradition, leaving a vigil candle burning symbolizes our prayers continuing before the Lord even when we are asleep or engaged in daily duties.
          </p>
        </div>
      </div>

      {/* Intention Parchment Modal */}
      {selectedCandle && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-gold-500/40 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedCandle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Flame Preview */}
              <div className="relative w-8 h-8 mb-4">
                <div className="candle-glow-aura" />
                <div className="candle-flame" />
              </div>

              <span className="text-[11px] font-mono text-gold-400 tracking-wider uppercase mb-1">
                {selectedCandle.type}
              </span>
              <h3 className="font-serif text-lg font-bold text-slate-100">
                {selectedCandle.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Offered by {selectedCandle.litBy}
              </p>

              {/* Intention Parchment Card */}
              <div className="w-full p-4 rounded-2xl bg-obsidian-950/80 border border-gold-500/20 text-left mb-5">
                <span className="text-[10px] text-gold-400/80 font-mono uppercase block mb-1">
                  Prayer Intention:
                </span>
                <p className="font-reading italic text-sm text-slate-200 leading-relaxed">
                  "{selectedCandle.intention}"
                </p>
              </div>

              <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-5 px-1">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  {selectedCandle.hoursRemaining} hours remaining
                </span>
                <span className="text-emerald-400 font-medium">Active Flame</span>
              </div>

              {/* Action Buttons */}
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleJoinPrayer(selectedCandle.id)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-300 font-semibold text-xs hover:bg-gold-500/25 active:scale-95 transition"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Join Prayer ({joinedPrayers[selectedCandle.id] || 0})</span>
                </button>
                <button
                  onClick={() => setSelectedCandle(null)}
                  className="py-2.5 px-3 rounded-xl bg-obsidian-800 border border-obsidian-700 text-slate-200 text-xs font-medium hover:bg-obsidian-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "+ Light a Candle" Modal */}
      {isLightingModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-obsidian-850 to-obsidian-900 border border-candle-glow/40 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsLightingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-candle-flame/20 border border-candle-flame/40 text-candle-flame">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100">Light a Vigil Candle</h3>
                <p className="text-xs text-slate-400">Place an intention upon the sacred household altar</p>
              </div>
            </div>

            <form onSubmit={handleLightCandleSubmit} className="space-y-4">
              {/* Candle Type Selection */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-2">Select Candle Votive</label>
                <div className="grid grid-cols-2 gap-2">
                  {CANDLE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedType === type.id
                          ? 'border-gold-400 bg-gold-500/15 shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                          : 'border-obsidian-700 bg-obsidian-950/60 hover:border-obsidian-600'
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-200 block truncate">{type.name}</span>
                      <span className="text-[10px] text-gold-400 font-mono">{type.duration}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient / Title */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Who is this candle for?
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., For Grandma Elena, My Marriage, Michael's Exam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/60"
                />
              </div>

              {/* Prayer Intention */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Prayer Intention & Petition
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Lord Jesus, protect them from fear and grant healing according to Your divine will..."
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/60 resize-none font-reading"
                />
              </div>

              {/* Lit By */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Your Name (or leave anonymous)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mom, David, or Anonymous Pilgrim"
                  value={litBy}
                  onChange={(e) => setLitBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/60"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-candle-glow to-candle-flame text-obsidian-950 font-bold text-sm shadow-[0_0_20px_rgba(255,158,64,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 mt-2"
              >
                <Flame className="w-4 h-4 fill-obsidian-950" />
                <span>Light Sanctuary Flame</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
