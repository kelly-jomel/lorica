import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Check, 
  Flame, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Heart
} from 'lucide-react';
import { 
  CATHOLIC_BIBLE_BOOKS, 
  CATHOLIC_TRANSLATIONS, 
  CATHOLIC_FEATURED_READINGS, 
  fetchChapter 
} from '../services/bibleService';
import { soundEngine } from '../services/soundEngine';

export default function BibleReaderModal({ isOpen, onClose, onAskAngel, initialBookId = 19, initialChapter = 23 }) {
  const [translation, setTranslation] = useState('NABRE');
  const [selectedBook, setSelectedBook] = useState(() => 
    CATHOLIC_BIBLE_BOOKS.find(b => b.bookid === initialBookId) || CATHOLIC_BIBLE_BOOKS[0]
  );
  const [currentChapter, setCurrentChapter] = useState(initialChapter);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selector Drawer states
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
  const [bookFilter, setBookFilter] = useState('ALL'); // 'ALL' | 'OT' | 'NT' | 'DEUTERO'
  const [searchQuery, setSearchQuery] = useState('');

  // Reader Customization
  const [fontSize, setFontSize] = useState('text-base'); // 'text-sm' | 'text-base' | 'text-lg' | 'text-xl'
  const [ambientAudio, setAmbientAudio] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [bookmarkedVerses, setBookmarkedVerses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lorica_bible_bookmarks') || '[]');
    } catch {
      return [];
    }
  });
  const [copiedVerse, setCopiedVerse] = useState(null);

  const contentRef = useRef(null);

  // Load Chapter
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setSelectedVerse(null);

    fetchChapter(translation, selectedBook.bookid, currentChapter)
      .then((data) => {
        if (isMounted) {
          setVerses(data);
          setLoading(false);
          if (contentRef.current) {
            contentRef.current.scrollTop = 0;
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to load Scripture. Please check your network.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, translation, selectedBook.bookid, currentChapter]);

  // Handle Ambient Audio Toggle
  const toggleAmbientAudio = () => {
    soundEngine.init();
    if (!ambientAudio) {
      soundEngine.toggleSoundscape('monastery');
      setAmbientAudio(true);
    } else {
      soundEngine.stopAllSoundscapes();
      setAmbientAudio(false);
    }
  };

  // Chapter Navigation
  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(prev => prev - 1);
    } else {
      // Go to previous book if available
      const currentIndex = CATHOLIC_BIBLE_BOOKS.findIndex(b => b.bookid === selectedBook.bookid);
      if (currentIndex > 0) {
        const prevBook = CATHOLIC_BIBLE_BOOKS[currentIndex - 1];
        setSelectedBook(prevBook);
        setCurrentChapter(prevBook.chapters);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < selectedBook.chapters) {
      setCurrentChapter(prev => prev + 1);
    } else {
      // Go to next book
      const currentIndex = CATHOLIC_BIBLE_BOOKS.findIndex(b => b.bookid === selectedBook.bookid);
      if (currentIndex < CATHOLIC_BIBLE_BOOKS.length - 1) {
        const nextBook = CATHOLIC_BIBLE_BOOKS[currentIndex + 1];
        setSelectedBook(nextBook);
        setCurrentChapter(1);
      }
    }
  };

  // Bookmark verse
  const handleToggleBookmark = (verse) => {
    const bookmarkKey = `${selectedBook.name} ${currentChapter}:${verse.verse} (${translation})`;
    let updated;
    const exists = bookmarkedVerses.some(b => b.key === bookmarkKey);

    if (exists) {
      updated = bookmarkedVerses.filter(b => b.key !== bookmarkKey);
    } else {
      const newBookmark = {
        key: bookmarkKey,
        bookName: selectedBook.name,
        bookId: selectedBook.bookid,
        chapter: currentChapter,
        verse: verse.verse,
        text: verse.text,
        translation,
        date: new Date().toLocaleDateString()
      };
      updated = [newBookmark, ...bookmarkedVerses];
    }

    setBookmarkedVerses(updated);
    try {
      localStorage.setItem('lorica_bible_bookmarks', JSON.stringify(updated));
    } catch (e) {}
  };

  // Copy verse to clipboard
  const handleCopyVerse = (verse) => {
    const textToCopy = `"${verse.text}"\n— ${selectedBook.name} ${currentChapter}:${verse.verse} (${translation}) [Lorica Sacred Scripture]`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerse(verse.verse);
    setTimeout(() => setCopiedVerse(null), 2500);
  };

  // Send to Angel Guard / Lorica AI for Catholic Commentary
  const handleAskAIAboutVerse = (verse) => {
    if (onAskAngel) {
      onAskAngel(
        `Can you explain the Catholic theological meaning and church father commentary on this scripture verse: "${verse.text}" (${selectedBook.name} ${currentChapter}:${verse.verse})?`
      );
      onClose();
    }
  };

  if (!isOpen) return null;

  // Filter books for picker
  const filteredBooks = CATHOLIC_BIBLE_BOOKS.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (bookFilter === 'OT') return book.testament === 'OT';
    if (bookFilter === 'NT') return book.testament === 'NT';
    if (bookFilter === 'DEUTERO') return !!book.isDeuterocanonical;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fade-in">
      <div className="w-full h-full sm:max-w-3xl sm:h-[92vh] bg-obsidian-900 sm:rounded-3xl border border-obsidian-700/80 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-slate-100 relative">
        
        {/* TOP BAR / HEADER */}
        <div className="px-4 py-3 border-b border-obsidian-800 bg-obsidian-950/70 flex items-center justify-between gap-2 z-20">
          {/* Book & Chapter Selector Button */}
          <button 
            onClick={() => setIsBookPickerOpen(!isBookPickerOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-obsidian-800/80 hover:bg-gold-500/10 border border-gold-500/30 text-gold-300 font-serif text-sm transition-all"
          >
            <BookOpen className="w-4 h-4 text-gold-400" />
            <span className="font-semibold">{selectedBook.name}</span>
            <span className="text-gold-200/90 font-mono text-xs">{currentChapter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gold-400/80 ml-0.5" />
          </button>

          {/* Translation Picker */}
          <div className="flex items-center gap-1.5">
            <div className="flex bg-obsidian-950 rounded-lg p-0.5 border border-obsidian-800">
              {CATHOLIC_TRANSLATIONS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTranslation(t.id)}
                  title={t.title}
                  className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    translation === t.id 
                      ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Ambient Monastery Soundscape Toggle */}
            <button
              onClick={toggleAmbientAudio}
              title={ambientAudio ? "Mute Abbey Soundscape" : "Play Abbey Ambient Chants"}
              className={`p-2 rounded-xl transition-all border ${
                ambientAudio 
                  ? 'bg-candle-flame/20 border-candle-flame text-candle-flame animate-pulse' 
                  : 'bg-obsidian-800/60 border-obsidian-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {ambientAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-obsidian-800/60 hover:bg-obsidian-800 border border-obsidian-700 text-slate-300 hover:text-white transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BOOK & CHAPTER PICKER DRAWER / MODAL */}
        {isBookPickerOpen && (
          <div className="absolute inset-x-0 top-[57px] bottom-0 z-30 bg-obsidian-950/95 backdrop-blur-2xl flex flex-col p-4 border-b border-obsidian-800 animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-obsidian-800/80 gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 73 Catholic books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-500/50"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1 text-[11px] font-medium">
                {[
                  { id: 'ALL', label: 'All 73' },
                  { id: 'OT', label: 'OT (46)' },
                  { id: 'NT', label: 'NT (27)' },
                  { id: 'DEUTERO', label: 'Deutero' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setBookFilter(tab.id)}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                      bookFilter === tab.id
                        ? 'bg-gold-500/20 border-gold-500/40 text-gold-300'
                        : 'border-obsidian-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Featured Catholic Readings */}
            {searchQuery === '' && bookFilter === 'ALL' && (
              <div className="py-3 border-b border-obsidian-800/80">
                <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold mb-2 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Key Catholic Readings
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {CATHOLIC_FEATURED_READINGS.map((feat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const targetBook = CATHOLIC_BIBLE_BOOKS.find(b => b.bookid === feat.bookId);
                        if (targetBook) {
                          setSelectedBook(targetBook);
                          setCurrentChapter(feat.chapter);
                          setIsBookPickerOpen(false);
                        }
                      }}
                      className="flex-shrink-0 text-left px-3 py-1.5 rounded-xl bg-obsidian-900/90 hover:bg-gold-500/10 border border-obsidian-800 hover:border-gold-500/30 text-xs transition-all"
                    >
                      <div className="font-semibold text-gold-300">{feat.title}</div>
                      <div className="text-[10px] text-slate-400">{feat.bookName} {feat.chapter}:{feat.verseRange}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Books & Chapters List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredBooks.map((book) => {
                  const isCurrent = book.bookid === selectedBook.bookid;
                  return (
                    <div 
                      key={book.bookid}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? 'bg-gold-500/15 border-gold-500/50 text-gold-200' 
                          : 'bg-obsidian-900/70 border-obsidian-800/80 hover:border-obsidian-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-medium text-sm truncate">{book.name}</span>
                        {book.isDeuterocanonical && (
                          <span className="text-[9px] bg-gold-500/20 text-gold-300 px-1 py-0.5 rounded font-mono">
                            Deutero
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-obsidian-800/50">
                        <span className="text-[10px] text-slate-400 font-mono">{book.chapters} chs</span>
                        {/* Chapter quick selector modal trigger */}
                        <div className="flex gap-1 overflow-x-auto max-w-[130px] scrollbar-none">
                          {[1, 2, 3].slice(0, book.chapters).map(ch => (
                            <button
                              key={ch}
                              onClick={() => {
                                setSelectedBook(book);
                                setCurrentChapter(ch);
                                setIsBookPickerOpen(false);
                              }}
                              className="px-1.5 py-0.5 rounded bg-obsidian-800 hover:bg-gold-500/30 text-[10px] text-slate-300 font-mono"
                            >
                              {ch}
                            </button>
                          ))}
                          {book.chapters > 3 && (
                            <button
                              onClick={() => {
                                setSelectedBook(book);
                                setCurrentChapter(1);
                                setIsBookPickerOpen(false);
                              }}
                              className="px-1.5 py-0.5 rounded bg-obsidian-800 hover:bg-gold-500/30 text-[10px] text-gold-400 font-mono"
                            >
                              +{book.chapters - 3}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MAIN SCRIPTURE READING VIEW */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-5 sm:px-10 py-6 relative">
          
          {/* Chapter Heading Banner */}
          <div className="text-center max-w-xl mx-auto mb-8 pb-6 border-b border-obsidian-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-mono mb-2">
              <span>{selectedBook.testament === 'OT' ? 'Old Testament' : 'New Testament'}</span>
              <span>•</span>
              <span>{selectedBook.category}</span>
              {selectedBook.isDeuterocanonical && <span>• Deuterocanonical</span>}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-gold-200 tracking-wide">
              {selectedBook.name}
            </h1>
            <p className="font-serif italic text-slate-400 text-lg mt-1">
              Chapter {currentChapter}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-widest">
              Roman Catholic • {translation}
            </p>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Flame className="w-8 h-8 text-candle-flame animate-pulse" />
              <p className="font-serif text-sm text-gold-300/80">Illuminating Holy Scripture...</p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/50 text-center max-w-md mx-auto my-12">
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={() => {
                  fetchChapter(translation, selectedBook.bookid, currentChapter)
                    .then(setVerses)
                    .catch(e => setError(e.message));
                }}
                className="mt-3 px-4 py-1.5 rounded-xl bg-red-900/40 text-red-200 hover:bg-red-800/40 text-xs font-medium border border-red-700/50"
              >
                Retry
              </button>
            </div>
          )}

          {/* Scripture Verses */}
          {!loading && !error && (
            <div className={`max-w-2xl mx-auto space-y-3 font-serif leading-relaxed ${fontSize} text-slate-200`}>
              {verses.map((verse) => {
                const isSelected = selectedVerse?.verse === verse.verse;
                const isBookmarked = bookmarkedVerses.some(
                  b => b.bookId === selectedBook.bookid && b.chapter === currentChapter && b.verse === verse.verse
                );

                return (
                  <div
                    key={verse.verse}
                    onClick={() => setSelectedVerse(isSelected ? null : verse)}
                    className={`group relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-gold-500/15 border border-gold-500/40 text-amber-100 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                        : isBookmarked
                        ? 'bg-obsidian-800/40 border-l-2 border-gold-400'
                        : 'hover:bg-obsidian-800/50'
                    }`}
                  >
                    <span className="font-mono text-[11px] font-bold text-gold-400/90 mr-2 select-none align-super">
                      {verse.verse}
                    </span>
                    <span className="tracking-wide">
                      {verse.text}
                    </span>

                    {/* Bookmark indicator icon */}
                    {isBookmarked && (
                      <Bookmark className="w-3.5 h-3.5 inline text-gold-400 fill-gold-400 ml-1.5 align-baseline" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FLOATING ACTION TOOLBAR (When verse is tapped) */}
        {selectedVerse && (
          <div className="absolute bottom-16 left-4 right-4 sm:left-12 sm:right-12 z-20 bg-obsidian-950/95 border border-gold-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-2xl p-2.5 flex items-center justify-between gap-2 backdrop-blur-xl animate-fade-in">
            <div className="text-xs font-serif text-gold-300 truncate max-w-[150px] sm:max-w-xs pl-2">
              {selectedBook.name} {currentChapter}:{selectedVerse.verse}
            </div>
            
            <div className="flex items-center gap-1">
              {/* Bookmark */}
              <button
                onClick={() => handleToggleBookmark(selectedVerse)}
                className="p-2 rounded-xl bg-obsidian-900 hover:bg-gold-500/20 text-gold-300 border border-obsidian-800 transition-all"
                title="Bookmark Verse"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              {/* Copy */}
              <button
                onClick={() => handleCopyVerse(selectedVerse)}
                className="p-2 rounded-xl bg-obsidian-900 hover:bg-gold-500/20 text-gold-300 border border-obsidian-800 transition-all"
                title="Copy Verse"
              >
                {copiedVerse === selectedVerse.verse ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Ask Angel Guard / Catholic AI */}
              {onAskAngel && (
                <button
                  onClick={() => handleAskAIAboutVerse(selectedVerse)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-200 border border-gold-500/40 text-xs font-medium transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  <span>Explain with Church Fathers</span>
                </button>
              )}

              {/* Close selection */}
              <button
                onClick={() => setSelectedVerse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION FOOTER */}
        <div className="px-4 py-3 border-t border-obsidian-800 bg-obsidian-950/90 flex items-center justify-between gap-3 z-10">
          {/* Previous Chapter */}
          <button
            onClick={handlePrevChapter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-800/70 hover:bg-obsidian-800 border border-obsidian-700 text-xs text-slate-300 font-medium transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Chapter</span>
          </button>

          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-obsidian-800">
            <button
              onClick={() => setFontSize('text-sm')}
              className={`px-2 py-0.5 rounded text-xs ${fontSize === 'text-sm' ? 'bg-gold-500/20 text-gold-300' : 'text-slate-400'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('text-base')}
              className={`px-2 py-0.5 rounded text-xs ${fontSize === 'text-base' ? 'bg-gold-500/20 text-gold-300' : 'text-slate-400'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('text-lg')}
              className={`px-2 py-0.5 rounded text-xs ${fontSize === 'text-lg' ? 'bg-gold-500/20 text-gold-300' : 'text-slate-400'}`}
            >
              A+
            </button>
          </div>

          {/* Next Chapter */}
          <button
            onClick={handleNextChapter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-800/70 hover:bg-obsidian-800 border border-obsidian-700 text-xs text-slate-300 font-medium transition-all"
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
