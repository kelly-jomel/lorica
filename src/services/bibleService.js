// Roman Catholic Bible Service for Lorica
// Uses the Roman Catholic Canon (73 Books, including the 7 Deuterocanonical books)
// Translations available: NABRE (New American Bible Revised Edition) and NRSVCE (New Revised Standard Version Catholic Edition)

const API_BASE = 'https://bolls.life';

// Full 73 Books of the Roman Catholic Canon with Catholic grouping
export const CATHOLIC_BIBLE_BOOKS = [
  // 1. PENTATEUCH / TORAH (5)
  { bookid: 1, name: 'Genesis', abbreviation: 'Gen', testament: 'OT', category: 'Pentateuch', chapters: 50 },
  { bookid: 2, name: 'Exodus', abbreviation: 'Exod', testament: 'OT', category: 'Pentateuch', chapters: 40 },
  { bookid: 3, name: 'Leviticus', abbreviation: 'Lev', testament: 'OT', category: 'Pentateuch', chapters: 27 },
  { bookid: 4, name: 'Numbers', abbreviation: 'Num', testament: 'OT', category: 'Pentateuch', chapters: 36 },
  { bookid: 5, name: 'Deuteronomy', abbreviation: 'Deut', testament: 'OT', category: 'Pentateuch', chapters: 34 },

  // 2. HISTORICAL BOOKS (16 - includes Tobit, Judith, 1 & 2 Maccabees)
  { bookid: 6, name: 'Joshua', abbreviation: 'Josh', testament: 'OT', category: 'Historical', chapters: 24 },
  { bookid: 7, name: 'Judges', abbreviation: 'Judg', testament: 'OT', category: 'Historical', chapters: 21 },
  { bookid: 8, name: 'Ruth', abbreviation: 'Ruth', testament: 'OT', category: 'Historical', chapters: 4 },
  { bookid: 9, name: '1 Samuel', abbreviation: '1 Sam', testament: 'OT', category: 'Historical', chapters: 31 },
  { bookid: 10, name: '2 Samuel', abbreviation: '2 Sam', testament: 'OT', category: 'Historical', chapters: 24 },
  { bookid: 11, name: '1 Kings', abbreviation: '1 Kgs', testament: 'OT', category: 'Historical', chapters: 22 },
  { bookid: 12, name: '2 Kings', abbreviation: '2 Kgs', testament: 'OT', category: 'Historical', chapters: 25 },
  { bookid: 13, name: '1 Chronicles', abbreviation: '1 Chr', testament: 'OT', category: 'Historical', chapters: 29 },
  { bookid: 14, name: '2 Chronicles', abbreviation: '2 Chr', testament: 'OT', category: 'Historical', chapters: 36 },
  { bookid: 15, name: 'Ezra', abbreviation: 'Ezra', testament: 'OT', category: 'Historical', chapters: 10 },
  { bookid: 16, name: 'Nehemiah', abbreviation: 'Neh', testament: 'OT', category: 'Historical', chapters: 13 },
  { bookid: 68, name: 'Tobit', abbreviation: 'Tob', testament: 'OT', category: 'Historical', chapters: 14, isDeuterocanonical: true },
  { bookid: 69, name: 'Judith', abbreviation: 'Jdt', testament: 'OT', category: 'Historical', chapters: 16, isDeuterocanonical: true },
  { bookid: 17, name: 'Esther', abbreviation: 'Esth', testament: 'OT', category: 'Historical', chapters: 10 },
  { bookid: 74, name: '1 Maccabees', abbreviation: '1 Macc', testament: 'OT', category: 'Historical', chapters: 16, isDeuterocanonical: true },
  { bookid: 75, name: '2 Maccabees', abbreviation: '2 Macc', testament: 'OT', category: 'Historical', chapters: 15, isDeuterocanonical: true },

  // 3. WISDOM & POETRY (7 - includes Wisdom and Sirach)
  { bookid: 18, name: 'Job', abbreviation: 'Job', testament: 'OT', category: 'Wisdom', chapters: 42 },
  { bookid: 19, name: 'Psalms', abbreviation: 'Ps', testament: 'OT', category: 'Wisdom', chapters: 150 },
  { bookid: 20, name: 'Proverbs', abbreviation: 'Prov', testament: 'OT', category: 'Wisdom', chapters: 31 },
  { bookid: 21, name: 'Ecclesiastes', abbreviation: 'Eccl', testament: 'OT', category: 'Wisdom', chapters: 12 },
  { bookid: 22, name: 'Song of Songs', abbreviation: 'Song', testament: 'OT', category: 'Wisdom', chapters: 8 },
  { bookid: 70, name: 'Wisdom of Solomon', abbreviation: 'Wis', testament: 'OT', category: 'Wisdom', chapters: 19, isDeuterocanonical: true },
  { bookid: 71, name: 'Sirach (Ecclesiasticus)', abbreviation: 'Sir', testament: 'OT', category: 'Wisdom', chapters: 51, isDeuterocanonical: true },

  // 4. PROPHETS (18 - includes Baruch & Lamentations)
  { bookid: 23, name: 'Isaiah', abbreviation: 'Isa', testament: 'OT', category: 'Prophets', chapters: 66 },
  { bookid: 24, name: 'Jeremiah', abbreviation: 'Jer', testament: 'OT', category: 'Prophets', chapters: 52 },
  { bookid: 25, name: 'Lamentations', abbreviation: 'Lam', testament: 'OT', category: 'Prophets', chapters: 5 },
  { bookid: 73, name: 'Baruch', abbreviation: 'Bar', testament: 'OT', category: 'Prophets', chapters: 6, isDeuterocanonical: true },
  { bookid: 26, name: 'Ezekiel', abbreviation: 'Ezek', testament: 'OT', category: 'Prophets', chapters: 48 },
  { bookid: 27, name: 'Daniel', abbreviation: 'Dan', testament: 'OT', category: 'Prophets', chapters: 14 },
  { bookid: 28, name: 'Hosea', abbreviation: 'Hos', testament: 'OT', category: 'Prophets', chapters: 14 },
  { bookid: 29, name: 'Joel', abbreviation: 'Joel', testament: 'OT', category: 'Prophets', chapters: 3 },
  { bookid: 30, name: 'Amos', abbreviation: 'Amos', testament: 'OT', category: 'Prophets', chapters: 9 },
  { bookid: 31, name: 'Obadiah', abbreviation: 'Obad', testament: 'OT', category: 'Prophets', chapters: 1 },
  { bookid: 32, name: 'Jonah', abbreviation: 'Jonah', testament: 'OT', category: 'Prophets', chapters: 4 },
  { bookid: 33, name: 'Micah', abbreviation: 'Mic', testament: 'OT', category: 'Prophets', chapters: 7 },
  { bookid: 34, name: 'Nahum', abbreviation: 'Nah', testament: 'OT', category: 'Prophets', chapters: 3 },
  { bookid: 35, name: 'Habakkuk', abbreviation: 'Hab', testament: 'OT', category: 'Prophets', chapters: 3 },
  { bookid: 36, name: 'Zephaniah', abbreviation: 'Zeph', testament: 'OT', category: 'Prophets', chapters: 3 },
  { bookid: 37, name: 'Haggai', abbreviation: 'Hag', testament: 'OT', category: 'Prophets', chapters: 2 },
  { bookid: 38, name: 'Zechariah', abbreviation: 'Zech', testament: 'OT', category: 'Prophets', chapters: 14 },
  { bookid: 39, name: 'Malachi', abbreviation: 'Mal', testament: 'OT', category: 'Prophets', chapters: 4 },

  // 5. GOSPELS & ACTS (5)
  { bookid: 40, name: 'Matthew', abbreviation: 'Matt', testament: 'NT', category: 'Gospels', chapters: 28 },
  { bookid: 41, name: 'Mark', abbreviation: 'Mark', testament: 'NT', category: 'Gospels', chapters: 16 },
  { bookid: 42, name: 'Luke', abbreviation: 'Luke', testament: 'NT', category: 'Gospels', chapters: 24 },
  { bookid: 43, name: 'John', abbreviation: 'John', testament: 'NT', category: 'Gospels', chapters: 21 },
  { bookid: 44, name: 'Acts of the Apostles', abbreviation: 'Acts', testament: 'NT', category: 'Gospels', chapters: 28 },

  // 6. PAULINE & GENERAL EPISTLES (21)
  { bookid: 45, name: 'Romans', abbreviation: 'Rom', testament: 'NT', category: 'Epistles', chapters: 16 },
  { bookid: 46, name: '1 Corinthians', abbreviation: '1 Cor', testament: 'NT', category: 'Epistles', chapters: 16 },
  { bookid: 47, name: '2 Corinthians', abbreviation: '2 Cor', testament: 'NT', category: 'Epistles', chapters: 13 },
  { bookid: 48, name: 'Galatians', abbreviation: 'Gal', testament: 'NT', category: 'Epistles', chapters: 6 },
  { bookid: 49, name: 'Ephesians', abbreviation: 'Eph', testament: 'NT', category: 'Epistles', chapters: 6 },
  { bookid: 50, name: 'Philippians', abbreviation: 'Phil', testament: 'NT', category: 'Epistles', chapters: 4 },
  { bookid: 51, name: 'Colossians', abbreviation: 'Col', testament: 'NT', category: 'Epistles', chapters: 4 },
  { bookid: 52, name: '1 Thessalonians', abbreviation: '1 Thess', testament: 'NT', category: 'Epistles', chapters: 5 },
  { bookid: 53, name: '2 Thessalonians', abbreviation: '2 Thess', testament: 'NT', category: 'Epistles', chapters: 3 },
  { bookid: 54, name: '1 Timothy', abbreviation: '1 Tim', testament: 'NT', category: 'Epistles', chapters: 6 },
  { bookid: 55, name: '2 Timothy', abbreviation: '2 Tim', testament: 'NT', category: 'Epistles', chapters: 4 },
  { bookid: 56, name: 'Titus', abbreviation: 'Titus', testament: 'NT', category: 'Epistles', chapters: 3 },
  { bookid: 57, name: 'Philemon', abbreviation: 'Phlm', testament: 'NT', category: 'Epistles', chapters: 1 },
  { bookid: 58, name: 'Hebrews', abbreviation: 'Heb', testament: 'NT', category: 'Epistles', chapters: 13 },
  { bookid: 59, name: 'James', abbreviation: 'Jas', testament: 'NT', category: 'Epistles', chapters: 5 },
  { bookid: 60, name: '1 Peter', abbreviation: '1 Pet', testament: 'NT', category: 'Epistles', chapters: 5 },
  { bookid: 61, name: '2 Peter', abbreviation: '2 Pet', testament: 'NT', category: 'Epistles', chapters: 3 },
  { bookid: 62, name: '1 John', abbreviation: '1 John', testament: 'NT', category: 'Epistles', chapters: 5 },
  { bookid: 63, name: '2 John', abbreviation: '2 John', testament: 'NT', category: 'Epistles', chapters: 1 },
  { bookid: 64, name: '3 John', abbreviation: '3 John', testament: 'NT', category: 'Epistles', chapters: 1 },
  { bookid: 65, name: 'Jude', abbreviation: 'Jude', testament: 'NT', category: 'Epistles', chapters: 1 },

  // 7. APOCALYPSE / REVELATION (1)
  { bookid: 66, name: 'Revelation', abbreviation: 'Rev', testament: 'NT', category: 'Revelation', chapters: 22 }
];

export const CATHOLIC_TRANSLATIONS = [
  { id: 'NABRE', name: 'NABRE', title: 'New American Bible (Revised Edition)', badge: 'Catholic Liturgical' },
  { id: 'NRSVCE', name: 'NRSVCE', title: 'New Revised Standard Version (Catholic Edition)', badge: 'Scholarly Catholic' }
];

// Helper to strip HTML / footnote sup markers like <sup>[AA]</sup> from raw API text
export function cleanVerseText(rawHtml) {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<sup\b[^>]*>.*?<\/sup>/gi, '') // remove footnotes
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/?[^>]+(>|$)/g, '') // remove remaining HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch a chapter from the API with local caching
 */
export async function fetchChapter(translation = 'NABRE', bookId = 1, chapter = 1) {
  const cacheKey = `lorica_bible_${translation}_${bookId}_${chapter}`;
  
  // 1. Try local cache first for instant speed
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('LocalStorage access warning:', e);
  }

  // 2. Fetch from API
  const url = `${API_BASE}/get-text/${translation}/${bookId}/${chapter}/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load Scripture (HTTP ${response.status})`);
  }

  const rawData = await response.json();
  
  // Clean text and standardize format
  const cleanedVerses = rawData.map(v => ({
    pk: v.pk,
    verse: v.verse,
    text: cleanVerseText(v.text)
  }));

  // 3. Save to local cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify(cleanedVerses));
  } catch (e) {
    // quota exceeded, safely ignore
  }

  return cleanedVerses;
}

// Quick Catholic Reading Suggestions
export const CATHOLIC_FEATURED_READINGS = [
  { title: 'The Annunciation', bookId: 42, chapter: 1, verseRange: '26-38', bookName: 'Luke', desc: 'The Angel Gabriel visits the Virgin Mary.' },
  { title: 'The Sermon on the Mount', bookId: 40, chapter: 5, verseRange: '1-12', bookName: 'Matthew', desc: 'The Eight Beatitudes given by Our Lord.' },
  { title: 'The Prologue of John', bookId: 43, chapter: 1, verseRange: '1-14', bookName: 'John', desc: 'The Word was made flesh and dwelt among us.' },
  { title: 'Psalm 23 (The Good Shepherd)', bookId: 19, chapter: 23, verseRange: '1-6', bookName: 'Psalms', desc: 'The Lord is my shepherd, I shall not want.' },
  { title: 'Wisdom of Solomon (Immortality)', bookId: 70, chapter: 3, verseRange: '1-9', bookName: 'Wisdom', desc: 'The souls of the just are in the hand of God.' },
  { title: '1 Corinthians 13 (Hymn of Love)', bookId: 46, chapter: 13, verseRange: '1-13', bookName: '1 Corinthians', desc: 'Faith, hope, and love remain, these three.' },
  { title: 'Magnificat of Mary', bookId: 42, chapter: 1, verseRange: '46-55', bookName: 'Luke', desc: 'My soul proclaims the greatness of the Lord.' }
];
