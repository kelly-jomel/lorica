import { NOVENAS_DATA } from "../src/data/novenasData.js";
import { PRAY_SECTIONS } from "../src/data/categoriesData.js";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const VOICES = {
  GEORGE: { id: "JBFqnCBsd6RMkjVDRZzb", name: "George (British Contemplative)", tag: "george" },
  ROGER:  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger (Deep Resonant Deliverance)", tag: "roger" },
  SARAH:  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Reverent Marian & Chaplets)", tag: "sarah" },
  RIVER:  { id: "SAz9YHcvj6GT2YYXdXww", name: "River (Tranquil Night & Mercy)", tag: "river" }
};

const NOVENA_VOICE_MAP = {
  "holy-spirit-novena": VOICES.GEORGE,
  "surrender-novena": VOICES.RIVER,
  "divine-mercy-novena": VOICES.RIVER,
  "sacred-heart-novena": VOICES.GEORGE,
  "undoer-of-knots": VOICES.SARAH,
  "miraculous-medal-novena": VOICES.SARAH,
  "st-michael-novena": VOICES.ROGER,
  "st-jude-novena": VOICES.ROGER,
  "st-therese-rose-novena": VOICES.SARAH,
  "st-joseph-novena": VOICES.ROGER,
  "st-andrew-christmas-novena": VOICES.GEORGE,
  "holy-souls-purgatory": VOICES.GEORGE
};

const PATRON_VOICE_MAP = {
  "patron-jude": VOICES.ROGER,
  "patron-anthony": VOICES.GEORGE,
  "patron-joseph": VOICES.ROGER,
  "patron-peregrine": VOICES.GEORGE,
  "patron-dymphna": VOICES.SARAH,
  "patron-rita": VOICES.SARAH,
  "patron-monica": VOICES.SARAH,
  "patron-kolbe": VOICES.GEORGE,
  "patron-michael": VOICES.ROGER
};

const audioDir = path.resolve("public/audio");
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

function formatDuration(filePath) {
  try {
    const out = execSync(`afinfo "${filePath}"`, { encoding: "utf8" });
    const match = out.match(/estimated duration: ([0-9.]+) sec/);
    if (match) {
      const secs = Math.round(parseFloat(match[1]));
      const mins = Math.floor(secs / 60);
      const rem = secs % 60;
      return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
    }
  } catch (e) {}
  return "2:30";
}

// -----------------------------------------------------------------------------
// 1. GENERATE PATRON SAINTS AUDIO
// -----------------------------------------------------------------------------
console.log("=== 1. GENERATING PATRON SAINT AUDIO (9 PATRONS) ===");
const patronSection = PRAY_SECTIONS.find(s => s.id === "patron-saints");
const updatedPatrons = [];

if (patronSection && patronSection.patrons) {
  for (const patron of patronSection.patrons) {
    const voice = PATRON_VOICE_MAP[patron.id] || VOICES.GEORGE;
    const fileName = `${patron.id.replace(/-/g, "_")}_${voice.tag}.mp3`;
    const filePath = path.join(audioDir, fileName);

    const prayerText = `Prayer to ${patron.name}, Patron of ${patron.patronage}. ${patron.prayer} Glory be to the Father, and to the Son, and to the Holy Spirit. Amen.`;

    if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 1000) {
      console.log(`[GEN PATRON] ${patron.name} (${prayerText.length} chars) using ${voice.name}...`);
      const escaped = prayerText.replace(/"/g, '\\"');
      const cmd = `elevenlabs text-to-speech convert \
        --voice-id "${voice.id}" \
        --model-id "eleven_multilingual_v2" \
        --text "${escaped}" \
        --voice-settings.speed 0.88 \
        --voice-settings.stability 0.78 \
        --voice-settings.similarity-boost 0.80 \
        -o "${filePath}"`;
      try {
        execSync(cmd, { stdio: "pipe" });
        console.log(`   ✓ Saved: ${fileName}`);
      } catch (err) {
        console.error(`   ✗ Error generating ${patron.id}:`, err.message);
      }
    } else {
      console.log(`[SKIP PATRON] Already exists: ${fileName}`);
    }

    updatedPatrons.push({
      ...patron,
      narratorTrack: `/audio/${fileName}`,
      narratorName: voice.name,
      duration: formatDuration(filePath)
    });
  }
}

// -----------------------------------------------------------------------------
// 2. GENERATE NOVENAS AUDIO (12 NOVENAS X 9 DAYS = 108 SESSIONS)
// -----------------------------------------------------------------------------
console.log("\n=== 2. GENERATING 12 NOVENAS AUDIO (108 DAILY SESSIONS) ===");
const updatedNovenas = [];
let totalNovenaGenerated = 0;
let totalNovenaSkipped = 0;

for (const novena of NOVENAS_DATA) {
  const voice = NOVENA_VOICE_MAP[novena.id] || VOICES.SARAH;
  const updatedDays = [];

  for (const d of novena.days) {
    const fileName = `novena_${novena.id.replace(/-/g, "_")}_day_${d.day}_${voice.tag}.mp3`;
    const filePath = path.join(audioDir, fileName);

    const dayText = `${novena.title}. Day ${d.day}: ${d.theme}. In the Name of the Father, and of the Son, and of the Holy Spirit. Amen. ${d.prayer} Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.`;

    if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 1000) {
      console.log(`[GEN NOVENA] ${novena.title} Day ${d.day} (${dayText.length} chars) using ${voice.name}...`);
      const escaped = dayText.replace(/"/g, '\\"');
      const cmd = `elevenlabs text-to-speech convert \
        --voice-id "${voice.id}" \
        --model-id "eleven_multilingual_v2" \
        --text "${escaped}" \
        --voice-settings.speed 0.88 \
        --voice-settings.stability 0.78 \
        --voice-settings.similarity-boost 0.80 \
        -o "${filePath}"`;
      try {
        execSync(cmd, { stdio: "pipe" });
        console.log(`   ✓ Saved: ${fileName}`);
        totalNovenaGenerated++;
      } catch (err) {
        console.error(`   ✗ Error generating ${novena.id} day ${d.day}:`, err.message);
      }
    } else {
      totalNovenaSkipped++;
    }

    updatedDays.push({
      ...d,
      narratorTrack: `/audio/${fileName}`,
      narratorName: voice.name,
      duration: formatDuration(filePath)
    });
  }

  updatedNovenas.push({
    ...novena,
    narratorName: voice.name,
    days: updatedDays
  });
}

// -----------------------------------------------------------------------------
// 3. WRITE UPDATED DATA TO DISK
// -----------------------------------------------------------------------------
const novenasOutput = "export const NOVENAS_DATA = " + JSON.stringify(updatedNovenas, null, 2) + ";\n";
fs.writeFileSync("src/data/novenasData.js", novenasOutput, "utf8");
console.log("\n✓ Updated src/data/novenasData.js with narrator tracks and calculated durations!");

// Update patrons in categoriesData.js
let catContent = fs.readFileSync("src/data/categoriesData.js", "utf8");
// Replace patrons array inside categoriesData.js
const patronsJson = JSON.stringify(updatedPatrons, null, 8);
catContent = catContent.replace(/patrons:\s*\[[\s\S]*?\n\s*\]\s*\n\s*\}/, `patrons: ${patronsJson}\n    }`);
fs.writeFileSync("src/data/categoriesData.js", catContent, "utf8");
console.log("✓ Updated src/data/categoriesData.js with patron saint narrator tracks!");

console.log(`\nALL DONE! Novena Days Generated: ${totalNovenaGenerated}, Skipped: ${totalNovenaSkipped}`);
