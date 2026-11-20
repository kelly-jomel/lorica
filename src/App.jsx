import React, { useState } from 'react';
import WebsiteView from './components/WebsiteView';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import SanctuaryView from './components/SanctuaryView';
import AltarView from './components/AltarView';
import ExploreSectionsView from './components/ExploreSectionsView';
import ToolsView from './components/ToolsView';
import AskAngelGuardView from './components/AskAngelGuardView';
import AudioPlayerModal from './components/AudioPlayerModal';
import MiniPlayer from './components/MiniPlayer';
import BenefactorModal from './components/BenefactorModal';
import LiturgicalCalendarModal from './components/LiturgicalCalendarModal';
import NovenaDetailModal from './components/NovenaDetailModal';
import HiddenAdminView from './components/HiddenAdminView';
import BibleReaderModal from './components/BibleReaderModal';
import ConfessionHelperModal from './components/ConfessionHelperModal';
import DailyLiturgicalBanner from './components/DailyLiturgicalBanner';
import DailyRosaryModal from './components/DailyRosaryModal';
import SacredCardShareModal from './components/SacredCardShareModal';
import PrayerIntentionsModal from './components/PrayerIntentionsModal';
import UserProfileModal from './components/UserProfileModal';
import { authService } from './services/authService';
import { INITIAL_CANDLES } from './data/candlesData';
import { PRAYERS_DATA } from './data/prayersData';
import { soundEngine } from './services/soundEngine';
import { Smartphone, Globe, Shield, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation / Mode state: 'website' | 'app' | 'admin'
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#xydris-admin') {
        return 'admin';
      }
    }
    return 'website';
  });

  // Listen to hash changes for #admin
  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#xydris-admin') {
        setViewMode('admin');
      } else if (hash === '#portal' || hash === '#my-portal' || hash === '#profile' || hash === '#account' || hash === '#benefactor-portal') {
        setViewMode('website');
        setIsProfileOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  const [activeTab, setActiveTab] = useState('sanctuary');
  const [isPhoneMockup, setIsPhoneMockup] = useState(true);
  const [candles, setCandles] = useState(INITIAL_CANDLES);

  // Modals
  const [isBenefactorOpen, setIsBenefactorOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isBibleOpen, setIsBibleOpen] = useState(false);
  const [isConfessionOpen, setIsConfessionOpen] = useState(false);
  const [isRosaryOpen, setIsRosaryOpen] = useState(false);
  const [isIntentionsOpen, setIsIntentionsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => authService.getUser());
  const [shareCardItem, setShareCardItem] = useState(null);
  const [selectedNovena, setSelectedNovena] = useState(null);

  // Sync user authentication state
  React.useEffect(() => {
    const unsub = authService.subscribe((u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  // Check URL hash for direct links like #confession, #rosary, #intentions, #profile
  React.useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#confession' || hash === '#examination') {
        setIsConfessionOpen(true);
      } else if (hash === '#rosary' || hash === '#holy-rosary') {
        setIsRosaryOpen(true);
      } else if (hash === '#intentions' || hash === '#altar') {
        setIsIntentionsOpen(true);
      } else if (hash === '#profile' || hash === '#account' || hash === '#benefactor-portal' || hash === '#portal' || hash === '#my-portal') {
        setIsProfileOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Audio Player State
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Audio Play Trigger
  const handlePlayPrayer = (prayer) => {
    soundEngine.init();
    setCurrentPrayer(prayer);
    setIsFullPlayerOpen(true);
    setIsPlayingAudio(true);
  };

  // SOS Shield Trigger
  const handleOpenSOS = () => {
    const psalm91 = PRAYERS_DATA.find((p) => p.id === 'psalm-91');
    if (psalm91) {
      handlePlayPrayer(psalm91);
    }
  };

  const handleAddCandle = (newCandle) => {
    setCandles([newCandle, ...candles]);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 relative">
      {/* 0. HIDDEN ADMIN VIEW */}
      {viewMode === 'admin' ? (
        <HiddenAdminView
          onExitAdmin={() => {
            window.location.hash = '';
            setViewMode('website');
          }}
        />
      ) : viewMode === 'website' ? (
        <>
          <DailyLiturgicalBanner onOpenCalendar={() => setIsCalendarOpen(true)} />
          <WebsiteView
            onLaunchApp={() => setViewMode('app')}
            onPlayPrayer={handlePlayPrayer}
            onOpenBenefactor={() => setIsBenefactorOpen(true)}
            onOpenCalendar={() => setIsCalendarOpen(true)}
            onSelectNovena={(novena) => setSelectedNovena(novena)}
            onOpenBible={() => setIsBibleOpen(true)}
            onOpenConfession={() => setIsConfessionOpen(true)}
            onOpenRosary={() => setIsRosaryOpen(true)}
            onOpenIntentions={() => setIsIntentionsOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onShareCard={(item) => setShareCardItem(item)}
          />
        </>
      ) : (
        /* 2. SACRED SANCTUARY APP MODE */
        <div className="min-h-screen flex flex-col items-center justify-center py-0 sm:py-6 sm:px-4">
          <div
            className={`w-full transition-all duration-300 relative ${
              isPhoneMockup
                ? 'max-w-[430px] sm:h-[915px] sm:rounded-[48px] sm:border-[8px] sm:border-obsidian-700/80 sm:shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.15)] overflow-hidden bg-obsidian-950 flex flex-col'
                : 'max-w-4xl min-h-screen sm:min-h-0 sm:rounded-3xl sm:border sm:border-obsidian-800 bg-obsidian-950 flex flex-col'
            }`}
          >
            {/* Ambient Ember Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.15),transparent_70%)]" />

            {/* Dynamic Island in phone mode */}
            {isPhoneMockup && (
              <div className="hidden sm:flex justify-center pt-2.5 pb-1 bg-obsidian-950 shrink-0">
                <div className="w-24 h-4 bg-obsidian-850 rounded-full border border-obsidian-750 flex items-center justify-end px-2">
                  <span className="w-2 h-2 rounded-full bg-obsidian-950" />
                </div>
              </div>
            )}

            {/* Top Navbar */}
            <Navbar
              isPhoneMockup={isPhoneMockup}
              setIsPhoneMockup={setIsPhoneMockup}
              onOpenSOS={handleOpenSOS}
              onOpenBenefactor={() => setIsBenefactorOpen(true)}
              onOpenCalendar={() => setIsCalendarOpen(true)}
              onOpenBible={() => setIsBibleOpen(true)}
              onSwitchToWebsite={() => setViewMode('website')}
            />

            {/* Scrollable View Content */}
            <main className="flex-1 overflow-y-auto px-4 py-2 relative z-10">
              {activeTab === 'sanctuary' && (
                <SanctuaryView
                  onPlayPrayer={handlePlayPrayer}
                  setActiveTab={setActiveTab}
                  unreadCandlesCount={candles.length}
                  onOpenBenefactor={() => setIsBenefactorOpen(true)}
                  onOpenCalendar={() => setIsCalendarOpen(true)}
                  onOpenBible={() => setIsBibleOpen(true)}
                />
              )}

              {activeTab === 'altar' && (
                <AltarView candles={candles} onAddCandle={handleAddCandle} />
              )}

              {(activeTab === 'explore' || activeTab === 'library') && (
                <ExploreSectionsView
                  onPlayPrayer={handlePlayPrayer}
                  onSelectTool={(tool) => setActiveTab('tools')}
                  onSelectNovena={(novena) => setSelectedNovena(novena)}
                  onOpenBible={() => setIsBibleOpen(true)}
                />
              )}

              {activeTab === 'tools' && <ToolsView />}

              {activeTab === 'ask' && (
                <AskAngelGuardView onPlayPrayer={handlePlayPrayer} />
              )}
            </main>

            {/* Mini Player Bar in App */}
            {!isFullPlayerOpen && currentPrayer && (
              <MiniPlayer
                prayer={currentPrayer}
                isPlaying={isPlayingAudio}
                onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
                onOpenFullPlayer={() => setIsFullPlayerOpen(true)}
                onClose={() => {
                  soundEngine.stopAll();
                  setCurrentPrayer(null);
                }}
              />
            )}

            {/* Bottom Tab Bar */}
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      )}

      {/* Floating Toggle Pill: Switch between Website and Sanctuary App */}
      {viewMode !== 'website' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setViewMode('website')}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-obsidian-900/90 border border-gold-500/50 text-gold-200 font-bold text-xs sm:text-sm shadow-[0_0_30px_rgba(212,175,55,0.35)] backdrop-blur-md hover:bg-gold-500 hover:text-obsidian-950 transition-all active:scale-95 group"
          >
            <Globe className="w-4 h-4 text-gold-400 group-hover:text-obsidian-950 transition-colors" />
            <span>Back to Website</span>
          </button>
        </div>
      )}

      {/* Mini Player Bar on Website view */}
      {viewMode === 'website' && !isFullPlayerOpen && currentPrayer && (
        <MiniPlayer
          prayer={currentPrayer}
          isPlaying={isPlayingAudio}
          onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
          onOpenFullPlayer={() => setIsFullPlayerOpen(true)}
          onClose={() => {
            soundEngine.stopAll();
            setCurrentPrayer(null);
          }}
        />
      )}

      {/* Full-Screen Sacred Audio Player Modal */}
      {isFullPlayerOpen && currentPrayer && (
        <AudioPlayerModal
          prayer={currentPrayer}
          onClose={() => setIsFullPlayerOpen(false)}
        />
      )}

      {/* 9-Day Interactive Novena Guide & Reader Modal */}
      <NovenaDetailModal
        novena={selectedNovena}
        isOpen={!!selectedNovena}
        onClose={() => setSelectedNovena(null)}
        onPlayAudio={handlePlayPrayer}
      />

      {/* Benefactor / Pay It Forward Covenant Modal */}
      <BenefactorModal
        isOpen={isBenefactorOpen}
        onClose={() => setIsBenefactorOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Pilgrim User & Benefactor Portal Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onSignIn={(newUser) => {
          authService.saveUser(newUser);
          setCurrentUser(newUser);
        }}
        onSignOut={() => {
          authService.signOut();
          setCurrentUser(null);
        }}
      />

      {/* Catholic Liturgical Calendar Modal */}
      <LiturgicalCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onPlayPrayer={handlePlayPrayer}
      />

      {/* Catholic Holy Bible Reader Modal */}
      <BibleReaderModal
        isOpen={isBibleOpen}
        onClose={() => setIsBibleOpen(false)}
        onAskAngel={(prompt) => {
          setIsBibleOpen(false);
          setActiveTab('ask');
        }}
      />

      {/* Catholic Examination of Conscience & Confession Helper */}
      <ConfessionHelperModal
        isOpen={isConfessionOpen}
        onClose={() => {
          setIsConfessionOpen(false);
          if (window.location.hash === '#confession' || window.location.hash === '#examination') {
            window.location.hash = '';
          }
        }}
        onPlayPrayer={handlePlayPrayer}
      />

      {/* Daily Holy Rosary Modal with Latin / English Mode */}
      <DailyRosaryModal
        isOpen={isRosaryOpen}
        onClose={() => {
          setIsRosaryOpen(false);
          if (window.location.hash === '#rosary' || window.location.hash === '#holy-rosary') {
            window.location.hash = '';
          }
        }}
        onPlayAudio={handlePlayPrayer}
      />

      {/* Community Prayer Intentions & Altar Modal */}
      <PrayerIntentionsModal
        isOpen={isIntentionsOpen}
        onClose={() => {
          setIsIntentionsOpen(false);
          if (window.location.hash === '#intentions' || window.location.hash === '#altar') {
            window.location.hash = '';
          }
        }}
      />

      {/* Sacred Social Card Share Modal */}
      <SacredCardShareModal
        isOpen={!!shareCardItem}
        onClose={() => setShareCardItem(null)}
        item={shareCardItem}
      />
    </div>
  );
}
