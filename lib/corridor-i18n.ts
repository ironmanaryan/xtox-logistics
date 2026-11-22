import type { Locale } from "./i18n";

/** Copy for the 56 city-corridor pages and the corridor index. */
type Copy = Record<Locale, string>;

export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

export const corridorCopy: Record<string, Copy> = {
  eyebrow: {
    en: "Packers & Movers · {fromState} → {toState}",
    hi: "पैकर्स एंड मूवर्स · {fromState} → {toState}",
    kn: "ಪ್ಯಾಕರ್ಸ್ ಆ್ಯಂಡ್ ಮೂವರ್ಸ್ · {fromState} → {toState}",
  },
  h1: {
    en: "Packers and movers from {from} to {to}",
    hi: "{from} से {to} तक पैकर्स एंड मूवर्स",
    kn: "{from} ನಿಂದ {to} ಗೆ ಪ್ಯಾಕರ್ಸ್ ಆ್ಯಂಡ್ ಮೂವರ್ಸ್",
  },
  intro: {
    en: "Door-to-door household and office shifting on the {from}–{to} lane, about {km} km by road. Survey first, fixed quote second, tracked delivery last — with a single coordinator for the whole move.",
    hi: "{from}–{to} लेन पर डोर-टू-डोर घरेलू और ऑफिस शिफ्टिंग, सड़क मार्ग से लगभग {km} किमी। पहले सर्वे, फिर फिक्स कोटेशन, अंत में ट्रैक्ड डिलीवरी — पूरी मूव के लिए एक ही कोऑर्डिनेटर।",
    kn: "{from}–{to} ಮಾರ್ಗದಲ್ಲಿ ಬಾಗಿಲಿನಿಂದ ಬಾಗಿಲಿಗೆ ಮನೆ ಮತ್ತು ಕಚೇರಿ ಸ್ಥಳಾಂತರ, ರಸ್ತೆ ಮಾರ್ಗದಲ್ಲಿ ಸುಮಾರು {km} ಕಿ.ಮೀ. ಮೊದಲು ಸಮೀಕ್ಷೆ, ನಂತರ ನಿಶ್ಚಿತ ಕೋಟ್, ಕೊನೆಗೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಿದ ಡೆಲಿವರಿ — ಇಡೀ ಮೂವ್ಗೆ ಒಬ್ಬೇ ಸಂಯೋಜಕ.",
  },
  quoteHeading: {
    en: "How your {from} → {to} quote is built",
    hi: "आपका {from} → {to} कोटेशन कैसे बनता है",
    kn: "ನಿಮ್ಮ {from} → {to} ಕೋಟ್ ಹೇಗೆ ಸಿದ್ಧವಾಗುತ್ತದೆ",
  },
  quoteLead: {
    en: "Every move is priced after we see the actual requirement — not from a printed rate card.",
    hi: "हर मूव की कीमत असली ज़रूरत देखने के बाद तय होती है — किसी छपे हुए रेट कार्ड से नहीं।",
    kn: "ಪ್ರತಿ ಮೂವ್ನ ಬೆಲೆ ನಿಜವಾದ ಅಗತ್ಯವನ್ನು ನೋಡಿದ ನಂತರವೇ ನಿಗದಿಯಾಗುತ್ತದೆ — ಮುದ್ರಿತ ದರ ಪಟ್ಟಿಯಿಂದ ಅಲ್ಲ.",
  },
  factorSize: {
    en: "Home or office size and actual volume of goods",
    hi: "घर या ऑफिस का आकार और सामान की असली मात्रा",
    kn: "ಮನೆ ಅಥವಾ ಕಚೇರಿಯ ಗಾತ್ರ ಮತ್ತು ಸರಕಿನ ನಿಜವಾದ ಪ್ರಮಾಣ",
  },
  factorAccess: {
    en: "Floor and lift access at both addresses",
    hi: "दोनों पतों पर फ्लोर और लिफ्ट एक्सेस",
    kn: "ಎರಡೂ ವಿಳಾಸಗಳಲ್ಲಿ ಮಹಡಿ ಮತ್ತು ಲಿಫ್ಟ್ ಪ್ರವೇಶ",
  },
  factorPacking: {
    en: "Packing material needed for fragile items",
    hi: "नाज़ुक सामान के लिए ज़रूरी पैकिंग सामग्री",
    kn: "ಸೂಕ್ಷ್ಮ ವಸ್ತುಗಳಿಗೆ ಬೇಕಾದ ಪ್ಯಾಕಿಂಗ್ ಸಾಮಗ್ರಿ",
  },
  factorInsurance: {
    en: "Declared value for transit insurance",
    hi: "ट्रांज़िट बीमा के लिए घोषित मूल्य",
    kn: "ಸಾಗಣೆ ವಿಮೆಗೆ ಘೋಷಿತ ಮೌಲ್ಯ",
  },
  factorDate: {
    en: "Shifting date and pickup flexibility",
    hi: "शिफ्टिंग की तारीख और पिकअप में लचीलापन",
    kn: "ಸ್ಥಳಾಂತರ ದಿನಾಂಕ ಮತ್ತು ಪಿಕಪ್ ಹೊಂದಿಕೊಳ್ಳುವಿಕೆ",
  },
  factorTolls: {
    en: "Tolls, permits and any storage in transit",
    hi: "टोल, परमिट और ट्रांज़िट में भंडारण",
    kn: "ಟೋಲ್, ಪರವಾನಗಿ ಮತ್ತು ಸಾಗಣೆಯಲ್ಲಿ ಸಂಗ್ರಹಣೆ",
  },
  priceTitle: {
    en: "Get your exact price for this lane.",
    hi: "इस लेन के लिए अपनी सटीक कीमत पाएं।",
    kn: "ಈ ಮಾರ್ಗಕ್ಕೆ ನಿಮ್ಮ ನಿಖರ ಬೆಲೆ ಪಡೆಯಿರಿ.",
  },
  priceBody: {
    en: "Add your home size, floors and shifting date — our move desk calls back within {promise} with a fixed quote.",
    hi: "अपने घर का आकार, फ्लोर और शिफ्टिंग की तारीख भरें — हमारा मूव डेस्क {promise} के भीतर फिक्स कोटेशन के साथ कॉल करता है।",
    kn: "ನಿಮ್ಮ ಮನೆಯ ಗಾತ್ರ, ಮಹಡಿ ಮತ್ತು ಸ್ಥಳಾಂತರ ದಿನಾಂಕ ತಿಳಿಸಿ — ನಮ್ಮ ಮೂವ್ ಡೆಸ್ಕ್ {promise} ಒಳಗೆ ನಿಶ್ಚಿತ ಕೋಟ್ನೊಂದಿಗೆ ಕರೆ ಮಾಡುತ್ತದೆ.",
  },
  startQuote: {
    en: "Start my quote",
    hi: "मेरा कोटेशन शुरू करें",
    kn: "ನನ್ನ ಕೋಟ್ ಪ್ರಾರಂಭಿಸಿ",
  },
  includesHeading: {
    en: "What the move includes",
    hi: "मूव में क्या शामिल है",
    kn: "ಮೂವ್ನಲ್ಲಿ ಏನೆಲ್ಲಾ ಸೇರಿದೆ",
  },
  inc1: {
    en: "Free video or in-person survey before quoting",
    hi: "कोटेशन से पहले मुफ़्त वीडियो या व्यक्तिगत सर्वे",
    kn: "ಕೋಟ್ಗೆ ಮೊದಲು ಉಚಿತ ವೀಡಿಯೊ ಅಥವಾ ವೈಯಕ್ತಿಕ ಸಮೀಕ್ಷೆ",
  },
  inc2: {
    en: "Multi-layer packing: bubble wrap, foam, corrugated sheets",
    hi: "मल्टी-लेयर पैकिंग: बबल रैप, फोम, कॉरुगेटेड शीट",
    kn: "ಬಹು-ಪದರ ಪ್ಯಾಕಿಂಗ್: ಬಬಲ್ ರ್ಯಾಪ್, ಫೋಮ್, ಕಾರ್ಗೇಟೆಡ್ ಶೀಟ್",
  },
  inc3: {
    en: "Dedicated closed-body vehicle for household goods",
    hi: "घरेलू सामान के लिए समर्पित बंद वाहन",
    kn: "ಮನೆ ಸರಕಿಗೆ ಮೀಸಲು ಮುಚ್ಚಿದ ವಾಹನ",
  },
  inc4: {
    en: "Loading, unloading and basic reassembly",
    hi: "लोडिंग, अनलोडिंग और बेसिक री-असेम्बली",
    kn: "ಲೋಡಿಂಗ್, ಅನ್ಲೋಡಿಂಗ್ ಮತ್ತು ಮೂಲ ಜೋಡಣೆ",
  },
  inc5: {
    en: "Transit insurance at declared value",
    hi: "घोषित मूल्य पर ट्रांज़िट बीमा",
    kn: "ಘೋಷಿತ ಮೌಲ್ಯದ ಮೇಲೆ ಸಾಗಣೆ ವಿಮೆ",
  },
  inc6: {
    en: "GST invoice and digital proof of delivery",
    hi: "GST इनवॉइस और डिजिटल डिलीवरी प्रमाण",
    kn: "GST ಇನ್ವಾಯ್ಸ್ ಮತ್ತು ಡಿಜಿಟಲ್ ಡೆಲಿವರಿ ಪುರಾವೆ",
  },
  routeNotes: {
    en: "Route notes",
    hi: "रूट नोट्स",
    kn: "ಮಾರ್ಗ ಟಿಪ್ಪಣಿಗಳು",
  },
  transit: {
    en: "Transit estimate: ~{days} day(s) after loading",
    hi: "ट्रांज़िट अनुमान: लोडिंग के बाद ~{days} दिन",
    kn: "ಸಾಗಣೆ ಅಂದಾಜು: ಲೋಡಿಂಗ್ ನಂತರ ~{days} ದಿನ",
  },
  toAreas: {
    en: "{to} areas we cover",
    hi: "{to} के कवर किए जाने वाले क्षेत्र",
    kn: "ನಾವು ಒಳಗೊಳ್ಳುವ {to} ಪ್ರದೇಶಗಳು",
  },
  fromAreas: {
    en: "Pickup areas in {from}",
    hi: "{from} में पिकअप क्षेत्र",
    kn: "{from} ನಲ್ಲಿ ಪಿಕಪ್ ಪ್ರದೇಶಗಳು",
  },
  faqHeading: {
    en: "{from} to {to} moving questions",
    hi: "{from} से {to} तक मूविंग से जुड़े सवाल",
    kn: "{from} ನಿಂದ {to} ಗೆ ಸ್ಥಳಾಂತರ ಪ್ರಶ್ನೆಗಳು",
  },
  faq1q: {
    en: "How long does a move from {from} to {to} take?",
    hi: "{from} से {to} तक मूव में कितना समय लगता है?",
    kn: "{from} ನಿಂದ {to} ಗೆ ಮೂವ್ಗೆ ಎಷ್ಟು ಸಮಯ ಬೇಕು?",
  },
  faq1a: {
    en: "The road distance is roughly {km} km. Most household moves on this lane reach {to} in about {days} day(s) after loading, depending on vehicle type and any part-load consolidation.",
    hi: "सड़क मार्ग से दूरी लगभग {km} किमी है। इस लेन पर ज़्यादातर घरेलू मूव्स लोडिंग के बाद करीब {days} दिन में {to} पहुंच जाते हैं, जो वाहन के प्रकार और पार्ट-लोड कंसॉलिडेशन पर निर्भर करता है।",
    kn: "ರಸ್ತೆ ಮಾರ್ಗದ ದೂರ ಸುಮಾರು {km} ಕಿ.ಮೀ. ಈ ಮಾರ್ಗದಲ್ಲಿ ಹೆಚ್ಚಿನ ಮನೆ ಸ್ಥಳಾಂತರಗಳು ಲೋಡಿಂಗ್ ನಂತರ ಸುಮಾರು {days} ದಿನಗಳಲ್ಲಿ {to} ತಲುಪುತ್ತವೆ; ಇದು ವಾಹನದ ಪ್ರಕಾರ ಮತ್ತು ಭಾಗ-ಲೋಡ್ ಸಮೀಕರಣವನ್ನು ಅವಲಂಬಿಸಿದೆ.",
  },
  faq2q: {
    en: "What does a {from} to {to} move cost?",
    hi: "{from} से {to} तक मूव का खर्च क्या है?",
    kn: "{from} ನಿಂದ {to} ಗೆ ಮೂವ್ ವೆಚ್ಚ ಎಷ್ಟು?",
  },
  faq2a: {
    en: "We share your price after a free survey that counts actual volume, floor and lift access, packing material and insurance value. Add your move details in the quote form and an executive confirms the fixed amount within {promise}.",
    hi: "असली वॉल्यूम, फ्लोर और लिफ्ट एक्सेस, पैकिंग सामग्री और बीमा मूल्य देखने वाले मुफ़्त सर्वे के बाद हम कीमत बताते हैं। कोटेशन फ़ॉर्म में अपनी मूव डिटेल भरें और हमारा एग्ज़ीक्यूटिव {promise} के भीतर फिक्स राशि की पुष्टि करता है।",
    kn: "ನಿಜವಾದ ಪ್ರಮಾಣ, ಮಹಡಿ ಮತ್ತು ಲಿಫ್ಟ್ ಪ್ರವೇಶ, ಪ್ಯಾಕಿಂಗ್ ಸಾಮಗ್ರಿ ಮತ್ತು ವಿಮಾ ಮೌಲ್ಯವನ್ನು ಪರಿಗಣಿಸುವ ಉಚಿತ ಸಮೀಕ್ಷೆಯ ನಂತರ ನಾವು ಬೆಲೆ ತಿಳಿಸುತ್ತೇವೆ. ಕೋಟ್ ಫಾರ್ಮ್ನಲ್ಲಿ ನಿಮ್ಮ ಮೂವ್ ವಿವರ ಭರ್ತಿ ಮಾಡಿ, ನಮ್ಮ ಕಾರ್ಯನಿರ್ವಾಹಕರು {promise} ಒಳಗೆ ನಿಶ್ಚಿತ ಮೊತ್ತ ಖಚಿತಪಡಿಸುತ್ತಾರೆ.",
  },
  faq3q: {
    en: "Is my goods protected during transit?",
    hi: "ट्रांज़िट के दौरान मेरा सामान सुरक्षित रहता है?",
    kn: "ಸಾಗಣೆಯ ಸಮಯದಲ್ಲಿ ನನ್ನ ಸರಕು ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆಯೇ?",
  },
  faq3a: {
    en: "Yes — transit insurance is offered on every move and the declared value of your goods is agreed before loading. Damage claims are accepted in writing within {days} days of delivery, with photographs and the delivery receipt.",
    hi: "हां — हर मूव में ट्रांज़िट बीमा दिया जाता है और लोडिंग से पहले आपके सामान का घोषित मूल्य तय किया जाता है। डिलीवरी के {days} दिनों के भीतर फ़ोटो और डिलीवरी रसीद के साथ लिखित में नुकसान का दावा स्वीकार किया जाता है।",
    kn: "ಹೌದು — ಪ್ರತಿ ಮೂವ್ಗೂ ಸಾಗಣೆ ವಿಮೆ ನೀಡಲಾಗುತ್ತದೆ ಮತ್ತು ಲೋಡಿಂಗ್ಗೆ ಮೊದಲು ನಿಮ್ಮ ಸರಕಿನ ಘೋಷಿತ ಮೌಲ್ಯ ಒಪ್ಪಿಕೊಳ್ಳಲಾಗುತ್ತದೆ. ಡೆಲಿವರಿಯ {days} ದಿನಗಳೊಳಗೆ ಫೋಟೋ ಮತ್ತು ಡೆಲಿವರಿ ರಸೀದಿಯೊಂದಿಗೆ ಲಿಖಿತವಾಗಿ ಹಾನಿ ಕ್ಲೇಮ್ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ.",
  },
  otherLanes: {
    en: "Other lanes",
    hi: "अन्य लेन",
    kn: "ಇತರ ಮಾರ್ಗಗಳು",
  },
  allCities: {
    en: "All {count} cities",
    hi: "सभी {count} शहर",
    kn: "ಎಲ್ಲಾ {count} ನಗರಗಳು",
  },
  indexEyebrow: {
    en: "Packers & Movers · Routes",
    hi: "पैकर्स एंड मूवर्स · रूट्स",
    kn: "ಪ್ಯಾಕರ್ಸ್ ಆ್ಯಂಡ್ ಮೂವರ್ಸ್ · ಮಾರ್ಗಗಳು",
  },
  indexH1: {
    en: "Moving between India's working cities.",
    hi: "भारत के कामकाजी शहरों के बीच शिफ्टिंग।",
    kn: "ಭಾರತದ ಕೆಲಸದ ನಗರಗಳ ನಡುವೆ ಸ್ಥಳಾಂತರ.",
  },
  indexLead: {
    en: "Pick your lane for the transit time and the areas we cover on both ends. Every route gets a free survey before the quote is fixed.",
    hi: "ट्रांज़िट समय और दोनों सिरों पर कवर होने वाले क्षेत्रों के लिए अपनी लेन चुनें। कोटेशन फिक्स होने से पहले हर रूट का मुफ़्त सर्वे होता है।",
    kn: "ಸಾಗಣೆ ಸಮಯ ಮತ್ತು ಎರಡೂ ತುದಿಗಳಲ್ಲಿ ನಾವು ಒಳಗೊಳ್ಳುವ ಪ್ರದೇಶಗಳಿಗಾಗಿ ನಿಮ್ಮ ಮಾರ್ಗ ಆಯ್ಕೆಮಾಡಿ. ಕೋಟ್ ಖಚಿತವಾಗುವ ಮೊದಲು ಪ್ರತಿ ಮಾರ್ಗಕ್ಕೂ ಉಚಿತ ಸಮೀಕ್ಷೆ ನಡೆಯುತ್ತದೆ.",
  },
  fixedQuote: {
    en: "Get a fixed quote",
    hi: "फिक्स कोटेशन पाएं",
    kn: "ನಿಶ್ಚಿತ ಕೋಟ್ ಪಡೆಯಿರಿ",
  },
  fromCity: {
    en: "From {city}",
    hi: "{city} से",
    kn: "{city} ನಿಂದ",
  },
  routeLink: {
    en: "Packers and movers {from} to {to}",
    hi: "{from} से {to} तक पैकर्स एंड मूवर्स",
    kn: "{from} ನಿಂದ {to} ಗೆ ಪ್ಯಾಕರ್ಸ್ ಆ್ಯಂಡ್ ಮೂವರ್ಸ್",
  },
};

export const cityBlurbs: Record<string, Copy> = {
  bengaluru: {
    en: "Our home base — same-day surveys and next-day pickups across BTM, HSR, Whitefield, Indiranagar and the ORR tech belt.",
    hi: "हमारा होम बेस — BTM, HSR, व्हाइटफील्ड, इंदिरानगर और ORR टेक बेल्ट में उसी दिन सर्वे और अगले दिन पिकअप।",
    kn: "ನಮ್ಮ ಮೂಲ ನಗರ — BTM, HSR, ವೈಟ್ಫೀಲ್ಡ್, ಇಂದಿರಾನಗರ ಮತ್ತು ORR ಟೆಕ್ ಬೆಲ್ಟ್ನಲ್ಲಿ ಅದೇ ದಿನ ಸಮೀಕ್ಷೆ, ಮರುದಿನ ಪಿಕಪ್.",
  },
  hyderabad: {
    en: "A dense IT corridor move on the Bengaluru–Hyderabad lane, usually a single overnight drive on the NH44 route.",
    hi: "बेंगलुरु–हैदराबाद लेन पर घने IT कॉरिडोर की मूव, आमतौर पर NH44 रूट पर एक ही रात की ड्राइव।",
    kn: "ಬೆಂಗಳೂರು–ಹೈದರಾಬಾದ್ ಮಾರ್ಗದಲ್ಲಿ ದಟ್ಟ IT ಕಾರಿಡಾರ್ ಸ್ಥಳಾಂತರ, ಸಾಮಾನ್ಯವಾಗಿ NH44 ಮಾರ್ಗದಲ್ಲಿ ಒಂದೇ ರಾತ್ರಿಯ ಪ್ರಯಾಣ.",
  },
  chennai: {
    en: "Short-haul intercity moves and part-load freight, with regular departures through Hosur and Krishnagiri.",
    hi: "होसुर और कृष्णागिरि से नियमित रवानगी के साथ शॉर्ट-हॉल इंटरसिटी मूव्स और पार्ट-लोड फ्रेट।",
    kn: "ಹೊಸೂರು ಮತ್ತು ಕೃಷ್ಣಗಿರಿ ಮೂಲಕ ನಿಯಮಿತ ಹೊರಡುವಿಕೆಯೊಂದಿಗೆ ಸಣ್ಣ ದೂರದ ಅಂತರನಗರ ಸ್ಥಳಾಂತರ ಮತ್ತು ಭಾಗ-ಲೋಡ್ ಸರಕು.",
  },
  mumbai: {
    en: "Long-haul household and office moves; building access, lift dimensions and society NOCs are checked before the move date.",
    hi: "लंबी दूरी के घरेलू और ऑफिस मूव्स; मूव की तारीख से पहले बिल्डिंग एक्सेस, लिफ्ट साइज़ और सोसाइटी NOC जांचे जाते हैं।",
    kn: "ದೂರದ ಮನೆ ಮತ್ತು ಕಚೇರಿ ಸ್ಥಳಾಂತರ; ಮೂವ್ ದಿನಾಂಕಕ್ಕೆ ಮೊದಲು ಕಟ್ಟಡ ಪ್ರವೇಶ, ಲಿಫ್ಟ್ ಗಾತ್ರ ಮತ್ತು ಸೊಸೈಟಿ NOC ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
  },
  pune: {
    en: "A common lane for relocating employees between the two tech hubs, with shared-load options for smaller homes.",
    hi: "दो टेक हब्स के बीच कर्मचारियों को शिफ्ट करने की आम लेन, छोटे घरों के लिए शेयर्ड-लोड विकल्प के साथ।",
    kn: "ಎರಡು ಟೆಕ್ ಕೇಂದ್ರಗಳ ನಡುವೆ ಉದ್ಯೋಗಿಗಳನ್ನು ಸ್ಥಳಾಂತರಿಸುವ ಸಾಮಾನ್ಯ ಮಾರ್ಗ, ಸಣ್ಣ ಮನೆಗಳಿಗೆ ಹಂಚಿದ ಲೋಡ್ ಆಯ್ಕೆಗಳೊಂದಿಗೆ.",
  },
  delhi: {
    en: "Our longest domestic corridor — typically a 4–6 day transit with a dedicated vehicle and daily position updates.",
    hi: "हमारा सबसे लंबा घरेलू कॉरिडोर — आमतौर पर समर्पित वाहन और रोज़ की पोज़िशन अपडेट के साथ 4–6 दिन का ट्रांज़िट।",
    kn: "ನಮ್ಮ ದೀರ್ಘ ದೇಶೀಯ ಮಾರ್ಗ — ಸಾಮಾನ್ಯವಾಗಿ ಮೀಸಲು ವಾಹನ ಮತ್ತು ದೈನಂದಿನ ಸ್ಥಾನ ನವೀಕರಣಗಳೊಂದಿಗೆ 4–6 ದಿನಗಳ ಸಾಗಣೆ.",
  },
  kochi: {
    en: "Coastal and hill-route moves handled by crews used to narrow access roads, with optional storage in transit.",
    hi: "तटीय और पहाड़ी रूट की मूव्स, संकरी एक्सेस सड़कों के आदी क्रू द्वारा, ट्रांज़िट में वैकल्पिक स्टोरेज के साथ।",
    kn: "ಕರಾವಳಿ ಮತ್ತು ಬೆಟ್ಟದ ಮಾರ್ಗಗಳ ಸ್ಥಳಾಂತರ, ಸಣ್ಣ ಪ್ರವೇಶ ರಸ್ತೆಗಳಿಗೆ ಒಗ್ಗಿದ ತಂಡಗಳಿಂದ, ಸಾಗಣೆಯಲ್ಲಿ ಐಚ್ಛಿಕ ಸಂಗ್ರಹಣೆಯೊಂದಿಗೆ.",
  },
  coimbatore: {
    en: "A steady SME freight lane for textiles and engineering goods, plus household shifts on the same route.",
    hi: "कपड़ा और इंजीनियरिंग सामान के लिए स्थिर SME फ्रेट लेन, साथ ही उसी रूट पर घरेलू शिफ्टिंग।",
    kn: "ಜವಳಿ ಮತ್ತು ಎಂಜಿನಿಯರಿಂಗ್ ಸರಕುಗಳಿಗೆ ಸ್ಥಿರ SME ಸರಕು ಮಾರ್ಗ, ಜೊತೆಗೆ ಅದೇ ಮಾರ್ಗದಲ್ಲಿ ಮನೆ ಸ್ಥಳಾಂತರ.",
  },
};
