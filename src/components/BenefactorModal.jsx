import React, { useState } from 'react';
import { Heart, Sparkles, X, Check, Shield, Users, Flame, Globe2, Bell } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

export default function BenefactorModal({ isOpen, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState('warrior'); // 'guardian' | 'warrior' | 'pillar' | 'custom'
  const [frequency, setFrequency] = useState('monthly'); // 'monthly' | 'one-time'
  const [customAmount, setCustomAmount] = useState('25');
  const [isPledged, setIsPledged] = useState(false);

  if (!isOpen) return null;

  const tiers = [
    {
      id: 'guardian',
      name: 'Guardian Benefactor',
      monthlyPrice: 5,
      oneTimePrice: 20,
      soulsImpact: '10 Souls Sponsored',
      desc: 'Ensures free audio prayers and sleep peace for 10 people battling anxiety or insomnia each month.',
      icon: Shield,
      badge: 'Popular'
    },
    {
      id: 'warrior',
      name: 'St. Michael Warrior',
      monthlyPrice: 15,
      oneTimePrice: 50,
      soulsImpact: '35 Souls Sponsored',
      desc: 'Funds continuous server bandwidth, scripture translations, and high-fidelity vocal recordings.',
      icon: Flame,
      highlight: true,
      badge: 'Most Impact'
    },
    {
      id: 'pillar',
      name: 'Sanctuary Pillar',
      monthlyPrice: 30,
      oneTimePrice: 100,
      soulsImpact: '75 Souls Sponsored',
      desc: 'Endows new sacred audio production, Gregorian choir recording sessions, and parish outreach.',
      icon: Sparkles,
      badge: 'Pillar'
    }
  ];

  const handlePledgeSubmit = (e) => {
    e.preventDefault();
    soundEngine.init();
    soundEngine.playBell(523.25); // Resonant cathedral bell
    setIsPledged(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-gold-500/40 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-full bg-obsidian-900 border border-obsidian-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPledged ? (
          <div className="space-y-5">
            {/* Mission Header */}
            <div className="text-center space-y-1.5 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-mono font-medium">
                <Heart className="w-3.5 h-3.5 fill-current text-red-400" />
                <span>The Benefactor Covenant • Pay It Forward</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gold-100">
                Keep Lorica 100% Free for Everyone
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                We believe nobody should ever have to pay to pray. Lorica has zero ads and zero paywalls. Every prayer, sleep loop, and novena is funded entirely by users who choose to pay it forward.
              </p>
            </div>

            {/* Live Impact Proof Metric */}
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

            {/* Frequency Toggle (Monthly vs One-Time) */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-obsidian-950 border border-obsidian-800 max-w-xs mx-auto text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`py-1.5 rounded-lg transition ${
                  frequency === 'monthly'
                    ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly Almsgiving
              </button>
              <button
                type="button"
                onClick={() => setFrequency('one-time')}
                className={`py-1.5 rounded-lg transition ${
                  frequency === 'one-time'
                    ? 'bg-gold-500 text-obsidian-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                One-Time Gift
              </button>
            </div>

            {/* Benefactor Tiers */}
            <form onSubmit={handlePledgeSubmit} className="space-y-3">
              <div className="space-y-2.5">
                {tiers.map((tier) => {
                  const Icon = tier.icon;
                  const isSelected = selectedPlan === tier.id;
                  const price = frequency === 'monthly' ? tier.monthlyPrice : tier.oneTimePrice;

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
                        <span className="font-mono text-base font-bold text-gold-300">
                          ${price}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {frequency === 'monthly' ? '/month' : 'one-time'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 mt-4"
              >
                <Heart className="w-4 h-4 fill-obsidian-950" />
                <span>Pay It Forward & Keep Lorica Free</span>
              </button>

              <p className="text-[10px] text-center text-slate-500 pt-1">
                Zero commitment • Cancel anytime with one tap • A monthly Holy Mass is offered for all Benefactors
              </p>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-gold-400 uppercase tracking-widest">
                Covenant Confirmed
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-100">
                God Bless Your Generosity
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed pt-1">
                You have just ensured that souls experiencing sleepless dread, panic, and spiritual combat will find Christ's peace tonight for free.
              </p>
            </div>

            {/* Spiritual Gift Card */}
            <div className="p-4 rounded-2xl bg-obsidian-950 border border-gold-500/30 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-gold-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-candle-flame" /> Benefactor Mass Registry
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Perpetual Intention</span>
              </div>
              <p className="font-reading italic text-xs text-slate-300">
                "May the Lord reward your deed, and may you have a full reward from the Lord, the God of Israel, under whose wings you have come to take refuge." — Ruth 2:12
              </p>
            </div>

            <button
              onClick={() => {
                setIsPledged(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-slate-200 text-xs font-semibold hover:bg-obsidian-750 transition"
            >
              Return to Sanctuary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
