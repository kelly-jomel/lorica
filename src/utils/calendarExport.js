/**
 * Calendar Export Utilities for Lorica 9-Day Catholic Novenas
 * Supports:
 * 1. Apple Calendar / Outlook / iCal standard RFC 5545 (.ics) file generation (9 individual days)
 * 2. Google Calendar with 9-day daily recurrence
 * 3. Lorica In-App Liturgical Calendar progress tracker (localStorage sync)
 */

export function downloadNovenaICS(novena, startDate = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  
  const formatDateTime = (date) => {
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T190000`;
  };

  const formatEndDate = (date) => {
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T193000`;
  };

  const nowStamp = `${dateToUTC(new Date())}Z`;

  function dateToUTC(d) {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
  }

  const events = novena.days.map((day, idx) => {
    const curDate = new Date(startDate);
    curDate.setDate(curDate.getDate() + idx);

    const startStr = formatDateTime(curDate);
    const endStr = formatEndDate(curDate);

    const cleanPrayer = (day.prayer || "").replace(/\r?\n/g, ' ');
    const desc = `Day ${day.day} of 9: ${day.theme}\\n\\nPrayer:\\n"${cleanPrayer}"\\n\\nFeast: ${novena.feastDate || ''}\\nPurpose: ${novena.purpose || ''}\\nPray with sacred audio on Lorica: https://loricaprayers.com/#novenas`;

    return [
      'BEGIN:VEVENT',
      `UID:lorica-novena-${novena.id}-day-${day.day}-${curDate.getTime()}@loricaprayers.org`,
      `DTSTAMP:${nowStamp}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:Lorica Novena: ${novena.title} (Day ${day.day} of 9)`,
      `DESCRIPTION:${desc}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: Day ${day.day} of ${novena.title}`,
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  });

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lorica Catholic Prayers//9-Day Novena Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Lorica: ${novena.title} (9-Day Devotion)`,
    events.join('\r\n'),
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${novena.id}_9_day_novena.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function openGoogleCalendarNovena(novena, startDate = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const y = startDate.getUTCFullYear();
  const m = pad(startDate.getUTCMonth() + 1);
  const d = pad(startDate.getUTCDate());

  const startStr = `${y}${m}${d}T190000Z`;
  const endStr = `${y}${m}${d}T193000Z`;

  const title = encodeURIComponent(`Lorica Novena: ${novena.title} (Day 1 of 9)`);
  const details = encodeURIComponent(
    `9-Day Catholic Novena: ${novena.title}\n\nFeast Date: ${novena.feastDate}\nPurpose: ${novena.purpose}\n\nStart praying Day 1 with sacred choral & contemplative audio at:\nhttps://loricaprayers.com/#novenas`
  );
  const rrule = encodeURIComponent('RRULE:FREQ=DAILY;COUNT=9');

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&recur=${rrule}`;
  window.open(gcalUrl, '_blank', 'noopener,noreferrer');
}

export function syncLoricaInAppNovena(novena, currentDay = 1) {
  const activeNovena = {
    id: novena.id,
    title: novena.title,
    group: novena.group,
    feastDate: novena.feastDate,
    startDate: new Date().toISOString(),
    currentDay: currentDay,
    lastUpdated: new Date().toISOString(),
    completedDays: [currentDay]
  };
  localStorage.setItem('lorica_active_novena', JSON.stringify(activeNovena));
  return activeNovena;
}

export function getActiveNovena() {
  try {
    const raw = localStorage.getItem('lorica_active_novena');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
