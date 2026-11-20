import React, { useState, useEffect, useRef } from 'react';
import { LogIn, LogOut, User, Check, Shield } from 'lucide-react';
import { authService, GOOGLE_CLIENT_ID } from '../services/authService';

export default function AuthButton() {
  const [user, setUser] = useState(() => authService.getUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const unsub = authService.subscribe((u) => setUser(u));
    return () => unsub();
  }, []);

  // Initialize Google Identity Services when not logged in
  useEffect(() => {
    if (user) return;

    const initGIS = () => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (res) => {
              authService.handleCredentialResponse(res);
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (buttonRef.current) {
            buttonRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(buttonRef.current, {
              type: 'standard',
              theme: 'filled_black',
              size: 'medium',
              text: 'signin_with',
              shape: 'pill',
              logo_alignment: 'left'
            });
          }
        } catch (err) {
          console.warn('GIS initialization error:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGIS();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initGIS();
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [user]);

  const handleSignOut = () => {
    authService.signOut();
    setIsMenuOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center">
        {/* Render target for Google Sign In Button */}
        <div ref={buttonRef} className="min-h-[32px] flex items-center" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-obsidian-900 border border-gold-500/40 hover:border-gold-400 transition text-xs shadow-[0_0_12px_rgba(212,175,55,0.2)]"
        title={user.email}
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-6 h-6 rounded-full object-cover border border-gold-400"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold text-xs">
            {user.name.charAt(0)}
          </div>
        )}
        <span className="font-medium text-slate-200 hidden sm:inline max-w-[100px] truncate">
          {user.givenName || user.name}
        </span>
      </button>

      {/* User Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-obsidian-900 border border-gold-500/30 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-3 pb-3 border-b border-obsidian-800">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-gold-400/60"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-serif font-bold text-sm text-gold-100 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate font-mono">{user.email}</p>
            </div>
          </div>

          <div className="py-2 space-y-1 text-xs">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-300">
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              <span>Pilgrim Account Active</span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-obsidian-950 hover:bg-red-950/40 text-slate-300 hover:text-red-300 border border-obsidian-800 hover:border-red-500/30 text-xs font-medium transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
