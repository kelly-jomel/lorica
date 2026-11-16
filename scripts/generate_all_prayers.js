import { PRAYERS_DATA } from "../src/data/prayersData.js";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// 4 Recommended Voices
const VOICES = {
  GEORGE: { id: "JBFqnCBsd6RMkjVDRZzb", name: "George (British Contemplative)" },
  ROGER:  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger (Deep Resonant Deliverance)" },
  SARAH:  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Reverent Marian & Chaplets)" },
  RIVER:  { id: "SAz9YHcvj6GT2YYXdXww", name: "River (Tranquil Night & Mercy)" }
};

// Category / Prayer mapping
const PRAYER_VOICE_MAP = {
  // Scripture & Psalms (George)
  "psalm-91": VOICES.GEORGE,
  "psalm-23": VOICES.GEORGE,
  "psalm-27": VOICES.GEORGE,
  "psalm-121": VOICES.GEORGE,
  "holy-souls-purgatory": VOICES.GEORGE, // De Profundis
  "lorica-patrick": VOICES.GEORGE,
  "padre-pio-stay-with-me": VOICES.GEORGE,
  "anima-christi": VOICES.GEORGE,

  // Spiritual Warfare & Deliverance (Roger)
  "st-michael": VOICES.ROGER,
  "st-benedict-exorcism": VOICES.ROGER,
  "binding-prayer": VOICES.ROGER,
  "precious-blood-litany": VOICES.ROGER,
  "st-joseph-terror-demons": VOICES.ROGER,

  // Marian & Intercession (Sarah)
  "holy-rosary-sorrowful": VOICES.SARAH,
  "holy-rosary-joyful": VOICES.SARAH,
  "memorare": VOICES.SARAH,
  "salve-regina": VOICES.SARAH,
  "sub-tuum": VOICES.SARAH,
  "st-teresa-bookmark": VOICES.SARAH,
  "st-gertrude-souls": VOICES.SARAH,
  "st-dymphna-mental-health": VOICES.SARAH,
  "litany-of-trust": VOICES.SARAH,

  // Night, Rest & Contemplation (River)
  "night-compline": VOICES.RIVER,
  "guardian-angel-sleep": VOICES.RIVER,
  "psalm-4-sleep": VOICES.RIVER,
  "anxiety-calm": VOICES.RIVER,
  "litany-of-humility": VOICES.RIVER,
  "divine-mercy": VOICES.RIVER,
  "jesus-prayer": VOICES.RIVER
};

const audioDir = path.resolve("public/audio");
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

console.log(`Starting audio generation for ${PRAYERS_DATA.length} core prayers...`);

let generated = 0;
let skipped = 0;

for (const prayer of PRAYERS_DATA) {
  const voice = PRAYER_VOICE_MAP[prayer.id] || VOICES.GEORGE;
  const fileName = `${prayer.id.replace(/-/g, "_")}_${voice === VOICES.GEORGE ? "george" : voice === VOICES.ROGER ? "roger" : voice === VOICES.SARAH ? "sarah" : "river"}.mp3`;
  const filePath = path.join(audioDir, fileName);

  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 10000) {
    console.log(`[SKIP] Already exists: ${fileName}`);
    skipped++;
    continue;
  }

  const text = prayer.verses ? prayer.verses.map(v => v.text).join(" ") : prayer.content || "";
  console.log(`[GEN] ${prayer.title} (${text.length} chars) using ${voice.name} -> ${fileName}...`);

  const escapedText = text.replace(/"/g, '\\"');
  const cmd = `elevenlabs text-to-speech convert \
    --voice-id "${voice.id}" \
    --model-id "eleven_multilingual_v2" \
    --text "${escapedText}" \
    --voice-settings.speed 0.88 \
    --voice-settings.stability 0.78 \
    --voice-settings.similarity-boost 0.80 \
    -o "${filePath}"`;

  try {
    execSync(cmd, { stdio: "pipe" });
    const stats = fs.statSync(filePath);
    console.log(`   ✓ Saved: ${fileName} (${(stats.size / 1024).toFixed(1)} KB)`);
    generated++;
  } catch (err) {
    console.error(`   ✗ Error generating ${prayer.id}:`, err.message);
  }
}

console.log(`\nCompleted! Generated: ${generated}, Skipped (already generated): ${skipped}`);
