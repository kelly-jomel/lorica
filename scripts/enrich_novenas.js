import { NOVENAS_DATA } from "../src/data/novenasData.js";
import fs from "fs";

const CLOSING_PRAYERS = {
  "undoer-of-knots": {
    closingPrayer: "O Virgin Mary, Mother of fair love, Mother who never abandoned a child who cries for help, Mother whose hands never cease to serve your beloved children, because they are moved by the divine love and immense mercy that exist in your heart! Turn your eyes of compassion toward me and see the snarl of knots in my life. You know how desperate I am, and how bound I am by these knots. Mary, Mother to whom God entrusted the undoing of the knots in the lives of His children, into your hands I abandon the ribbon of my life. Untie this knot, and keep me in your peace.",
    closingInvocation: "Mary, Undoer of Knots, pray for us who have recourse to thee! (3 times)"
  },
  "surrender-novena": {
    closingPrayer: "O Jesus, I surrender myself to You, take care of everything! Close my eyes and let my soul rest in Your holy will. Free me from anguish, from taking charge of things that belong to You alone. Into Your hands I abandon my family, my health, my sorrows, and my future. You see everything; You love me; You are Almighty.",
    closingInvocation: "O Jesus, I surrender myself to You, take care of everything! (Repeat 10 times in silent peace)"
  },
  "divine-mercy-novena": {
    closingPrayer: "Eternal Father, I offer Thee the Body and Blood, Soul and Divinity of Thy Dearly Beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world. For the sake of His sorrowful Passion, have mercy on us and on the whole world.",
    closingInvocation: "Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world. Jesus, I trust in You! (3 times)"
  },
  "sacred-heart-novena": {
    closingPrayer: "O Divine Heart of Jesus, to Thee I entrust my petition. Look upon me, then do what Thy Heart inspires. Let Thy Heart decide; I rely on It; I have confidence in It; I throw myself upon Its mercy. Lord Jesus, Thou wilt not fail me. Sacred Heart of Jesus, I believe in Thy love for me.",
    closingInvocation: "Sacred Heart of Jesus, I place all my trust in Thee! (3 times)"
  },
  "miraculous-medal-novena": {
    closingPrayer: "O Immaculate Virgin Mary, Mother of Our Lord Jesus and our Mother, penetrated with the most lively confidence in thy all-powerful and never-failing intercession, manifested so often through the Miraculous Medal, we thy loving and trustful children beseech thee to obtain for us the graces and favors we ask during this Novena, if they be for the glory of God and the salvation of our souls.",
    closingInvocation: "O Mary, conceived without sin, pray for us who have recourse to thee! (3 times)"
  },
  "st-michael-novena": {
    closingPrayer: "St. Michael the Archangel, defend us in battle, be our protection against the malice and snares of the devil. May God rebuke him, we humbly pray: and do thou, O Prince of the heavenly host, by the divine power of God, cast into hell Satan and all evil spirits who roam through the world seeking the ruin of souls. Amen.",
    closingInvocation: "Holy Michael the Archangel, defend us in the day of battle, that we may not perish in the dreadful judgment!"
  },
  "st-jude-novena": {
    closingPrayer: "Most holy Apostle, St. Jude, faithful servant and friend of Jesus, the Church honors and invokes thee universally as the patron of difficult and hopeless cases. Pray for me, I am so helpless and alone. Make use, I implore thee, of that particular privilege given to thee, to bring visible and speedy help where help was almost despaired of. Come to my assistance in this great need, that I may receive the consolation and help of heaven in all my tribulations.",
    closingInvocation: "St. Jude, apostle of hope, pray for us and for all who invoke your aid! (3 times)"
  },
  "st-therese-rose-novena": {
    closingPrayer: "St. Thérèse, the Little Flower of Jesus, please pick me a rose from the heavenly garden and send it to me as a message of love. O Little Flower, ask God to grant the favor I now place with confidence in your hands, and tell Him I will love Him each day more and more.",
    closingInvocation: "St. Thérèse of the Child Jesus, patroness of the missions, pray for us! (3 times)"
  },
  "st-joseph-novena": {
    closingPrayer: "O Saint Joseph, whose protection is so great, so strong, so prompt before the throne of God, I place in thee all my interests and desires. O Saint Joseph, assist me by thy powerful intercession and obtain for me from thy Divine Son all spiritual blessings through Jesus Christ, Our Lord, so that having engaged here below thy heavenly power, I may offer my thanksgiving and homage to the most loving of Fathers.",
    closingInvocation: "Saint Joseph, Terror of Demons and Guardian of the Holy Family, pray for us! (3 times)"
  },
  "holy-spirit-novena": {
    closingPrayer: "Come, Holy Spirit, fill the hearts of Thy faithful and enkindle in them the fire of Thy divine love. Send forth Thy Spirit and they shall be created, and Thou shalt renew the face of the earth. O God, who didst instruct the hearts of the faithful by the light of the Holy Spirit, grant us in the same Spirit to be truly wise and ever to rejoice in His holy consolation. Through Christ our Lord.",
    closingInvocation: "Holy Spirit, Lord and Giver of Life, sanctify us and renew our hearts!"
  },
  "st-andrew-christmas-novena": {
    closingPrayer: "Hail and blessed be the hour and the moment in which the Son of God was born of the most pure Virgin Mary, at midnight, in Bethlehem, in piercing cold. In that hour vouchsafe, O my God, to hear my prayer and grant my desires, through the merits of Our Savior Jesus Christ, and of His blessed Mother.",
    closingInvocation: "Come, Lord Jesus, and do not delay! Amen."
  },
  "holy-souls-purgatory": {
    closingPrayer: "Out of the depths I have cried to Thee, O Lord! Lord, hear my voice. Let Thine ears be attentive to the voice of my supplication. If Thou, O Lord, wilt mark iniquities: Lord, who shall stand it? For with Thee there is merciful forgiveness: and by reason of Thy law, I have waited for Thee, O Lord. Eternal rest grant unto them, O Lord, and let perpetual light shine upon them. May the souls of all the faithful departed, through the mercy of God, rest in peace.",
    closingInvocation: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them! Amen."
  }
};

const updated = NOVENAS_DATA.map(n => {
  const extra = CLOSING_PRAYERS[n.id] || {};
  return {
    ...n,
    closingPrayer: extra.closingPrayer || "O Lord Jesus Christ, grant us the graces we seek through this sacred Novena. Amen.",
    closingInvocation: extra.closingInvocation || "Pray for us, that we may be made worthy of the promises of Christ!"
  };
});

fs.writeFileSync(
  "src/data/novenasData.js",
  "export const NOVENAS_DATA = " + JSON.stringify(updated, null, 2) + ";\n",
  "utf8"
);

console.log("Successfully enriched all 12 Novenas with closing prayers and invocations!");
