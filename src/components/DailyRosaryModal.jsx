import React, { useState } from 'react';
import { 
  Disc, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Languages, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  X,
  BookOpen
} from 'lucide-react';
import { ROSARY_MYSTERIES, getTodayMystery } from '../data/rosaryData';
import { soundEngine } from '../services/soundEngine';

export const LATIN_ROSARY_PRAYERS = {
  signum: {
    latin: "In nómine Patris, et Fílii, et Spíritus Sancti. Amen.",
    english: "In the Name of the Father, and of the Son, and of the Holy Spirit. Amen."
  },
  creed: {
    latin: "Credo in Deum Patrem omnipoténtem, Creatórem cæli et terræ. Et in Iesum Christum, Fílium eius únicum, Dóminum nostrum: qui concéptus est de Spíritu Sancto, natus ex María Vírgine, passus sub Póntio Piláto, crucifíxus, mórtuus, et sepúltus: descéndit ad ínferos; tértia die resurréxit a mórtuis; ascéndit ad cælos; sedet ad déxteram Dei Patris omnipoténtis: inde ventúrus est iudicáre vivos et mórtuos. Credo in Spíritum Sanctum, sanctam Ecclésiam cathólicam, sanctórum communiónem, remissiónem peccatórum, carnis resurrectiónem, vitam ætérnam. Amen.",
    english: "I believe in God, the Father Almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord: Who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and sitteth at the right hand of God the Father Almighty; from thence He shall come to judge the living and the dead. I believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen."
  },
  pater: {
    latin: "Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum. Fiat volúntas tua, sicut in cælo et in terra. Panem nostrum cotidiánum da nobis hódie, et dimítte nobis débita nostra sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem: sed líbera nos a malo. Amen.",
    english: "Our Father, Who art in heaven, hallowed be Thy Name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen."
  },
  ave: {
    latin: "Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostræ. Amen.",
    english: "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
  },
  gloria: {
    latin: "Glória Patri, et Fílio, et Spíritui Sancto. Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.",
    english: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen."
  },
  fatima: {
    latin: "O mi Iesu, dimítte nobis débita nostra, líbera nos ab ígnibus inférni, pérduc in cælum omnes ánimas, præsértim eas quæ máxime índigent misericórdia tua.",
    english: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those who have most need of Thy mercy. Amen."
  },
  salve: {
    latin: "Salve Regína, Mater misericórdiæ, vita, dulcédo, et spes nostra, salve. Ad te clamámus éxsules fílii Hevæ. Ad te suspirámus geméntes et flentes in hac lacrimárum valle. Eia ergo, advocáta nostra, illos tuos misericórdes óculos ad nos convérte. Et Iesum, benedíctum fructum ventris tui, nobis post hoc exsílium osténde. O clemens, o pia, o dulcis Virgo María. Amen.",
    english: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Amen."
  }
};

export default function DailyRosaryModal({ isOpen, onClose, onPlayAudio }) {
  const [selectedMysteryKey, setSelectedMysteryKey] = useState(() => {
    const today = getTodayMystery();
    return today.id || 'joyful';
  });
  
  const [currentDecadeIndex, setCurrentDecadeIndex] = useState(0); // 0 to 4
  const [beadProgress, setBeadProgress] = useState(0); // 0 to 10 (0: Our Father, 1-10: Hail Marys)
  const [language, setLanguage] = useState('latin'); // 'latin' | 'english'

  if (!isOpen) return null;

  const currentMystery = ROSARY_MYSTERIES[selectedMysteryKey] || ROSARY_MYSTERIES.joyful;
  const currentDecade = currentMystery.decades[currentDecadeIndex];

  const handleNextBead = () => {
    soundEngine.init();
    soundEngine.playBell(587.33);
    if (beadProgress < 10) {
      setBeadProgress(prev => prev + 1);
    } else {
      // Completed decade, advance to next if available
      if (currentDecadeIndex < 4) {
        setCurrentDecadeIndex(prev => prev + 1);
        setBeadProgress(0);
      } else {
        // Completed all 5 decades
        setBeadProgress(11);
      }
    }
  };

  const handleReset = () => {
    soundEngine.init();
    soundEngine.playBell(440);
    setCurrentDecadeIndex(0);
    setBeadProgress(0);
  };

  const isLatin = language === 'latin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-obsidian-900 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-obsidian-800 flex items-center justify-between bg-obsidian-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Disc className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-gold-200">
                  Daily Holy Rosary
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-300 font-semibold">
                  Today: {currentMystery.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentMystery.traditionalDays} • Bead-by-Bead Meditation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Latin / English Switcher */}
            <button
              onClick={() => {
                soundEngine.init();
                soundEngine.playBell(523.25);
                setLanguage(l => l === 'latin' ? 'english' : 'latin');
              }}
              className="px-3 py-1.5 rounded-xl border border-gold-500/40 bg-obsidian-900 text-xs font-mono font-bold text-gold-300 hover:bg-gold-500/15 transition flex items-center gap-1.5"
              title="Toggle between Traditional Latin and English prayer texts"
            >
              <Languages className="w-3.5 h-3.5 text-gold-400" />
              <span>{isLatin ? "LATIN (Vulgate)" : "ENGLISH"}</span>
            </button>

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-obsidian-800 text-slate-400 hover:text-slate-100 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mysteries Selector */}
        <div className="flex border-b border-obsidian-800 bg-obsidian-950/40 px-6 py-2.5 gap-2 overflow-x-auto">
          {Object.values(ROSARY_MYSTERIES).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                soundEngine.playBell(440);
                setSelectedMysteryKey(m.id);
                setCurrentDecadeIndex(0);
                setBeadProgress(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedMysteryKey === m.id
                  ? 'bg-gold-500 text-obsidian-950 font-bold shadow-md'
                  : 'bg-obsidian-900 border border-obsidian-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Active Decade Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 border border-gold-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-400 font-bold tracking-wider">
                DECADE {currentDecadeIndex + 1} OF 5
              </span>
              <span className="text-xs text-gold-300 font-medium font-sans">
                Spiritual Fruit: <strong>{currentDecade.fruit}</strong>
              </span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">
              {currentDecade.title}
            </h4>
            <p className="font-reading italic text-xs text-slate-400 border-l-2 border-gold-500/40 pl-3">
              {currentDecade.scripture}
            </p>
            <p className="text-xs text-slate-300 pt-1 leading-relaxed">
              {currentDecade.meditation}
            </p>
          </div>

          {/* Interactive Bead Counter */}
          <div className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Bead Progress (Decade {currentDecadeIndex + 1})
              </span>
              <span className="text-xs font-mono text-gold-400 font-bold">
                {beadProgress === 0 ? "Pater Noster (Our Father)" : beadProgress <= 10 ? `Ave Maria (Hail Mary) ${beadProgress} of 10` : "Decade Complete! Pray Glory Be & Fatima"}
              </span>
            </div>

            {/* Bead Dots */}
            <div className="flex items-center justify-between gap-1 sm:gap-2">
              {/* Our Father Bead */}
              <div 
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-bold cursor-pointer transition ${
                  beadProgress >= 0
                    ? 'border-gold-500 bg-gold-500 text-obsidian-950 shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                    : 'border-obsidian-800 bg-obsidian-900 text-slate-500'
                }`}
                title="Pater Noster (Our Father)"
              >
                P
              </div>

              <div className="h-0.5 flex-1 bg-obsidian-800" />

              {/* 10 Hail Mary Beads */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((b) => (
                <div
                  key={b}
                  onClick={() => {
                    soundEngine.playBell(587.33);
                    setBeadProgress(b);
                  }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold cursor-pointer transition ${
                    beadProgress >= b
                      ? 'border-gold-400 bg-gold-500/25 text-gold-300 shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                      : 'border-obsidian-800 bg-obsidian-900 text-slate-500'
                  }`}
                >
                  {b}
                </div>
              ))}
            </div>

            {/* Advance Bead Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg border border-obsidian-800 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleNextBead}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-950 font-bold text-xs hover:brightness-110 active:scale-95 transition shadow-lg flex items-center gap-2"
              >
                <span>{beadProgress < 10 ? "Pray Next Bead" : currentDecadeIndex < 4 ? "Complete & Advance Decade" : "Complete 5 Decades"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Active Prayer Text (Latin / English) */}
          <div className="p-5 rounded-2xl bg-obsidian-950 border border-gold-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-obsidian-800 pb-2">
              <span className="font-serif font-bold text-sm text-gold-200">
                {beadProgress === 0 
                  ? (isLatin ? "Pater Noster" : "The Lord's Prayer (Our Father)")
                  : (isLatin ? "Ave María" : "Hail Mary")}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {isLatin ? "Traditional Latin Rite" : "English Liturgical Form"}
              </span>
            </div>

            <p className="font-reading text-sm sm:text-base text-slate-200 leading-relaxed">
              {beadProgress === 0 
                ? (isLatin ? LATIN_ROSARY_PRAYERS.pater.latin : LATIN_ROSARY_PRAYERS.pater.english)
                : (isLatin ? LATIN_ROSARY_PRAYERS.ave.latin : LATIN_ROSARY_PRAYERS.ave.english)}
            </p>

            {/* After 10th bead: Show Glory Be & Fatima Prayer */}
            {beadProgress >= 10 && (
              <div className="pt-3 border-t border-obsidian-800 space-y-3 text-xs text-gold-300/90 font-reading leading-relaxed">
                <div>
                  <strong className="text-gold-200 font-sans block mb-1">
                    {isLatin ? "Glória Patri (Glory Be):" : "Glory Be to the Father:"}
                  </strong>
                  <p>{isLatin ? LATIN_ROSARY_PRAYERS.gloria.latin : LATIN_ROSARY_PRAYERS.gloria.english}</p>
                </div>
                <div>
                  <strong className="text-gold-200 font-sans block mb-1">
                    {isLatin ? "Orátio Fátimæ (The Fatima Prayer):" : "The Fatima Prayer:"}
                  </strong>
                  <p>{isLatin ? LATIN_ROSARY_PRAYERS.fatima.latin : LATIN_ROSARY_PRAYERS.fatima.english}</p>
                </div>
              </div>
            )}
          </div>

          {/* Listen to Full Rosary Audio Narration */}
          <div className="p-4 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Want full continuous vocal audio narration?</span>
            <button
              onClick={() => {
                onClose();
                onPlayAudio({
                  id: `holy-rosary-${selectedMysteryKey}`,
                  title: `The Holy Rosary: ${currentMystery.name}`,
                  category: "Marian Devotions",
                  duration: "18:45",
                  narratorTrack: selectedMysteryKey === 'sorrowful' ? '/audio/holy_rosary_sorrowful_sarah.mp3' : '/audio/holy_rosary_joyful_sarah.mp3',
                  narratorName: "Sarah",
                  audioTrack: "/audio/salve_regina_choral.ogg",
                  chantName: "Marian Schola",
                  verses: currentMystery.decades.map(d => ({
                    id: d.decade,
                    text: `${d.title}. ${d.meditation}`
                  }))
                });
              }}
              className="px-4 py-2 rounded-xl bg-gold-500 text-obsidian-950 font-bold text-xs hover:bg-gold-400 transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Stream Complete Rosary Audio</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
