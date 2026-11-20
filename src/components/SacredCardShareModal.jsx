import React, { useRef, useState } from 'react';
import { Share2, Download, Copy, Check, Sparkles, X, Heart } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function SacredCardShareModal({ isOpen, onClose, item }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen || !item) return null;

  const title = item.title || item.name || "Sacred Catholic Devotion";
  const category = item.category || "Catholic Spiritual Armor";
  const verseText = item.text || (item.verses && item.verses[0]?.text) || item.description || "";
  const citation = item.citation || item.tag || "Lorica: Catholic Prayers";

  const handleCopyText = () => {
    soundEngine.init();
    soundEngine.playBell(587.33);
    const fullShareText = `"${verseText}"\n\n— ${title}\nPray with free studio audio on Lorica: https://loricaprayers.com/`;
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWebShare = async () => {
    soundEngine.init();
    soundEngine.playBell(523.25);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | Lorica Catholic Prayers`,
          text: `"${verseText}" — ${title}`,
          url: 'https://loricaprayers.com/'
        });
      } catch (e) {}
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-obsidian-900 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-obsidian-800 pb-3">
          <div className="flex items-center gap-2 text-gold-300 font-serif font-bold text-base">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Share Sacred Prayer Card</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-obsidian-800 text-slate-400 hover:text-slate-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sacred Social Card Canvas */}
        <div 
          ref={cardRef}
          className="relative p-7 rounded-3xl bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border-2 border-gold-500/50 shadow-[0_0_40px_rgba(212,175,55,0.2)] space-y-5 text-center overflow-hidden"
        >
          {/* Subtle sacred corner accents */}
          <div className="absolute top-2 left-2 text-gold-500/40 text-xs font-serif font-bold">✠</div>
          <div className="absolute top-2 right-2 text-gold-500/40 text-xs font-serif font-bold">✠</div>
          <div className="absolute bottom-2 left-2 text-gold-500/40 text-xs font-serif font-bold">✠</div>
          <div className="absolute bottom-2 right-2 text-gold-500/40 text-xs font-serif font-bold">✠</div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400/90 font-bold block">
              {category}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-200">
              {title}
            </h3>
          </div>

          <div className="py-2">
            <p className="font-reading italic text-sm sm:text-base text-slate-100 leading-relaxed px-2">
              "{verseText}"
            </p>
          </div>

          <div className="pt-3 border-t border-gold-500/30 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-gold-400 font-serif font-bold">LORICA</span>
            <span>loricaprayers.com</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyText}
            className="py-3 rounded-2xl bg-obsidian-950 border border-gold-500/30 text-xs font-bold text-gold-300 hover:bg-gold-500/15 transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold-400" />}
            <span>{copied ? "Copied!" : "Copy Verse Text"}</span>
          </button>

          <button
            onClick={handleWebShare}
            className="py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-serif font-bold text-xs hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Share2 className="w-4 h-4 fill-obsidian-950" />
            <span>Share to Stories / Chat</span>
          </button>
        </div>

      </div>
    </div>
  );
}
