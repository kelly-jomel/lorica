import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Lock, 
  DollarSign, 
  Mail, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  LogOut, 
  ExternalLink, 
  Eye, 
  EyeOff,
  Bell,
  Heart,
  TrendingUp,
  Search,
  Key,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { GOOGLE_CLIENT_ID } from '../services/authService';

const AUTHORIZED_ADMIN_EMAIL = 'info@xydris.in';

export default function HiddenAdminView({ onExitAdmin }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const googleBtnRef = useRef(null);

  // Dashboard Data
  const [stats, setStats] = useState({ total_count: 0, totals_by_currency: {} });
  const [donations, setDonations] = useState([]);
  const [config, setConfig] = useState({
    paypal_email: '',
    paypal_client_id: '',
    paypal_mode: 'sandbox',
    paypal_donation_link: '',
    notification_email: 'info@xydris.in',
    email_notifications_enabled: true
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    paypal_email: '',
    paypal_client_id: '',
    paypal_mode: 'sandbox',
    paypal_donation_link: '',
    notification_email: 'info@xydris.in',
    email_notifications_enabled: true,
    new_admin_password: ''
  });

  const [activeTab, setActiveTab] = useState('donations'); // 'donations' | 'paypal' | 'security' | 'renewals'
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [cronRunResult, setCronRunResult] = useState('');
  const [isRunningCron, setIsRunningCron] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTestingMail, setIsTestingMail] = useState(false);
  const [mailTestResult, setMailTestResult] = useState('');

  // Helper to decode Google JWT
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Check saved session token or saved admin user
  useEffect(() => {
    const savedToken = sessionStorage.getItem('lorica_admin_token');
    const savedEmail = sessionStorage.getItem('lorica_admin_email');
    if (savedToken && savedEmail === AUTHORIZED_ADMIN_EMAIL) {
      setPassword(savedToken);
      setIsAuthenticated(true);
      fetchDashboard(savedToken);
    }
  }, []);

  // Initialize Google Identity Services specifically for Admin
  useEffect(() => {
    if (isAuthenticated) return;

    const initAdminGIS = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (res) => {
              handleGoogleAuth(res);
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              type: 'standard',
              theme: 'filled_black',
              size: 'large',
              text: 'continue_with',
              shape: 'pill',
              logo_alignment: 'left',
              width: 320
            });
          }
        } catch (err) {
          console.warn('Admin GIS error:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initAdminGIS();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initAdminGIS();
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  const handleGoogleAuth = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setErrorMsg('');
    setIsLoading(true);

    const payload = decodeJwt(credentialResponse.credential);
    if (!payload || !payload.email) {
      setErrorMsg('Failed to read Google account identity.');
      setIsLoading(false);
      return;
    }

    const email = payload.email.toLowerCase().trim();
    if (email !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setErrorMsg(`Access Denied: This Google account is not authorized to access the administrator portal.`);
      setIsLoading(false);
      return;
    }

    // Email matches authorized master admin!
    setAdminUser(payload);
    sessionStorage.setItem('lorica_admin_email', email);
    sessionStorage.setItem('lorica_admin_token', 'google_authenticated_xydris');
    setIsAuthenticated(true);
    fetchDashboard('google_authenticated_xydris');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        sessionStorage.setItem('lorica_admin_token', password);
        setIsAuthenticated(true);
        fetchDashboard(password);
      } else {
        setErrorMsg(data.message || 'Incorrect password');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to admin server. Ensure API is deployed.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboard = async (token) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_dashboard', password: token || password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setIsAuthenticated(true);
        setStats(data.stats || { total_count: 0, totals_by_currency: {} });
        setDonations(data.donations || []);
        fetchUpcomingRenewals(token || password);
        if (data.config) {
          setConfig(data.config);
          setSettingsForm({
            paypal_email: data.config.paypal_email || '',
            paypal_client_id: data.config.paypal_client_id || '',
            paypal_mode: data.config.paypal_mode || 'sandbox',
            paypal_donation_link: data.config.paypal_donation_link || '',
            notification_email: data.config.notification_email || 'info@xydris.in',
            email_notifications_enabled: data.config.email_notifications_enabled !== false,
            new_admin_password: ''
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingRenewals = async (token) => {
    try {
      const res = await fetch('/api/admin-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_upcoming_renewals', password: token || password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUpcomingRenewals(data.upcoming_renewals || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunRenewalCron = async () => {
    setIsRunningCron(true);
    setCronRunResult('');
    try {
      const token = sessionStorage.getItem('lorica_admin_token') || password;
      const res = await fetch('/api/admin-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_renewal_reminders', password: token, key: token })
      });
      const data = await res.json();
      setCronRunResult(`Dispatched ${data.reminders_sent || 0} reminder email(s). ${data.skipped || 0} non-qualifying records skipped.`);
      fetchUpcomingRenewals(token);
    } catch (err) {
      setCronRunResult('Failed to run renewal reminder engine.');
    } finally {
      setIsRunningCron(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess('');
    try {
      const token = sessionStorage.getItem('lorica_admin_token') || password;
      const res = await fetch('/api/admin-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_settings',
          password: token,
          settings: settingsForm
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setSaveSuccess('Settings successfully updated! Security alert email dispatched.');
        if (settingsForm.new_admin_password) {
          sessionStorage.setItem('lorica_admin_token', settingsForm.new_admin_password);
          setPassword(settingsForm.new_admin_password);
        }
        fetchDashboard(token);
      }
    } catch (err) {
      setErrorMsg('Failed to save settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setIsTestingMail(true);
    setMailTestResult('');
    try {
      const token = sessionStorage.getItem('lorica_admin_token') || password;
      const res = await fetch('/api/admin-handler.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_email', password: token })
      });
      const data = await res.json();
      setMailTestResult(data.message);
    } catch (err) {
      setMailTestResult('Error sending test email.');
    } finally {
      setIsTestingMail(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lorica_admin_token');
    sessionStorage.removeItem('lorica_admin_email');
    setIsAuthenticated(false);
    setPassword('');
  };

  // Filtered donations
  const filteredDonations = donations.filter((d) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (d.payer_name && d.payer_name.toLowerCase().includes(q)) ||
      (d.payer_email && d.payer_email.toLowerCase().includes(q)) ||
      (d.tier && d.tier.toLowerCase().includes(q)) ||
      (d.txn_id && d.txn_id.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-gold-200">
                  Lorica Admin
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-bold">
                  RESTRICTED ACCESS
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-300 hover:text-white hover:border-red-500/40 flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Lock Portal</span>
              </button>
            )}
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 transition flex items-center gap-1.5 shadow"
            >
              <span>Back to Site</span>
            </button>
          </div>
        </div>

        {/* AUTHENTICATION VIEW */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-16 p-6 sm:p-8 rounded-3xl bg-obsidian-900 border border-gold-500/30 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-300 mx-auto">
                <ShieldCheck className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="font-serif text-xl font-bold text-gold-100">Lorica Admin</h2>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Primary: Google Sign In */}
            <div className="pt-2 flex justify-center">
              <div ref={googleBtnRef} className="min-h-[44px] flex items-center justify-center" />
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className="space-y-6">

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Benefactions</span>
                  <Heart className="w-4 h-4 text-red-400" />
                </div>
                <div className="font-mono text-3xl font-bold text-gold-300">
                  {stats.total_count}
                </div>
                <p className="text-[11px] text-slate-500">Live recorded patronage transactions</p>
              </div>

              <div className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Gross Volume</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-mono text-2xl font-bold text-emerald-400 flex flex-wrap gap-2 items-baseline">
                  {Object.entries(stats.totals_by_currency || {}).map(([curr, amt]) => (
                    <span key={curr} className="text-lg">
                      {curr === 'INR' ? '₹' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '$'}
                      {amt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                  ))}
                  {Object.keys(stats.totals_by_currency || {}).length === 0 && (
                    <span>$0.00</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Multicurrency donations received</p>
              </div>

              <div className="p-5 rounded-2xl bg-obsidian-900 border border-obsidian-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>PayPal Setup Status</span>
                  <ShieldCheck className="w-4 h-4 text-gold-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${config.paypal_email || config.paypal_client_id ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="font-mono text-sm font-bold text-slate-200">
                    {config.paypal_email ? 'Configured' : 'Needs Email/Client ID'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Mode: <strong className="text-gold-300 uppercase">{config.paypal_mode}</strong> • Alert: {config.notification_email}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-obsidian-800 pb-2">
              <button
                onClick={() => setActiveTab('donations')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'donations'
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Benefactor Inflows ({donations.length})
              </button>
              <button
                onClick={() => setActiveTab('paypal')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'paypal'
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PayPal Settings & Credentials
              </button>
              <button
                onClick={() => setActiveTab('renewals')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'renewals'
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>7-Day Renewal Reminders</span>
                {upcomingRenewals.filter(r => r.is_in_reminder_window).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'security'
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Email Alerts & Security
              </button>
            </div>

            {/* TAB 1: DONATIONS LEDGER */}
            {activeTab === 'donations' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search benefactor, email, or TXN..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-gold-500/50"
                    />
                  </div>
                  <button
                    onClick={() => fetchDashboard()}
                    className="px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 self-end"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl bg-obsidian-900 border border-obsidian-800 shadow-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-obsidian-950 text-slate-400 uppercase font-mono text-[10px] border-b border-obsidian-800">
                      <tr>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Benefactor</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Tier / Devotion</th>
                        <th className="py-3 px-4">Transaction ID</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-obsidian-800 font-mono text-[11px]">
                      {filteredDonations.map((d) => (
                        <tr key={d.id} className="hover:bg-obsidian-850/60 transition">
                          <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                            {d.created_at}
                          </td>
                          <td className="py-3.5 px-4 text-slate-200">
                            <div className="font-sans font-bold text-slate-100">{d.payer_name}</div>
                            <div className="text-[10px] text-slate-500">{d.payer_email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400 text-sm whitespace-nowrap">
                            {d.currency} {Number(d.amount).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 font-sans text-gold-300">
                            {d.tier}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[10px]">
                            {d.txn_id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredDonations.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-500 font-sans text-xs">
                            No donations matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PAYPAL SETTINGS */}
            {activeTab === 'paypal' && (
              <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-obsidian-900 border border-obsidian-800 space-y-6 shadow-xl max-w-2xl">
                <div className="border-b border-obsidian-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-gold-200">PayPal Gateway Configuration</h3>
                  <p className="text-xs text-slate-400">
                    Connect your verified PayPal Business account to accept worldwide card and PayPal benefactions.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{saveSuccess}</span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-mono text-slate-300 uppercase block mb-1 text-[11px]">
                      PayPal Primary Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. payments@xydris.in or your-paypal@email.com"
                      value={settingsForm.paypal_email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, paypal_email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 text-slate-100 font-mono outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Used for classic PayPal IPN or direct PayPal checkout buttons.
                    </span>
                  </div>

                  <div>
                    <label className="font-mono text-slate-300 uppercase block mb-1 text-[11px]">
                      PayPal REST API Client ID (Optional for Smart Buttons)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AbC123XyZ..."
                      value={settingsForm.paypal_client_id}
                      onChange={(e) => setSettingsForm({ ...settingsForm, paypal_client_id: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 text-slate-100 font-mono outline-none"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Obtained from developer.paypal.com dashboard under My Apps & Credentials.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-slate-300 uppercase block mb-1 text-[11px]">
                        Gateway Environment Mode
                      </label>
                      <select
                        value={settingsForm.paypal_mode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, paypal_mode: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 text-gold-300 font-mono outline-none cursor-pointer"
                      >
                        <option value="sandbox">Sandbox (Testing / Mock payments)</option>
                        <option value="live">Live (Real funds processed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-mono text-slate-300 uppercase block mb-1 text-[11px]">
                        Custom PayPal.me or Hosted Button URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://paypal.me/yourname"
                        value={settingsForm.paypal_donation_link}
                        onChange={(e) => setSettingsForm({ ...settingsForm, paypal_donation_link: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 text-slate-100 font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-2">
                    <span className="font-mono text-[10px] text-gold-400 uppercase tracking-wider block font-bold">
                      Webhook / IPN Listener URL (Configure in PayPal Dashboard)
                    </span>
                    <code className="text-[11px] text-slate-300 font-mono break-all block p-2 rounded-lg bg-obsidian-900 border border-obsidian-750">
                      https://loricaprayers.com/api/paypal-ipn.php
                    </code>
                    <p className="text-[10px] text-slate-500">
                      Enter this URL in your PayPal Account Settings under 'Instant Payment Notifications (IPN)' or Webhooks.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 transition flex items-center gap-2 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save PayPal Configuration</span>
                </button>
              </form>
            )}

            {/* TAB 4: 7-DAY RENEWAL REMINDERS */}
            {activeTab === 'renewals' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-obsidian-900 border border-obsidian-800 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-800 pb-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-gold-200 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-gold-400" />
                        <span>Automated 7-Day Renewal Reminder Schedule</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Benefactors on recurring monthly devotions automatically receive an advance courtesy notice 7 days prior to billing.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={handleRunRenewalCron}
                        disabled={isRunningCron}
                        className="px-4 py-2.5 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 transition flex items-center gap-2 shadow disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRunningCron ? 'animate-spin' : ''}`} />
                        <span>{isRunningCron ? 'Scanning & Sending...' : 'Trigger Reminder Check Now'}</span>
                      </button>
                    </div>
                  </div>

                  {cronRunResult && (
                    <div className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs text-gold-300 flex items-center gap-2 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
                      <span>{cronRunResult}</span>
                    </div>
                  )}

                  {/* Hostinger Cron Job Setup Guide */}
                  <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-2 text-xs">
                    <span className="font-mono text-[10px] text-gold-400 uppercase tracking-wider block font-bold">
                      Hostinger Daily Cron Job Command (Runs once daily at midnight)
                    </span>
                    <code className="text-[11px] text-slate-300 font-mono break-all block p-2.5 rounded-lg bg-obsidian-900 border border-obsidian-750">
                      curl -s "https://loricaprayers.com/api/renewal-cron.php?key=XydrisLorica@2026"
                    </code>
                    <p className="text-[10px] text-slate-500">
                      Configure in Hostinger Control Panel under <strong>Advanced &gt; Cron Jobs</strong> (Schedule: Once a day / <code>0 0 * * *</code>).
                    </p>
                  </div>
                </div>

                {/* Upcoming Renewals Table */}
                <div className="overflow-x-auto rounded-2xl bg-obsidian-900 border border-obsidian-800 shadow-xl">
                  <div className="p-4 border-b border-obsidian-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">
                      Active Recurring Benefactors ({upcomingRenewals.length})
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Sorted by days remaining until next renewal
                    </span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-obsidian-950 text-slate-400 uppercase font-mono text-[10px] border-b border-obsidian-800">
                      <tr>
                        <th className="py-3 px-4">Benefactor</th>
                        <th className="py-3 px-4">Plan / Devotion</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Next Renewal Date</th>
                        <th className="py-3 px-4">Days Left</th>
                        <th className="py-3 px-4">7-Day Notice Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-obsidian-800 font-mono text-[11px]">
                      {upcomingRenewals.map((r) => (
                        <tr key={r.id} className="hover:bg-obsidian-850/60 transition">
                          <td className="py-3.5 px-4 text-slate-200">
                            <div className="font-sans font-bold text-slate-100">{r.payer_name}</div>
                            <div className="text-[10px] text-slate-500">{r.payer_email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-sans text-gold-300">
                            {r.tier}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400 whitespace-nowrap">
                            {r.currency} {Number(r.amount).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                            {r.renewal_date}
                          </td>
                          <td className="py-3.5 px-4 font-bold">
                            <span className={r.days_remaining <= 7 ? 'text-amber-400' : 'text-slate-400'}>
                              {r.days_remaining} day{r.days_remaining === 1 ? '' : 's'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {r.is_in_reminder_window ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                                In 7-Day Window (Email Sent)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                                Scheduled
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {upcomingRenewals.length === 0 && (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-500 font-sans text-xs">
                            No active recurring benefactor subscriptions recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: EMAIL ALERTS & SECURITY */}
            {activeTab === 'security' && (
              <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-obsidian-900 border border-obsidian-800 space-y-6 shadow-xl max-w-2xl">
                <div className="border-b border-obsidian-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-gold-200">Email Notification & Security Settings</h3>
                  <p className="text-xs text-slate-400">
                    Receive instant alerts on incoming donations and automated security warnings if settings are altered.
                  </p>
                </div>

                {saveSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{saveSuccess}</span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-mono text-slate-300 uppercase block mb-1 text-[11px]">
                      Administrator Notification Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.notification_email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, notification_email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-800 focus:border-gold-500 text-slate-100 font-mono outline-none"
                      required
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      All new donation notices and settings modification security alerts will be dispatched here.
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800">
                    <input
                      type="checkbox"
                      id="email_enabled"
                      checked={settingsForm.email_notifications_enabled}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email_notifications_enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500"
                    />
                    <label htmlFor="email_enabled" className="text-xs text-slate-300 cursor-pointer">
                      <strong className="text-gold-200 block">Enable Automated Email Notifications</strong>
                      Send email alert immediately whenever a donation is confirmed or when PayPal settings are changed.
                    </label>
                  </div>

                  {/* Test Email Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={isTestingMail}
                      className="px-4 py-2 rounded-xl bg-obsidian-950 border border-obsidian-800 text-slate-300 hover:text-gold-300 text-xs flex items-center gap-2 transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-gold-400" />
                      <span>{isTestingMail ? 'Sending test email...' : 'Send Test Notification Email'}</span>
                    </button>
                    {mailTestResult && (
                      <p className="text-[11px] text-gold-300/90 mt-1.5 font-mono">{mailTestResult}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 transition flex items-center gap-2 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Notification & Security Rules</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
