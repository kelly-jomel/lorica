import React, { useState } from 'react';
import { Sparkles, Send, BookOpen, Play, Shield, HeartHandshake, Flame, Moon, ArrowRight } from 'lucide-react';
import { PRAYERS_DATA } from '../data/prayersData';
import { soundEngine } from '../services/soundEngine';

export default function AskAngelGuardView({ onPlayPrayer }) {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Peace be with you. I am Lorica, your spiritual companion grounded in Catholic theology, Holy Scripture, and Church tradition. Tell me what is weighing upon your heart, whether fear in the night, moral combat, or grief, and we will find your scriptural anchor.",
      prayerRecommendation: null,
      verse: null
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Preset quick triggers
  const triageOptions = [
    { label: "Can't Sleep & Mind Racing", query: "I cannot sleep, my mind is racing with fearful thoughts and panic." },
    { label: "Under Spiritual Attack", query: "I feel oppressed by dark thoughts, despair, and spiritual combat." },
    { label: "Struggling to Forgive", query: "I feel deep bitterness and resentment toward someone who betrayed me." },
    { label: "Grieving a Lost Loved One", query: "My heart is shattered with grief and I feel an empty void." }
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    soundEngine.init();

    // Add user message
    const newMessages = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    // Simulate thoughtful theological RAG match
    setTimeout(() => {
      let responseText = "";
      let recommendedPrayer = null;
      let verseData = null;

      const lower = query.toLowerCase();

      if (lower.includes('sleep') || lower.includes('night') || lower.includes('racing') || lower.includes('insomnia')) {
        responseText = "The night can feel like an amplifier for every worry. Remember: sleep is an act of trust in God's sovereignty. The angels of God have been given charge over you, and Christ has already commanded the winds to be calm. Let your breath slow and lay your defensiveness down.";
        verseData = {
          ref: "Psalm 4:8",
          text: "In peace in the selfsame I will sleep, and I will rest: For thou, O Lord, singularly hast settled me in hope."
        };
        recommendedPrayer = PRAYERS_DATA.find(p => p.id === 'psalm-91');
      } else if (lower.includes('attack') || lower.includes('dark') || lower.includes('oppress') || lower.includes('devil') || lower.includes('evil')) {
        responseText = "Do not be alarmed by the enemy's noise; a barking dog cannot bite while chained to Christ's cross. You are clothed in the Armor of God. Invoke the supreme Prince of the Heavenly Host to drive this darkness out of your dwelling.";
        verseData = {
          ref: "Ephesians 6:11-12",
          text: "Put you on the armour of God, that you may be able to stand against the deceits of the devil. For our wrestling is not against flesh and blood."
        };
        recommendedPrayer = PRAYERS_DATA.find(p => p.id === 'st-michael');
      } else if (lower.includes('forgive') || lower.includes('bitter') || lower.includes('anger') || lower.includes('resent')) {
        responseText = "Forgiveness is not excusing wrongdoing or pretending the wound did not bleed. Forgiveness is handing the executioner's sword back to God and releasing the poison from your own cup. Let Christ take this wound into His own Sacred Heart.";
        verseData = {
          ref: "Colossians 3:13",
          text: "Bearing with one another, and forgiving one another, if any have a complaint against another: even as the Lord hath forgiven you, so do you also."
        };
        recommendedPrayer = PRAYERS_DATA.find(p => p.id === 'divine-mercy');
      } else {
        responseText = "Whatever cross you are bearing right now, Christ has already walked that exact stone path ahead of you in Gethsemane. You do not have to conquer this hour alone. Cast your care upon Him, because He careth for you.";
        verseData = {
          ref: "1 Peter 5:7",
          text: "Casting all your care upon him, for he hath care of you."
        };
        recommendedPrayer = PRAYERS_DATA.find(p => p.id === 'anxiety-calm');
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: responseText,
          verse: verseData,
          prayerRecommendation: recommendedPrayer
        }
      ]);
      setIsTyping(false);
      soundEngine.playBell(440);
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-28 pt-2 max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-bold text-gold-200">Ask Lorica</h2>
          <p className="text-xs text-slate-400">Theological compass rooted in Scripture & Tradition</p>
        </div>
      </div>

      {/* Quick Spiritual Triage Chips */}
      <div>
        <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
          Where does the spirit ache?
        </span>
        <div className="flex flex-wrap gap-1.5">
          {triageOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSend(opt.query)}
              className="text-xs px-3 py-1.5 rounded-full bg-obsidian-900 border border-obsidian-750 text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition active:scale-95"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-3 pt-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gold-500/15 border border-gold-500/30 text-slate-100 rounded-tr-sm'
                  : 'bg-obsidian-900/90 border border-obsidian-800 text-slate-200 rounded-tl-sm shadow-xl'
              }`}
            >
              <p className="font-sans whitespace-pre-wrap">{msg.text}</p>

              {/* Scripture Anchor Card */}
              {msg.verse && (
                <div className="mt-3 p-3 rounded-xl bg-obsidian-950 border border-gold-500/30 text-left">
                  <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block mb-1">
                    Scripture Anchor • {msg.verse.ref}
                  </span>
                  <p className="font-reading italic text-xs text-slate-200">
                    "{msg.verse.text}"
                  </p>
                </div>
              )}

              {/* Direct Prayer Recommendation CTA */}
              {msg.prayerRecommendation && (
                <div className="mt-3 pt-3 border-t border-obsidian-800 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Recommended Audio Prayer:</span>
                    <span className="font-serif font-bold text-xs text-gold-300 block">
                      {msg.prayerRecommendation.title}
                    </span>
                  </div>
                  <button
                    onClick={() => onPlayPrayer(msg.prayerRecommendation)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 text-obsidian-950 font-bold text-xs hover:brightness-110 active:scale-95 transition shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Pray</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-obsidian-900 border border-obsidian-800 w-28 text-slate-400">
            <span className="text-xs">Consulting...</span>
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          placeholder="Speak what is on your mind..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/60 shadow-xl"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="p-3 rounded-2xl bg-gold-500 text-obsidian-950 font-bold hover:brightness-110 disabled:opacity-40 transition active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
