import React, { useState } from 'react';
import { Search, Play, Shield, Moon, Sword, HeartHandshake, Sparkles, Flower2, Clock } from 'lucide-react';
import { PRAYERS_DATA } from '../data/prayersData';

export default function LibraryView({ onPlayPrayer }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Spiritual Warfare', 'Protection & Sleep', 'Inner Peace', 'Liturgy of the Hours', 'Marian Devotion'];

  const filteredPrayers = PRAYERS_DATA.filter((prayer) => {
    const matchesSearch = prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prayer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prayer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5 pb-28 pt-2">
      {/* Header */}
      <div>
        <h2 className="font-serif text-xl font-bold text-gold-200">The Sacred Library</h2>
        <p className="text-xs text-slate-400">Over 250 guided audio prayers, litanies, and scripture tracks</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by fear, saint, sleep, Psalm 91..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              selectedCategory === cat
                ? 'bg-gold-500/20 border border-gold-500/60 text-gold-300 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                : 'bg-obsidian-900 border border-obsidian-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prayer Cards List */}
      <div className="space-y-3">
        {filteredPrayers.map((prayer) => (
          <div
            key={prayer.id}
            onClick={() => onPlayPrayer(prayer)}
            className="group cursor-pointer p-4 rounded-2xl bg-obsidian-900/80 border border-obsidian-800 hover:border-gold-500/40 hover:bg-obsidian-850 transition-all flex items-center justify-between gap-4 shadow-lg active:scale-99"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-obsidian-950 border border-gold-500/20 flex items-center justify-center text-gold-400 group-hover:scale-105 group-hover:border-gold-500/50 transition-all shrink-0 mt-0.5">
                {prayer.id === 'psalm-91' && <Shield className="w-5 h-5" />}
                {prayer.id === 'st-michael' && <Sword className="w-5 h-5" />}
                {prayer.id === 'anxiety-calm' && <HeartHandshake className="w-5 h-5" />}
                {prayer.id === 'night-compline' && <Moon className="w-5 h-5" />}
                {prayer.id === 'divine-mercy' && <Sparkles className="w-5 h-5" />}
                {prayer.id === 'holy-rosary' && <Flower2 className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-wider">
                    {prayer.tag}
                  </span>
                  {prayer.loopRecommended && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                      Sleep Loop
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-sm font-bold text-slate-100 group-hover:text-gold-200 transition">
                  {prayer.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {prayer.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-gold-400/80" /> {prayer.duration}
                  </span>
                  <span>•</span>
                  <span>{prayer.category}</span>
                </div>
              </div>
            </div>

            <button className="w-9 h-9 rounded-full bg-obsidian-950 border border-obsidian-700 flex items-center justify-center text-slate-400 group-hover:text-gold-400 group-hover:border-gold-500/50 group-hover:bg-gold-500/10 transition shrink-0">
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
