// Comprehensive Currency & Geo-Detection Service for Lorica
// Detects user country via geo-IP lookup with robust timezone fallback and manual selection override.

export const SUPPORTED_CURRENCIES = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    guardian: { monthly: 5, oneTime: 20 },
    warrior: { monthly: 15, oneTime: 50 },
    pillar: { monthly: 30, oneTime: 100 },
    defaultCustom: 25
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    guardian: { monthly: 299, oneTime: 999 },
    warrior: { monthly: 799, oneTime: 2499 },
    pillar: { monthly: 1999, oneTime: 4999 },
    defaultCustom: 500
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    guardian: { monthly: 5, oneTime: 20 },
    warrior: { monthly: 15, oneTime: 50 },
    pillar: { monthly: 30, oneTime: 100 },
    defaultCustom: 25
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    guardian: { monthly: 4, oneTime: 15 },
    warrior: { monthly: 12, oneTime: 40 },
    pillar: { monthly: 25, oneTime: 80 },
    defaultCustom: 20
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    guardian: { monthly: 7, oneTime: 25 },
    warrior: { monthly: 20, oneTime: 65 },
    pillar: { monthly: 40, oneTime: 130 },
    defaultCustom: 35
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    guardian: { monthly: 8, oneTime: 30 },
    warrior: { monthly: 22, oneTime: 75 },
    pillar: { monthly: 45, oneTime: 150 },
    defaultCustom: 35
  },
  PHP: {
    code: 'PHP',
    symbol: '₱',
    name: 'Philippine Peso',
    flag: '🇵🇭',
    guardian: { monthly: 250, oneTime: 950 },
    warrior: { monthly: 750, oneTime: 2500 },
    pillar: { monthly: 1500, oneTime: 5000 },
    defaultCustom: 500
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    flag: '🇧🇷',
    guardian: { monthly: 25, oneTime: 99 },
    warrior: { monthly: 75, oneTime: 250 },
    pillar: { monthly: 150, oneTime: 500 },
    defaultCustom: 50
  },
  MXN: {
    code: 'MXN',
    symbol: 'Mex$',
    name: 'Mexican Peso',
    flag: '🇲🇽',
    guardian: { monthly: 90, oneTime: 350 },
    warrior: { monthly: 250, oneTime: 900 },
    pillar: { monthly: 500, oneTime: 1800 },
    defaultCustom: 200
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    guardian: { monthly: 7, oneTime: 25 },
    warrior: { monthly: 20, oneTime: 65 },
    pillar: { monthly: 40, oneTime: 130 },
    defaultCustom: 30
  }
};

// Map ISO 3166-1 country codes to our supported currencies
const COUNTRY_TO_CURRENCY = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  CA: 'CAD',
  AU: 'AUD',
  NZ: 'AUD',
  PH: 'PHP',
  BR: 'BRL',
  MX: 'MXN',
  SG: 'SGD',
  // Eurozone countries
  AT: 'EUR', BE: 'EUR', CY: 'EUR', EE: 'EUR', FI: 'EUR', FR: 'EUR',
  DE: 'EUR', GR: 'EUR', IE: 'EUR', IT: 'EUR', LV: 'EUR', LT: 'EUR',
  LU: 'EUR', MT: 'EUR', NL: 'EUR', PT: 'EUR', SK: 'EUR', SI: 'EUR',
  ES: 'EUR', HR: 'EUR', VA: 'EUR' // Vatican City uses EUR
};

// Fallback timezone deduction if IP lookup is unavailable or blocked by adblockers
function getCurrencyFromTimeZone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.startsWith('Asia/Colombo')) {
      return 'INR';
    }
    if (tz.startsWith('Europe/London')) {
      return 'GBP';
    }
    if (tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver') || tz.startsWith('America/Montreal')) {
      return 'CAD';
    }
    if (tz.startsWith('Australia/') || tz.startsWith('Pacific/Auckland')) {
      return 'AUD';
    }
    if (tz.startsWith('Asia/Manila')) {
      return 'PHP';
    }
    if (tz.startsWith('America/Sao_Paulo') || tz.startsWith('America/Fortaleza')) {
      return 'BRL';
    }
    if (tz.startsWith('America/Mexico_City')) {
      return 'MXN';
    }
    if (tz.startsWith('Asia/Singapore')) {
      return 'SGD';
    }
    if (tz.startsWith('Europe/')) {
      return 'EUR';
    }
    if (tz.startsWith('America/')) {
      return 'USD';
    }
  } catch (e) {
    // ignore
  }
  return 'USD';
}

let cachedCurrency = null;
const listeners = new Set();

export const currencyService = {
  // Returns currently resolved currency synchronously (cached or fallback)
  getCurrency() {
    if (cachedCurrency) return cachedCurrency;
    
    // Check localStorage for saved user choice
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lorica_preferred_currency');
        if (saved && SUPPORTED_CURRENCIES[saved]) {
          cachedCurrency = SUPPORTED_CURRENCIES[saved];
          return cachedCurrency;
        }
      } catch (e) {}
    }

    const fallbackCode = getCurrencyFromTimeZone();
    cachedCurrency = SUPPORTED_CURRENCIES[fallbackCode] || SUPPORTED_CURRENCIES.USD;
    return cachedCurrency;
  },

  // Asynchronously detect country from IP and update
  async autoDetect() {
    if (typeof window === 'undefined') return this.getCurrency();

    // Check if user already manually selected a currency
    try {
      const saved = localStorage.getItem('lorica_preferred_currency');
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        cachedCurrency = SUPPORTED_CURRENCIES[saved];
        this.notify();
        return cachedCurrency;
      }
    } catch (e) {}

    try {
      // Fast, privacy-friendly geo-lookup with zero API key requirement
      const res = await fetch('https://get.geojs.io/v1/ip/country.json', { cache: 'force-cache' });
      if (res.ok) {
        const data = await res.json();
        const country = (data.country || '').toUpperCase();
        const detectedCode = COUNTRY_TO_CURRENCY[country] || 'USD';
        if (SUPPORTED_CURRENCIES[detectedCode]) {
          cachedCurrency = SUPPORTED_CURRENCIES[detectedCode];
          this.notify();
          return cachedCurrency;
        }
      }
    } catch (err) {
      // Fallback already assigned via timezone
    }

    return this.getCurrency();
  },

  // Allow user to manually switch currency
  setCurrency(code) {
    if (SUPPORTED_CURRENCIES[code]) {
      cachedCurrency = SUPPORTED_CURRENCIES[code];
      try {
        localStorage.setItem('lorica_preferred_currency', code);
      } catch (e) {}
      this.notify();
    }
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify() {
    listeners.forEach((fn) => fn(cachedCurrency));
  }
};
