import React, { useState } from 'react';
import WebsiteView from './components/WebsiteView';
import AudioPlayerModal from './components/AudioPlayerModal';
import MiniPlayer from './components/MiniPlayer';
import BenefactorModal from './components/BenefactorModal';
import LiturgicalCalendarModal from './components/LiturgicalCalendarModal';
import NovenaDetailModal from './components/NovenaDetailModal';
import { PRAYERS_DATA } from './data/prayersData';
import { soundEngine } from './services/soundEngine';

export default function App() {
  const [isBenefactorOpen, setIsBenefactorOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedNovena, setSelectedNovena] = useState(null);

  // Audio Player State
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayPrayer = (prayer) => {
    soundEngine.init();
    setCurrentPrayer(prayer);
    setIsFullPlayerOpen(true);
    setIsPlayingAudio(true);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 relative">
      {/* 1. STANDALONE INDEPENDENT PUBLIC WEBSITE */}
      <WebsiteView 
        onPlayPrayer={handlePlayPrayer}
        onOpenBenefactor={() => setIsBenefactorOpen(true)}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onSelectNovena={(novena) => setSelectedNovena(novena)}
      />

      {/* Mini Player Bar (if modal is minimized while audio continues) */}
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
      />

      {/* Catholic Liturgical Calendar Modal */}
      <LiturgicalCalendarModal 
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onPlayPrayer={handlePlayPrayer}
      />
    </div>
  );
}
