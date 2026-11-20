import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X, Check, Shield, Flame, Globe, User, Mail } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { currencyService, SUPPORTED_CURRENCIES } from '../services/currencyService';
import { authService } from '../services/authService';

export default function BenefactorModal({ isOpen, onClose, onOpenProfile }) {
  const [currency, setCurrency] = useState(() => currencyService.getCurrency());
  const [selectedPlan, setSelectedPlan] = useState('warrior'); // 'guardian' | 'warrior' | 'pillar' | 'custom'
  const [frequency, setFrequency] = useState('monthly'); // 'monthly' | 'one-time'
  const [customAmount, setCustomAmount] = useState(() => String(currencyService.getCurrency().defaultCustom));
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPledged, setIsPledged] = useState(false);

  useEffect(() => {
    // Auto-fill if signed in
    const user = authService.getUser();
    if (user) {
      if (user.name) setDonorName(user.name);
      if (user.email) setDonorEmail(user.email);
    }
  }, [isOpen]);

  useEffect(() => {
    // Auto-detect country/currency on mount
    currencyService.autoDetect().then((c) => {
      if (c) {
        setCurrency(c);
        setCustomAmount(String(c.defaultCustom));
      }
    });

    const unsubscribe = currencyService.subscribe((newCurr) => {
      if (newCurr) {
        setCurrency(newCurr);
        setCustomAmount(String(newCurr.defaultCustom));
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const tiers = [
    {
      id: 'guardian',
      name: 'Guardian Benefactor',
      monthlyPrice: currency.guardian.monthly,
      oneTimePrice: currency.guardian.oneTime,
      soulsImpact: '10 Souls Sponsored',
      desc: 'Ensures free audio prayers and sleep peace for 10 people battling anxiety or insomnia each month.',
      icon: Shield,
      badge: 'Popular'
    },
    {
      id: 'warrior',
      name: 'St. Michael Warrior',
      monthlyPrice: currency.warrior.monthly,
      oneTimePrice: currency.warrior.oneTime,
      soulsImpact: '35 Souls Sponsored',
      desc: 'Funds continuous server bandwidth, scripture translations, and high-fidelity vocal recordings.',
      icon: Flame,
      highlight: true,
      badge: 'Most Impact'
    },
    {
      id: 'pillar',
      name: 'Sanctuary Pillar',
      monthlyPrice: currency.pillar.monthly,
      oneTimePrice: currency.pillar.oneTime,
      soulsImpact: '75 Souls Sponsored',
      desc: 'Endows new sacred audio production, Gregorian choir recording sessions, and parish outreach.',
      icon: Sparkles,
      badge: 'Pillar'
    }
  ];

  const currentTier = tiers.find((t) => t.id === selectedPlan);
  const activeAmount =
    selectedPlan === 'custom'
      ? parseFloat(customAmount) || 0
      : frequency === 'monthly'
      ? currentTier?.monthlyPrice || currency.warrior.monthly
      : currentTier?.oneTimePrice || currency.warrior.oneTime;

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    if (activeAmount <= 0) return;
    if (!donorName.trim() || !donorEmail.trim()) {
      alert('Please enter your Full Name and Email Address so we can register your benefaction.');
      return;
    }

    setIsSubmitting(true);
    soundEngine.init();
    soundEngine.playBell(523.25); // Resonant cathedral bell

    try {
      // Record donation in user ledger
      await fetch('/api/user-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record_donation',
          name: donorName.trim(),
          email: donorEmail.trim().toLowerCase(),
          amount: activeAmount,
          currency: currency.code,
          tier: selectedPlan === 'custom' ? 'Custom Offering' : currentTier?.name,
          frequency: frequency
        })
      });

      // Save user locally if not already signed in
      const currentUser = authService.getUser();
      if (!currentUser) {
        authService.saveUser({
          id: 'user_' + Date.now(),
          name: donorName.trim(),
          email: donorEmail.trim().toLowerCase(),
          signedInAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Donation recording notification error:', err);
    } finally {
      setIsSubmitting(false);
      setIsPledged(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-gold-500/40 p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="sticky top-0 float-right -mr-1 -mt-1 text-slate-400 hover:text-slate-100 p-2 rounded-full bg-obsidian-900/90 border border-obsidian-800 transition active:scale-95 z-20 backdrop-blur"
          title="Close"
        >
          <X className="w-4 h-4" />
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

            {/* Currency Selector Bar */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-800 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Globe className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-[11px] font-mono">Location Currency:</span>
                <span className="text-gold-300 font-bold flex items-center gap-1">
                  <span>{currency.flag}</span>
                  <span>{currency.code} ({currency.symbol})</span>
                </span>
              </div>
              <select
                value={currency.code}
                onChange={(e) => currencyService.setCurrency(e.target.value)}
                className="bg-obsidian-900 border border-obsidian-750 text-gold-200 rounded-lg px-2 py-1 text-[11px] font-mono outline-none cursor-pointer hover:border-gold-500/50"
              >
                {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
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
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-gold-500/20 border-gold-400 text-gold-300'
                              : 'bg-obsidian-900 border-obsidian-800 text-slate-400'
                          }`}
                        >
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
                          {currency.symbol}{price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {frequency === 'monthly' ? '/month' : 'one-time'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Custom Amount Free-Will Option */}
                <div
                  onClick={() => setSelectedPlan('custom')}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-2.5 ${
                    selectedPlan === 'custom'
                      ? 'bg-gold-500/15 border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                      : 'bg-obsidian-950/60 border-obsidian-800 hover:border-obsidian-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-gold-400" />
                      <span className="font-serif font-bold text-sm text-slate-100">
                        Custom Free-Will Offering
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gold-400">Donate what you wish</span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-400 font-mono text-sm font-bold">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="Enter amount..."
                      value={customAmount}
                      onFocus={() => setSelectedPlan('custom')}
                      onChange={(e) => {
                        setSelectedPlan('custom');
                        setCustomAmount(e.target.value);
                      }}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 text-slate-100 text-sm font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Donor Contact Intake (Full Name & Email) */}
                <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-gold-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-gold-300 font-serif font-bold text-xs">
                    <User className="w-3.5 h-3.5 text-gold-400" />
                    <span>Benefactor Registry & Account</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 text-slate-100 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-800 focus:border-gold-500 text-slate-100 text-xs font-mono outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Used to send your receipt, link your Holy Mass remembrance, and give you 1-click access to view or cancel subscriptions in your Pilgrim Portal.
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={activeAmount <= 0 || isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-sm shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-40"
              >
                <Heart className="w-4 h-4 fill-obsidian-950" />
                <span>
                  {isSubmitting
                    ? 'Processing Pledge...'
                    : `Pay It Forward & Keep Lorica Free (${currency.symbol}${Number(activeAmount).toLocaleString()})`}
                </span>
              </button>

              <div className="space-y-1.5 pt-1 text-center">
                <p className="text-[10px] text-slate-400">
                  Zero commitment • Cancel anytime with one tap • A monthly Holy Mass is offered for all Benefactors
                </p>
                <p className="text-[9px] text-slate-500 leading-relaxed max-w-sm mx-auto font-sans">
                  Lorica is developed and maintained by <span className="text-gold-400/90 font-medium">Xydris</span>. All voluntary Pay-It-Forward contributions directly subsidize server infrastructure, vocal recordings, and free access worldwide. Contributions are voluntary digital patronage and not tax-deductible charitable gifts under Section 80G.
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-gold-100">
                Deo Gratias! May God Reward You
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your pledge of <strong className="text-gold-300">{currency.symbol}{Number(activeAmount).toLocaleString()}</strong> {frequency === 'monthly' ? 'monthly' : 'one-time'} ensures that souls in acute anguish, fear, and spiritual battle can access sacred prayer tonight completely free.
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsPledged(false);
                  onClose();
                  onOpenProfile && onOpenProfile();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 text-xs font-bold hover:bg-gold-400 transition active:scale-95 shadow flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>View My Benefactor Portal</span>
              </button>

              <button
                onClick={() => {
                  setIsPledged(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-obsidian-900 border border-gold-500/40 text-xs font-bold text-gold-300 hover:bg-obsidian-850 transition active:scale-95 shadow"
              >
                Return to Prayer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
