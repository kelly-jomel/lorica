import React from 'react';
import { X, Smartphone, Apple, Play, QrCode, Shield, CheckCircle2, Sparkles } from 'lucide-react';

export default function DownloadAppModal({ isOpen, onClose, onStartWebPrayer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-gold-500/40 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8 text-center space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-2 rounded-full bg-obsidian-900 border border-obsidian-800 transition active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Shield Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/25 to-obsidian-850 border border-gold-500/50 flex items-center justify-center text-gold-400 shadow-[0_0_25px_rgba(212,175,55,0.3)]">
          <Shield className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-2xl font-bold text-slate-100">
            Get Lorica for Mobile
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Take your Catholic spiritual shield everywhere. Keep all-night prayer loops, haptic rosary counters, and vigil altars right by your bedside.
          </p>
        </div>

        {/* Store Download Buttons */}
        <div className="space-y-3 pt-2">
          {/* iOS App Store */}
          <button
            onClick={() => alert("Lorica iOS release is undergoing Apple App Store review. You can pray all prayers directly on this website in the meantime!")}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-obsidian-950 border border-gold-500/40 hover:border-gold-500 hover:bg-obsidian-900 transition-all shadow-lg group active:scale-98"
          >
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Apple className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono text-slate-400 block leading-none">Download on the</span>
              <span className="font-semibold text-sm text-slate-100 group-hover:text-gold-200">Apple App Store</span>
            </div>
          </button>

          {/* Google Play Store */}
          <button
            onClick={() => alert("Lorica Android release is undergoing Google Play Store review. You can pray all prayers directly on this website in the meantime!")}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-obsidian-950 border border-gold-500/40 hover:border-gold-500 hover:bg-obsidian-900 transition-all shadow-lg group active:scale-98"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono text-slate-400 block leading-none">Get it on</span>
              <span className="font-semibold text-sm text-slate-100 group-hover:text-gold-200">Google Play Store</span>
            </div>
          </button>
        </div>

        {/* Web Alternative Option */}
        <div className="pt-2 border-t border-obsidian-800 space-y-3">
          <p className="text-xs text-slate-400">
            Don't want to wait for app stores?
          </p>
          <button
            onClick={() => {
              onClose();
              if (onStartWebPrayer) onStartWebPrayer();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition"
          >
            Pray 100% Free on this Website Now
          </button>
        </div>
      </div>
    </div>
  );
}
