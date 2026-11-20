import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  ArrowRight,
  Flame,
  X
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export const EXAMINATION_SECTIONS = [
  {
    id: "commandments-1-3",
    category: "Duties Toward God",
    subtitle: "The First Three Commandments",
    icon: "Flame",
    color: "from-amber-500/20 to-amber-950/40",
    questions: [
      { id: "god-1", text: "Have I loved God above all things, or have I put money, career, approval, or pleasure before Him?" },
      { id: "god-2", text: "Have I engaged in superstition, occult practices, astrology, tarot, or new age spiritualism?" },
      { id: "god-3", text: "Have I doubted or denied truths revealed by God and taught by the Catholic Church?" },
      { id: "god-4", text: "Have I taken the Lord's holy Name in vain, using it casually, in anger, or as a curse?" },
      { id: "god-5", text: "Have I deliberately missed Sunday Mass or Holy Days of Obligation without grave cause (such as severe illness)?" },
      { id: "god-6", text: "Have I received Holy Communion while conscious of having committed mortal sin without prior sacramental confession?" }
    ]
  },
  {
    id: "commandments-4-6",
    category: "Duties Toward Family & Life",
    subtitle: "Commandments 4, 5, and 6",
    icon: "Heart",
    color: "from-rose-500/20 to-rose-950/40",
    questions: [
      { id: "life-1", text: "Have I dishonored, disobeyed, or failed to care for my parents or family members in their need?" },
      { id: "life-2", text: "Have I harbored hatred, deep bitterness, resentment, or refused to forgive someone who wronged me?" },
      { id: "life-3", text: "Have I injured anyone physically, verbally, or sought revenge in thought or action?" },
      { id: "life-4", text: "Have I abused alcohol, prescription medication, or illicit drugs to numb emotions or reality?" },
      { id: "life-5", text: "Have I looked at pornography, indulged in willful impure thoughts, or engaged in unchaste behavior?" },
      { id: "life-6", text: "Have I treated another person as an object for personal gratification rather than a temple of God?" }
    ]
  },
  {
    id: "commandments-7-10",
    category: "Duties Toward Truth & Neighbor",
    subtitle: "Commandments 7, 8, 9, and 10",
    icon: "ShieldCheck",
    color: "from-emerald-500/20 to-emerald-950/40",
    questions: [
      { id: "truth-1", text: "Have I stolen, cheated, failed to pay debts, or taken what did not belong to me without restitution?" },
      { id: "truth-2", text: "Have I lied, gossiped, slandered others, or damaged another person's reputation by detraction?" },
      { id: "truth-3", text: "Have I judged others harshly while excusing my own deliberate faults and shortcomings?" },
      { id: "truth-4", text: "Have I envied someone else's success, talents, possessions, or happiness?" },
      { id: "truth-5", text: "Have I failed to be generous to the poor, suffering, or those in acute distress when capable?" },
      { id: "truth-6", text: "Have I neglected regular daily prayer and failed to examine my soul before sleep?" }
    ]
  }
];

export const CONFESSION_GUIDE_STEPS = [
  {
    step: 1,
    title: "Entering the Confessional",
    detail: "Kneel behind the screen or sit face-to-face. Make the Sign of the Cross and say:",
    quote: "Bless me, Father, for I have sinned. It has been [days/months/years] since my last confession."
  },
  {
    step: 2,
    title: "Confessing Your Sins",
    detail: "State your sins clearly with humility and honesty without excuses. Name mortal sins by kind and approximate frequency.",
    quote: "These are my sins, and I am heartily sorry for these and all the sins of my entire life."
  },
  {
    step: 3,
    title: "Counsel & Penance",
    detail: "Listen attentively as the priest offers gentle spiritual counsel and gives you a penance (prayers or works of charity)."
  },
  {
    step: 4,
    title: "Act of Contrition",
    detail: "The priest will ask you to express your sorrow. Pray the Act of Contrition with sincere resolve to amend your life.",
    quote: "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen."
  },
  {
    step: 5,
    title: "Sacramental Absolution",
    detail: "The priest extends his hands and speaks the words of Christ: 'I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit.' Cross yourself and reply: 'Amen.' Walk out in peace—your soul is made completely white as snow!"
  }
];

export default function ConfessionHelperModal({ isOpen, onClose, onPlayPrayer }) {
  const [markedSins, setMarkedSins] = useState({});
  const [activeTab, setActiveTab] = useState('examine'); // 'examine' | 'guide' | 'contrition'
  const [privacyMode, setPrivacyMode] = useState(true);

  if (!isOpen) return null;

  const toggleSin = (id) => {
    soundEngine.init();
    soundEngine.playBell(587.33);
    setMarkedSins(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClearSession = () => {
    setMarkedSins({});
  };

  const markedCount = Object.values(markedSins).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-obsidian-900 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-obsidian-800 flex items-center justify-between bg-obsidian-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-200">
                Examination of Conscience & Confession Helper
              </h3>
              <p className="text-xs text-slate-400">
                Sacred preparation for the Sacrament of Reconciliation • 100% Private (Zero Data Saved)
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

        {/* Tab Switcher */}
        <div className="flex border-b border-obsidian-800 bg-obsidian-950/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('examine')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'examine'
                ? 'border-gold-500 text-gold-300 bg-obsidian-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1. Examine Conscience</span>
            {markedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                {markedCount} noted
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-gold-500 text-gold-300 bg-obsidian-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2. Step-by-Step Confession Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('contrition')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'contrition'
                ? 'border-gold-500 text-gold-300 bg-obsidian-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>3. Act of Contrition Audio</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: EXAMINATION OF CONSCIENCE */}
          {activeTab === 'examine' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 leading-relaxed">
                  <strong>Prayer Before Examination:</strong> "Come Holy Spirit, illuminate my mind and memory. Grant me the light to see my sins as they appear in the eyes of God, sincere contrition for them, and the courage to confess them humbly."
                </div>
              </div>

              <div className="space-y-6">
                {EXAMINATION_SECTIONS.map((section) => (
                  <div key={section.id} className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-3.5">
                    <div className="flex items-center justify-between border-b border-obsidian-850 pb-2.5">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-gold-200">{section.category}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">{section.subtitle}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {section.questions.map((q) => {
                        const isMarked = !!markedSins[q.id];
                        return (
                          <div
                            key={q.id}
                            onClick={() => toggleSin(q.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 text-xs leading-relaxed ${
                              isMarked
                                ? 'bg-amber-500/15 border-amber-500/50 text-amber-100'
                                : 'bg-obsidian-900/60 border-obsidian-800 text-slate-300 hover:border-gold-500/30'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0 text-gold-400">
                              {isMarked ? (
                                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                            <span className={isMarked ? 'font-medium' : ''}>{q.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-obsidian-800 flex items-center justify-between">
                <button
                  onClick={handleClearSession}
                  className="px-3 py-1.5 rounded-lg border border-obsidian-800 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All Checkmarks</span>
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className="px-5 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 transition flex items-center gap-2 shadow-lg"
                >
                  <span>Proceed to Confession Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STEP BY STEP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {CONFESSION_GUIDE_STEPS.map((step) => (
                  <div key={step.step} className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 font-mono text-xs font-bold flex items-center justify-center">
                        {step.step}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-gold-200">{step.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-8">
                      {step.detail}
                    </p>
                    {step.quote && (
                      <div className="ml-8 p-3 rounded-xl bg-obsidian-900 border border-gold-500/20 font-reading italic text-xs text-gold-300 leading-relaxed">
                        "{step.quote}"
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ready to pray the Act of Contrition with audio narration?</span>
                <button
                  onClick={() => setActiveTab('contrition')}
                  className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 transition"
                >
                  Open Act of Contrition
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ACT OF CONTRITION AUDIO */}
          {activeTab === 'contrition' && (
            <div className="space-y-6 text-center max-w-xl mx-auto py-4">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 mx-auto flex items-center justify-center text-gold-400">
                <Heart className="w-8 h-8 fill-current/20" />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-2xl font-bold text-gold-200">The Act of Contrition</h4>
                <p className="text-xs text-slate-400 font-mono">Traditional Liturgical Form • With Daniel (Lorica Narration)</p>
              </div>

              <div className="p-6 rounded-3xl bg-obsidian-950 border border-gold-500/30 text-left space-y-4 shadow-xl">
                <p className="font-reading text-sm sm:text-base text-slate-200 leading-relaxed italic">
                  "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love."
                </p>
                <p className="font-reading text-sm sm:text-base text-slate-200 leading-relaxed italic">
                  "I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen."
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onPlayPrayer({
                    id: 'act-contrition',
                    title: 'Act of Contrition',
                    category: 'Sacrament of Penance',
                    duration: '1:30',
                    narratorTrack: '/audio/act_contrition_daniel.m4a',
                    narratorName: 'Daniel',
                    verses: [
                      { id: 1, text: "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love." },
                      { id: 2, text: "I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen." }
                    ]
                  });
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 text-obsidian-950 font-serif font-bold text-sm hover:brightness-110 transition shadow-2xl flex items-center justify-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Act of Contrition in Audio Player</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-obsidian-800 bg-obsidian-950/80 text-center text-[11px] text-slate-500 font-mono">
          Lorica Sanctuary • Your soul is cleansed in Christ • Go in peace to love and serve the Lord
        </div>

      </div>
    </div>
  );
}
