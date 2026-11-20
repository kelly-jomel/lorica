import React, { useState, useEffect } from 'react';
import { Flame, Heart, Send, Sparkles, CheckCircle2, Shield, MessageSquare, X } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export const INITIAL_INTENTIONS = [
  {
    id: "int-1",
    author: "A mother in Dublin",
    intention: "For the spiritual protection of my two sons and their safe return to the Catholic faith.",
    category: "Family & Faith",
    prayedCount: 38,
    timestamp: "2 hours ago"
  },
  {
    id: "int-2",
    author: "Francis in Goa",
    intention: "For my father battling acute pulmonary disease. Through the intercession of St. Jude.",
    category: "Physical Healing",
    prayedCount: 74,
    timestamp: "4 hours ago"
  },
  {
    id: "int-3",
    author: "Anonymous pilgrim",
    intention: "Deliverance from severe nighttime anxiety and dread. Under the shield of Psalm 91.",
    category: "Spiritual Warfare",
    prayedCount: 112,
    timestamp: "6 hours ago"
  },
  {
    id: "int-4",
    author: "Maria in Texas",
    intention: "For peace and holy reconciliation in our marriage through Our Lady Undoer of Knots.",
    category: "Marriage & Family",
    prayedCount: 65,
    timestamp: "8 hours ago"
  },
  {
    id: "int-5",
    author: "Brother in Christ",
    intention: "For holy priests and religious who suffer spiritual exhaustion and persecution.",
    category: "Holy Church",
    prayedCount: 91,
    timestamp: "12 hours ago"
  }
];

export default function PrayerIntentionsModal({ isOpen, onClose }) {
  const [intentions, setIntentions] = useState(() => {
    try {
      const stored = localStorage.getItem('lorica_community_intentions');
      return stored ? JSON.parse(stored) : INITIAL_INTENTIONS;
    } catch (e) {
      return INITIAL_INTENTIONS;
    }
  });

  const [prayedForIds, setPrayedForIds] = useState(() => {
    try {
      const stored = localStorage.getItem('lorica_prayed_for_ids');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [newAuthor, setNewAuthor] = useState("");
  const [newIntention, setNewIntention] = useState("");
  const [newCategory, setNewCategory] = useState("Spiritual Warfare");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handlePrayFor = (id) => {
    if (prayedForIds.includes(id)) return;
    soundEngine.init();
    soundEngine.playBell(587.33);

    const updated = intentions.map(item => {
      if (item.id === id) {
        return { ...item, prayedCount: item.prayedCount + 1 };
      }
      return item;
    });

    const nextPrayed = [...prayedForIds, id];
    setIntentions(updated);
    setPrayedForIds(nextPrayed);
    try {
      localStorage.setItem('lorica_community_intentions', JSON.stringify(updated));
      localStorage.setItem('lorica_prayed_for_ids', JSON.stringify(nextPrayed));
    } catch (e) {}
  };

  const handlePostIntention = (e) => {
    e.preventDefault();
    if (!newIntention.trim()) return;

    soundEngine.init();
    soundEngine.playBell(523.25);

    const newItem = {
      id: `int-${Date.now()}`,
      author: newAuthor.trim() || "Anonymous pilgrim",
      intention: newIntention.trim(),
      category: newCategory,
      prayedCount: 1,
      timestamp: "Just now"
    };

    const nextList = [newItem, ...intentions];
    setIntentions(nextList);
    try {
      localStorage.setItem('lorica_community_intentions', JSON.stringify(nextList));
    } catch (e) {}

    setNewIntention("");
    setNewAuthor("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-obsidian-900 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-obsidian-800 flex items-center justify-between bg-obsidian-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Flame className="w-5 h-5 text-candle-flame" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-200">
                Community Prayer Altar & Intentions
              </h3>
              <p className="text-xs text-slate-400">
                "Bear ye one another's burdens; and so you shall fulfil the law of Christ." (Galatians 6:2)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-obsidian-800 text-slate-400 hover:text-slate-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Post Intention Form */}
          <form onSubmit={handlePostIntention} className="p-5 rounded-2xl bg-obsidian-950 border border-gold-500/30 space-y-3.5 shadow-md">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-gold-200">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Light a Candle & Place Your Intention on the Altar</span>
            </div>

            <textarea
              rows={2}
              required
              value={newIntention}
              onChange={(e) => setNewIntention(e.target.value)}
              placeholder="What intention would you like the Lorica community to pray a decade of the Rosary for? (e.g. healing for my mother, spiritual peace, marriage...)"
              className="w-full bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 text-xs text-slate-200 p-3 rounded-xl focus:outline-none placeholder:text-slate-500 resize-none"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Your Name / Location (or leave blank)"
                  className="bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 text-xs text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none placeholder:text-slate-500 w-full sm:w-48"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-obsidian-900 border border-obsidian-800 text-xs text-gold-300 px-2.5 py-1.5 rounded-lg focus:outline-none"
                >
                  <option value="Spiritual Warfare">Spiritual Warfare</option>
                  <option value="Physical Healing">Physical Healing</option>
                  <option value="Family & Faith">Family & Faith</option>
                  <option value="Holy Souls in Purgatory">Holy Souls</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg"
              >
                <Send className="w-3.5 h-3.5 fill-obsidian-950" />
                <span>Place on Altar</span>
              </button>
            </div>

            {submitted && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Your prayer intention has been reverently placed on the altar!</span>
              </div>
            )}
          </form>

          {/* Intentions List */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Recent Community Intentions</span>
              <span>{intentions.length} Intentions Active</span>
            </div>

            {intentions.map((item) => {
              const hasPrayed = prayedForIds.includes(item.id);
              return (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 hover:border-gold-500/30 transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-400 font-bold">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {item.author} • {item.timestamp}
                    </span>
                  </div>

                  <p className="font-reading text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{item.intention}"
                  </p>

                  <div className="pt-2 border-t border-obsidian-850 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gold-400/90 font-mono">
                      <Flame className="w-3.5 h-3.5 text-candle-flame" />
                      <span>{item.prayedCount} {item.prayedCount === 1 ? 'person' : 'people'} offered prayers</span>
                    </div>

                    <button
                      onClick={() => handlePrayFor(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        hasPrayed
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-obsidian-900 border border-gold-500/30 text-gold-300 hover:bg-gold-500 hover:text-obsidian-950'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasPrayed ? 'fill-emerald-400 text-emerald-400' : 'text-gold-400'}`} />
                      <span>{hasPrayed ? "Prayed For ✓" : "I Prayed for This"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
