import React from 'react';
import { Play, Pause, X, Shield, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function MiniPlayer({ prayer, isPlaying, onTogglePlay, onOpenFullPlayer, onClose }) {
  if (!prayer) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 px-3 max-w-lg mx-auto sm:max-w-none">
      <div className="max-w-md mx-auto p-2.5 rounded-2xl bg-obsidian-900/95 border border-gold-500/30 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
        <div 
          onClick={onOpenFullPlayer} 
          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-gold-400 font-mono uppercase block truncate">
              Now Playing • {prayer.category}
            </span>
            <h4 className="font-serif font-bold text-xs text-slate-100 truncate">
              {prayer.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center hover:brightness-110 active:scale-95 transition"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-obsidian-950" />
            ) : (
              <Play className="w-4 h-4 fill-obsidian-950 translate-x-0.2" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
