export const LITURGICAL_COLORS = {
  green: { name: "Green", hex: "#10B981", desc: "Ordinary Time — Spiritual growth & hope" },
  purple: { name: "Violet / Purple", hex: "#8B5CF6", desc: "Advent & Lent — Penance & preparation" },
  white: { name: "White / Gold", hex: "#F59E0B", desc: "Solemnities, Christmas, Easter & Our Lady — Purity & joy" },
  red: { name: "Red", hex: "#EF4444", desc: "Martyrs, Apostles, Pentecost & Passion — Holy Spirit & sacrifice" },
  rose: { name: "Rose", hex: "#F472B6", desc: "Gaudete & Laetare Sundays — Rejoicing mid-penance" }
};

export const CALENDAR_MONTHS = [
  {
    monthIndex: 10, // 0-indexed: November
    year: 2026,
    name: "November",
    liturgicalSeason: "Ordinary Time • Month of the Holy Souls",
    seasonColor: "green",
    daysInMonth: 30,
    startDayOfWeek: 0, // 0 = Sunday (Nov 1, 2026 is Sunday)
    feasts: {
      1: { name: "All Saints' Day", rank: "Solemnity", color: "white", holyDay: true, desc: "Honoring all canonized and hidden saints reigning with Christ." },
      2: { name: "All Souls' Day", rank: "Commemoration", color: "purple", desc: "Universal suffrage and Masses for all the faithful departed in purgatory." },
      3: { name: "St. Martin de Porres", rank: "Optional Memorial", color: "white", desc: "Dominican lay brother renowned for charity, humility, and healing." },
      4: { name: "St. Charles Borromeo", rank: "Memorial", color: "white", desc: "Bishop of Milan and great reformer of the Council of Trent." },
      9: { name: "Dedication of the Lateran Basilica", rank: "Feast", color: "white", desc: "The Pope's cathedral as Bishop of Rome, Mother and Head of all churches." },
      10: { name: "St. Leo the Great", rank: "Memorial", color: "white", desc: "Pope and Doctor who turned back Attila the Hun and defended Christ's two natures." },
      11: { name: "St. Martin of Tours", rank: "Memorial", color: "white", desc: "Bishop and soldier who cut his cloak in half to clothe a freezing beggar." },
      12: { name: "St. Josaphat", rank: "Memorial", color: "red", desc: "Bishop and martyr for the unity of the Eastern and Western Churches." },
      15: { name: "St. Albert the Great", rank: "Optional Memorial", color: "white", desc: "Dominican Doctor of the Church and teacher of St. Thomas Aquinas." },
      16: { name: "St. Gertrude the Great & St. Margaret of Scotland", rank: "Memorial", color: "white", desc: "Benedictine mystic of the Sacred Heart and holy queen of charity." },
      17: { name: "St. Elizabeth of Hungary", rank: "Memorial", color: "white", desc: "Duchess of Thuringia who devoted her crown to feeding the destitute." },
      21: { name: "The Presentation of the Blessed Virgin Mary", rank: "Memorial", color: "white", desc: "Mary dedicated by Joachim and Anne in the Temple as the living Ark." },
      22: { name: "Our Lord Jesus Christ, King of the Universe", rank: "Solemnity", color: "white", holyDay: false, desc: "The cosmic crown of the liturgical year proclaiming Christ Sovereign King." },
      24: { name: "St. Andrew Dũng-Lạc & Companions", rank: "Memorial", color: "red", desc: "117 martyrs of Vietnam who shed their blood for the Catholic faith." },
      27: { name: "Our Lady of the Miraculous Medal", rank: "Feast", color: "white", desc: "Apparition to St. Catherine Labouré in Paris in 1830." },
      29: { name: "First Sunday of Advent", rank: "Sunday of Advent", color: "purple", seasonChange: "Advent", desc: "The beginning of the new Liturgical Year. Prepare the way of the Lord." },
      30: { name: "St. Andrew the Apostle", rank: "Feast", color: "red", novenaStart: "St. Andrew Christmas Novena", desc: "First-called apostle. Begin the 15-times-daily Christmas anticipation novena today." }
    }
  },
  {
    monthIndex: 11, // December
    year: 2026,
    name: "December",
    liturgicalSeason: "Advent & Christmastide",
    seasonColor: "purple",
    daysInMonth: 31,
    startDayOfWeek: 2, // Tuesday
    feasts: {
      3: { name: "St. Francis Xavier", rank: "Memorial", color: "white", desc: "Patron of foreign missions who baptized tens of thousands across Asia." },
      6: { name: "Second Sunday of Advent & St. Nicholas", rank: "Sunday of Advent", color: "purple", desc: "A voice crying in the wilderness: Make straight the paths of our God." },
      7: { name: "St. Ambrose", rank: "Memorial", color: "white", desc: "Bishop of Milan who baptized St. Augustine and composed great hymns." },
      8: { name: "The Immaculate Conception of the Blessed Virgin Mary", rank: "Solemnity", color: "white", holyDay: true, desc: "Mary preserved free from all stain of original sin from her first instant of life." },
      12: { name: "Our Lady of Guadalupe", rank: "Feast", color: "white", desc: "Patroness of the Americas who appeared to St. Juan Diego on Tepeyac Hill." },
      13: { name: "Third Sunday of Advent (Gaudete Sunday)", rank: "Sunday of Advent", color: "rose", desc: "Gaudete in Domino semper! Rejoice in the Lord always, for the Lord is near." },
      14: { name: "St. John of the Cross", rank: "Memorial", color: "white", desc: "Carmelite mystic, reformer, and Doctor of the Mystical Life." },
      20: { name: "Fourth Sunday of Advent", rank: "Sunday of Advent", color: "purple", desc: "Behold, a virgin shall conceive and bear a son, and His name shall be Emmanuel." },
      25: { name: "The Nativity of the Lord (Christmas)", rank: "Solemnity", color: "white", holyDay: true, desc: "The Word was made flesh and dwelt among us. Venite Adoremus Dominum!" },
      26: { name: "St. Stephen, The First Martyr", rank: "Feast", color: "red", desc: "Protomartyr stoned while gazing upon Jesus standing at the right hand of God." },
      27: { name: "The Holy Family of Jesus, Mary, and Joseph", rank: "Feast", color: "white", desc: "The model and sanctuary for all Christian households." },
      28: { name: "The Holy Innocents", rank: "Feast", color: "red", desc: "Infant martyrs slain by Herod in Bethlehem in hatred of the Christ Child." },
      31: { name: "St. Sylvester I & New Year's Eve Te Deum", rank: "Optional Memorial", color: "white", desc: "Chanting the Te Deum of thanksgiving for the graces of the closing year." }
    }
  }
];

export const getFeastForDate = (monthIdx, day) => {
  const monthData = CALENDAR_MONTHS.find(m => m.monthIndex === monthIdx);
  if (!monthData) return null;
  return monthData.feasts[day] || null;
};
