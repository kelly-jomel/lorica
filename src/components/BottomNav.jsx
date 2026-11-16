import React from 'react';
import { Home, Flame, BookOpen, Sparkles, Compass } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'sanctuary', label: 'Sanctuary', icon: Home },
    { id: 'altar', label: 'Altar Vigil', icon: Flame, badge: 'Live' },
    { id: 'explore', label: 'Pray & Learn', icon: BookOpen, badge: 'Novenas' },
    { id: 'tools', label: 'Monastic', icon: Compass },
    { id: 'ask', label: 'Ask Lorica', icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-obsidian-950/95 backdrop-blur-lg border-t border-obsidian-800/80 px-2 py-2 max-w-lg mx-auto sm:max-w-none">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-gold-400 font-medium scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 text-[8px] bg-candle-flame text-obsidian-950 font-bold px-1 rounded-full animate-pulse">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold-400 rounded-full shadow-[0_0_8px_#D4AF37]" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
