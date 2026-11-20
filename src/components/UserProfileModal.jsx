import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Heart, 
  Shield, 
  Calendar, 
  Sparkles, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  LogOut, 
  Flame, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Award,
  LogIn,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { GOOGLE_CLIENT_ID, authService } from '../services/authService';

export default function UserProfileModal({ isOpen, onClose, user, onSignIn, onSignOut }) {
  const [userHistory, setUserHistory] = useState([]);
  const [totals, setTotals] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelFeedback, setCancelFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('donations'); // 'donations' | 'spiritual'
  
  // Sign in state
  const [showSignInCard, setShowSignInCard] = useState(!user?.email);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [signInError, setSignInError] = useState('');
  const googleBtnRef = useRef(null);

  // Sync state when user prop changes
  useEffect(() => {
    if (user?.email) {
      setShowSignInCard(false);
      fetchUserHistory(user.email);
    } else {
      setShowSignInCard(true);
      setUserHistory([]);
      setTotals({});
    }
  }, [isOpen, user]);

  // Initialize Google Identity Services button inside the modal
  useEffect(() => {
    if (!isOpen || !showSignInCard) return;

    let timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (res) => {
              if (res.credential) {
                const payload = authService.decodeJwt(res.credential);
                if (payload?.email) {
                  const pilgrim = {
                    id: payload.sub,
                    email: payload.email.toLowerCase().trim(),
                    name: payload.name || payload.given_name || 'Pilgrim',
                    givenName: payload.given_name || payload.name || 'Pilgrim',
                    picture: payload.picture || null,
                    locale: payload.locale || 'en',
                    signedInAt: new Date().toISOString()
                  };
                  if (onSignIn) {
                    onSignIn(pilgrim);
                  } else {
                    authService.saveUser(pilgrim);
                  }
                  setShowSignInCard(false);
                  fetchUserHistory(pilgrim.email);
                }
              }
            }
          });

          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: 280
          });
        } catch (err) {
          console.warn('Google Identity button render error:', err);
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen, showSignInCard]);

  const handleEmailSignIn = (e) => {
    e.preventDefault();
    setSignInError('');
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setSignInError('Please enter a valid email address.');
      return;
    }

    const cleanName = nameInput.trim() || cleanEmail.split('@')[0];
    const pilgrim = {
      id: 'pilgrim_' + Date.now(),
      email: cleanEmail,
      name: cleanName,
      signedInAt: new Date().toISOString()
    };

    if (onSignIn) {
      onSignIn(pilgrim);
    } else {
      authService.saveUser(pilgrim);
    }
    setShowSignInCard(false);
    fetchUserHistory(cleanEmail);
  };

  const fetchUserHistory = async (email) => {
    if (!email) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user-handler.php?action=get_user_history&email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.status === 'success') {
        setUserHistory(data.donations || []);
        setTotals(data.total_given || {});
      }
    } catch (err) {
      console.error('Failed to load user history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!confirm('Are you sure you want to cancel your monthly giving? Your current month will remain active, and no future payments will be processed.')) {
      return;
    }

    setCancellingId(subscriptionId);
    setCancelFeedback(null);

    try {
      const res = await fetch('/api/user-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel_subscription',
          subscription_id: subscriptionId,
          email: user?.email || ''
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        soundEngine.init();
        soundEngine.playBell(440);
        setCancelFeedback({ type: 'success', message: data.message });
        if (user?.email) fetchUserHistory(user.email);
      } else {
        setCancelFeedback({ type: 'error', message: data.message || 'Cancellation could not be completed.' });
      }
    } catch (err) {
      setCancelFeedback({ type: 'error', message: 'Failed to contact cancellation service. Please try again or contact support.' });
    } finally {
      setCancellingId(null);
    }
  };

  if (!isOpen) return null;

  const activeSubs = userHistory.filter(
    (d) => (d.status === 'Active' || d.status === 'Completed') && (d.frequency === 'monthly' || d.tier?.includes('Monthly'))
  );

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-obsidian-850 via-obsidian-900 to-obsidian-950 border border-gold-500/40 p-5 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 float-right -mr-2 -mt-2 text-slate-400 hover:text-slate-100 p-2 rounded-full bg-obsidian-900/90 border border-obsidian-800 transition active:scale-95 z-20 backdrop-blur"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Card Header or Sign In Toggle Bar */}
        {user?.email && !showSignInCard ? (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2 border-b border-obsidian-800 pb-5">
            <div className="relative">
              {user?.picture ? (
                <img
                  src={user?.picture}
                  alt={user?.name || 'Pilgrim'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500/30 to-amber-600/20 border-2 border-gold-400 flex items-center justify-center font-serif text-2xl font-bold text-gold-300 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-obsidian-950 rounded-full" title="Active Pilgrim Account" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-gold-100">
                  {user?.name || 'Pilgrim of Lorica'}
                </h2>
                {userHistory.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40">
                    <Award className="w-3 h-3 text-gold-400" />
                    Active Benefactor
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{user?.email}</span>
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                <p className="text-[11px] text-gold-400/80 font-serif italic">
                  Enrolled in the Perpetual Monthly Benefactor Mass Registry
                </p>
                <button
                  onClick={() => setShowSignInCard(true)}
                  className="text-[11px] text-slate-400 hover:text-gold-300 underline underline-offset-2"
                >
                  Switch Account
                </button>
              </div>
            </div>

            {onSignOut && (
              <button
                onClick={() => {
                  onSignOut();
                  setShowSignInCard(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-obsidian-950 border border-obsidian-800 hover:border-red-500/40 text-slate-400 hover:text-red-300 text-xs flex items-center gap-1.5 transition self-center sm:self-start"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        ) : (
          /* Sign In Card */
          <div className="pt-2 pb-2 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-gold-500/20 to-amber-600/10 border border-gold-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <LogIn className="w-7 h-7 text-gold-300" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-gold-100">
                Benefactor & Pilgrim Sign In
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Sign in to view your contribution history, manage recurring monthly giving, and access your Perpetual Mass Covenant.
              </p>
            </div>

            {/* Google Sign In Section */}
            <div className="flex flex-col items-center justify-center space-y-3 p-4 rounded-2xl bg-obsidian-950/80 border border-obsidian-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Fast Sign-In with Google
              </span>
              <div ref={googleBtnRef} className="flex justify-center min-h-[44px]" />
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-obsidian-800"></div>
              <span className="flex-shrink mx-4 text-xs font-mono text-slate-500 uppercase">or enter your email</span>
              <div className="flex-grow border-t border-obsidian-800"></div>
            </div>

            {/* Email Direct Lookup / Sign In Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-gold-400" /> Email Address (used when donating)
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. pilgrim@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-slate-100 text-xs focus:outline-none focus:border-gold-500/70 placeholder:text-slate-600 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-gold-400" /> Full Name (optional)
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Marcus Aurelius"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 text-slate-100 text-xs focus:outline-none focus:border-gold-500/70 placeholder:text-slate-600"
                />
              </div>

              {signInError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-obsidian-950 text-xs font-bold font-serif flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 active:scale-[0.99] transition"
              >
                <span>Access Giving Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <p className="text-[10px] text-slate-500">
                  By signing in, you agree to our{' '}
                  <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">Privacy Policy</a>.
                </p>
              </div>

              {user?.email && (
                <button
                  type="button"
                  onClick={() => setShowSignInCard(false)}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200 pt-1"
                >
                  Return to current profile ({user.email})
                </button>
              )}
            </form>
          </div>
        )}

        {/* Feedback alerts */}
        {cancelFeedback && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            cancelFeedback.type === 'success' 
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
              : 'bg-red-950/60 border border-red-500/40 text-red-200'
          }`}>
            {cancelFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{cancelFeedback.message}</span>
          </div>
        )}

        {/* Navigation Tabs inside Profile */}
        <div className="flex items-center gap-2 border-b border-obsidian-800 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'donations'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Giving & Subscriptions ({userHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('spiritual')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'spiritual'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Spiritual Gifts & Mass Covenant
          </button>
        </div>

        {/* TAB 1: DONATIONS & SUBSCRIPTIONS */}
        {activeTab === 'donations' && (
          <div className="space-y-4">
            
            {/* Active Recurring Subscriptions Banner */}
            {activeSubs.length > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-500/10 via-amber-600/5 to-transparent border border-gold-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-candle-flame" />
                    <h3 className="font-serif font-bold text-sm text-gold-200">
                      Active Monthly Giving Agreement
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Active
                  </span>
                </div>

                {activeSubs.map((sub) => (
                  <div key={sub.id} className="p-3 rounded-xl bg-obsidian-950/80 border border-obsidian-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 text-xs">
                      <p className="font-semibold text-slate-100">{sub.tier}</p>
                      <p className="font-mono text-gold-300 font-bold">
                        {sub.currency} {Number(sub.amount).toLocaleString()} / month
                      </p>
                      {sub.next_renewal && (
                        <p className="text-[11px] text-slate-400">
                          Next renewal date: <span className="text-slate-200 font-mono">{sub.next_renewal}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleCancelSubscription(sub.subscription_id || sub.txn_id)}
                      disabled={cancellingId === (sub.subscription_id || sub.txn_id)}
                      className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-200 hover:text-red-100 text-xs font-semibold transition active:scale-95 disabled:opacity-40 self-start sm:self-center"
                    >
                      {cancellingId === (sub.subscription_id || sub.txn_id) ? (
                        <span className="flex items-center gap-1.5">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Cancelling...
                        </span>
                      ) : (
                        'Cancel Monthly Giving'
                      )}
                    </button>
                  </div>
                ))}

                <p className="text-[10px] text-slate-400">
                  Cancelling will immediately terminate the recurring billing agreement with PayPal. No future payments will be drawn.
                </p>
              </div>
            )}

            {/* Donation History List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono uppercase tracking-wider text-[10px]">Contribution Ledger</span>
                <button
                  onClick={() => user?.email && fetchUserHistory(user.email)}
                  className="hover:text-gold-300 flex items-center gap-1 text-[11px]"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoading && userHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-mono">
                  Loading your benefactor ledger...
                </div>
              ) : userHistory.length === 0 ? (
                <div className="p-8 rounded-2xl bg-obsidian-950 border border-obsidian-850 text-center space-y-2">
                  <Heart className="w-8 h-8 text-gold-400/40 mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">
                    {user?.email ? `No recorded donations found for ${user.email}` : 'No active patron account signed in.'}
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    When you make a donation through the Benefactor Covenant, your receipts and status appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl bg-obsidian-950 border border-obsidian-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-obsidian-900 text-slate-400 font-mono text-[10px] border-b border-obsidian-800 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Devotion / Tier</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-obsidian-850 font-mono text-[11px]">
                      {userHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-obsidian-900/50 transition">
                          <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                            {item.created_at?.split(' ')[0] || item.created_at}
                          </td>
                          <td className="py-2.5 px-3 text-slate-200">
                            <span className="font-sans font-medium">{item.tier}</span>
                          </td>
                          <td className="py-2.5 px-3 text-gold-300 font-bold whitespace-nowrap">
                            {item.currency} {Number(item.amount).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Active' || item.status === 'Completed'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: SPIRITUAL GIFTS & MASS COVENANT */}
        {activeTab === 'spiritual' && (
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-obsidian-950 border border-gold-500/30 space-y-3">
              <div className="flex items-center gap-2 text-gold-300 font-serif font-bold text-sm">
                <Flame className="w-4 h-4 text-candle-flame" />
                <span>The Monthly Benefactor Mass Registry</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                As a Benefactor of Lorica, a Holy Catholic Mass is offered monthly on the First Friday for your intentions, protection, and spiritual perseverance.
              </p>
              <div className="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-800 font-reading italic text-slate-300 text-xs">
                "May the Lord reward your deed, and may you have a full reward from the Lord, the God of Israel, under whose wings you have come to take refuge." — Ruth 2:12
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-2">
              <h4 className="font-serif font-bold text-gold-200">Your Spiritual Covenant Impact</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Your contributions directly fund high-bandwidth servers, low-latency audio delivery, liturgical calendar computation, and zero-ad accessibility for thousands battling midnight panic, distress, and insomnia worldwide.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
